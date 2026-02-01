import Link from "next/link";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  variant?: "full" | "icon";
  className?: string;
}

export function Logo({ variant = "full", className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2", className)}
      aria-label="BrickX home"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Brick body */}
        <rect
          x="2"
          y="10"
          width="24"
          height="16"
          rx="2"
          className="fill-primary"
        />
        {/* Brick studs */}
        <rect
          x="5"
          y="6"
          width="6"
          height="5"
          rx="1"
          className="fill-primary"
        />
        <rect
          x="17"
          y="6"
          width="6"
          height="5"
          rx="1"
          className="fill-primary"
        />
        {/* Highlight */}
        <rect
          x="4"
          y="12"
          width="20"
          height="2"
          rx="1"
          className="fill-primary-foreground/20"
        />
      </svg>
      {variant === "full" && (
        <span className="text-xl font-bold tracking-tight">
          Brick<span className="text-primary">X</span>
        </span>
      )}
    </Link>
  );
}
