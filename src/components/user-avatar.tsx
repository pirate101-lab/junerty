const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-teal-500",
];

interface UserAvatarProps {
  name?: string | null;
  email: string;
  size?: "sm" | "md";
}

export function UserAvatar({ name, email, size = "md" }: UserAvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : email.slice(0, 2).toUpperCase();
  const color = AVATAR_COLORS[(initials.charCodeAt(0) ?? 0) % AVATAR_COLORS.length];
  const sizeClass = size === "sm" ? "h-7 w-7 text-xs" : "h-8 w-8 text-xs";
  return (
    <div
      className={`flex items-center justify-center rounded-full ${color} font-semibold text-white shrink-0 ${sizeClass}`}
    >
      {initials}
    </div>
  );
}
