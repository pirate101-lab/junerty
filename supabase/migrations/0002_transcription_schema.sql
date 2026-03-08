-- ============================================================
-- Migration: 0002_transcription_schema
-- Description: Adds the transcription_submissions table, RLS
--              policies, and an automated payout trigger that
--              inserts a completed transaction whenever an admin
--              approves a submission.
-- ============================================================

-- ============================================================
-- Prerequisite: extend the transaction_type constraint on the
-- existing transactions table to accept 'transcription_reward'.
-- ============================================================
ALTER TABLE public.transactions
  DROP CONSTRAINT IF EXISTS transactions_transaction_type_check;

ALTER TABLE public.transactions
  ADD CONSTRAINT transactions_transaction_type_check
    CHECK (transaction_type IN ('media_watch', 'mpesa_withdrawal', 'transcription_reward'));

-- ------------------------------------------------------------
-- STEP 1: transcription_submissions
--   Stores user-submitted text transcripts for media files.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.transcription_submissions (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id        UUID        NOT NULL REFERENCES public.media_tasks (id) ON DELETE CASCADE,
  user_id        UUID        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  submitted_text TEXT        NOT NULL,
  status         TEXT        NOT NULL DEFAULT 'pending_review'
                               CHECK (status IN ('pending_review', 'approved', 'rejected')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_at    TIMESTAMPTZ
);

-- Index to speed up per-user lookups and admin queue queries.
CREATE INDEX IF NOT EXISTS idx_transcription_submissions_user_id
  ON public.transcription_submissions (user_id);

CREATE INDEX IF NOT EXISTS idx_transcription_submissions_status
  ON public.transcription_submissions (status);

CREATE INDEX IF NOT EXISTS idx_transcription_submissions_task_id
  ON public.transcription_submissions (task_id);

-- ------------------------------------------------------------
-- STEP 2: Row Level Security
-- ------------------------------------------------------------
ALTER TABLE public.transcription_submissions ENABLE ROW LEVEL SECURITY;

-- 2a. Users can insert their own submissions.
CREATE POLICY "transcription_submissions_insert_own"
  ON public.transcription_submissions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 2b. Users can select only their own submissions to view status.
CREATE POLICY "transcription_submissions_select_own"
  ON public.transcription_submissions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- (Admins bypass RLS by connecting with the Service Role key.)

-- ------------------------------------------------------------
-- STEP 3: Automated Payout Trigger
--
-- When a submission is updated from 'pending_review' →
-- 'approved', automatically insert a completed transaction
-- so the wallet trigger in migration 0001 fires and credits
-- the user's coin balance.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_transcription_approval()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_reward_coins INTEGER;
BEGIN
  -- Only act when status transitions from pending_review to approved.
  IF NEW.status <> 'approved' OR OLD.status <> 'pending_review' THEN
    RETURN NEW;
  END IF;

  -- Stamp the reviewed_at timestamp.
  NEW.reviewed_at := now();

  -- Look up the reward amount for this media task.
  SELECT reward_coins
    INTO v_reward_coins
    FROM public.media_tasks
   WHERE id = NEW.task_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION
      'media_task % not found', NEW.task_id;
  END IF;

  IF v_reward_coins IS NULL THEN
    RAISE EXCEPTION
      'media_task % has no reward_coins set', NEW.task_id;
  END IF;

  -- Insert the payout transaction.
  -- The wallet trigger (trg_update_wallet_on_completed_transaction) defined in
  -- migration 0001 will automatically credit the user's coin balance.
  INSERT INTO public.transactions (
    user_id,
    task_id,
    amount,
    transaction_type,
    status
  ) VALUES (
    NEW.user_id,
    NEW.task_id,
    v_reward_coins,
    'transcription_reward',
    'completed'
  );

  RETURN NEW;
END;
$$;

-- Revoke public execute; only the trigger may call this function.
REVOKE ALL ON FUNCTION public.handle_transcription_approval() FROM PUBLIC;

CREATE TRIGGER trg_transcription_approval_payout
  BEFORE UPDATE ON public.transcription_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_transcription_approval();
