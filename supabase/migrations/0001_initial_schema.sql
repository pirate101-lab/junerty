-- ============================================================
-- Migration: 0001_initial_schema
-- Description: Creates media_tasks, user_wallets, and transactions
--              tables with RLS and an auto-balance trigger.
-- ============================================================

-- ------------------------------------------------------------
-- 1. media_tasks
--    Stores cached media fetched from the Coverr API.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_tasks (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  coverr_asset_id  TEXT        UNIQUE NOT NULL,
  media_type       TEXT        NOT NULL DEFAULT 'video',
  stream_url       TEXT        NOT NULL,
  title            TEXT        NOT NULL,
  category         TEXT,
  reward_coins     INTEGER     NOT NULL CHECK (reward_coins >= 0),
  is_active        BOOLEAN     NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.media_tasks ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read active tasks.
CREATE POLICY "media_tasks_select"
  ON public.media_tasks
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Only the service role may insert / update / delete.
CREATE POLICY "media_tasks_service_write"
  ON public.media_tasks
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------
-- 2. user_wallets
--    Single source of truth for each user's coin balance.
--    Frontends must NEVER update this table directly; all
--    balance changes happen through the transactions trigger.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_wallets (
  user_id                UUID        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  balance_coins          INTEGER     NOT NULL DEFAULT 0 CHECK (balance_coins >= 0),
  total_earned_lifetime  INTEGER     NOT NULL DEFAULT 0 CHECK (total_earned_lifetime >= 0),
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;

-- Users may read only their own wallet.
CREATE POLICY "user_wallets_select_own"
  ON public.user_wallets
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Nobody (including authenticated users) may write directly.
-- All mutations happen through the trigger on transactions.
CREATE POLICY "user_wallets_no_direct_write"
  ON public.user_wallets
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- The service role retains full access for administrative tasks.
CREATE POLICY "user_wallets_service_write"
  ON public.user_wallets
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ------------------------------------------------------------
-- 3. transactions
--    Immutable audit ledger.  Positive amounts = credits,
--    negative amounts = debits.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transactions (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  task_id          UUID        REFERENCES public.media_tasks (id) ON DELETE SET NULL,
  amount           INTEGER     NOT NULL,
  transaction_type TEXT        NOT NULL CHECK (transaction_type IN ('media_watch', 'mpesa_withdrawal')),
  status           TEXT        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users may read only their own transactions.
CREATE POLICY "transactions_select_own"
  ON public.transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users may insert transactions for themselves only.
CREATE POLICY "transactions_insert_own"
  ON public.transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Rows are immutable once created (no UPDATE / DELETE for regular users).
CREATE POLICY "transactions_no_update"
  ON public.transactions
  FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "transactions_no_delete"
  ON public.transactions
  FOR DELETE
  TO authenticated
  USING (false);

-- The service role retains full access.
CREATE POLICY "transactions_service_write"
  ON public.transactions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Trigger: update_wallet_on_completed_transaction
--
-- After every INSERT on transactions where status = 'completed',
-- this function upserts the matching user_wallets row:
--   • Adds the transaction amount to balance_coins.
--   • Adds the amount to total_earned_lifetime only when the
--     amount is positive (credit transactions).
--
-- Using FOR EACH ROW + SECURITY DEFINER means the trigger
-- always runs with elevated privileges even when the INSERT
-- was performed by a low-privilege authenticated user, so the
-- wallet update cannot be blocked by RLS.
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_wallet_on_completed_transaction()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only act on rows that are completed.
  IF NEW.status <> 'completed' THEN
    RETURN NEW;
  END IF;

  -- For debit transactions (negative amount) the wallet must already exist and
  -- have a sufficient balance.  We never auto-create a wallet with a negative
  -- or zero opening balance caused by a debit.
  IF NEW.amount < 0 THEN
    UPDATE public.user_wallets
    SET
      balance_coins = balance_coins + NEW.amount,
      updated_at    = now()
    WHERE user_id = NEW.user_id;

    IF NOT FOUND THEN
      RAISE EXCEPTION
        'Wallet does not exist for user % – cannot process debit transaction', NEW.user_id;
    END IF;

    -- Check that the balance never goes below zero after the debit.
    IF (SELECT balance_coins FROM public.user_wallets WHERE user_id = NEW.user_id) < 0 THEN
      RAISE EXCEPTION
        'Insufficient balance for user % – debit of % coins would exceed available funds',
        NEW.user_id, ABS(NEW.amount);
    END IF;

    RETURN NEW;
  END IF;

  -- For credit transactions (positive amount) upsert the wallet row.
  INSERT INTO public.user_wallets (user_id, balance_coins, total_earned_lifetime)
  VALUES (
    NEW.user_id,
    NEW.amount,   -- opening balance for a brand-new wallet
    NEW.amount    -- opening lifetime earnings for a brand-new wallet
  )
  ON CONFLICT (user_id) DO UPDATE
    SET
      balance_coins         = user_wallets.balance_coins + NEW.amount,
      total_earned_lifetime = user_wallets.total_earned_lifetime + NEW.amount,
      updated_at            = now();

  RETURN NEW;
END;
$$;

-- Revoke public execute permission; only the trigger may invoke this function.
REVOKE ALL ON FUNCTION public.update_wallet_on_completed_transaction() FROM PUBLIC;

CREATE TRIGGER trg_update_wallet_on_completed_transaction
  AFTER INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_wallet_on_completed_transaction();
