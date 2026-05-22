"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck2, Compass, ListChecks, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Today", icon: CalendarCheck2 },
  { href: "/checklist", label: "Checklist", icon: ListChecks },
  { href: "/participants", label: "Peserta", icon: UsersRound },
  { href: "/guide", label: "Guide", icon: Compass }
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md px-4 pb-4">
      <div className="safe-bottom grid grid-cols-4 rounded-full border border-white/70 bg-white/86 p-1.5 shadow-nav backdrop-blur-xl">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center gap-1 rounded-full text-xs font-bold text-ink/70 transition",
                active && "bg-[#ECE9E2] text-ink"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={active ? 3 : 2.4} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
