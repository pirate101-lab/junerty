import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  /** If provided, the logo is wrapped in a link to this href */
  href?: string;
  /** Extra class names on the outer wrapper */
  className?: string;
  /** Size of the logo square (px). Defaults to 40. */
  size?: number;
  /** Whether to show the brand name text next to the logo. Defaults to true. */
  showName?: boolean;
  /** Click handler (e.g. to close a mobile sidebar) */
  onClick?: () => void;
}

export function BrandLogo({
  href,
  className,
  size = 40,
  showName = true,
  onClick,
}: BrandLogoProps) {
  const content = (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/synthgraphix-logo.svg"
        alt="SYNTHGRAPHIX"
        width={size}
        height={size}
        className="shrink-0 rounded-lg"
        priority
      />
      {showName && (
        <span className="brand-gradient text-lg font-extrabold tracking-wide">
          SYNTHGRAPHIX
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} onClick={onClick} className="flex items-center" aria-label="SYNTHGRAPHIX home">
        {content}
      </Link>
    );
  }

  return content;
}
