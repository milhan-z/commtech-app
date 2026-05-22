import { cn } from "@/lib/utils";

type OrganicCardProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "button" | "section";
} & React.HTMLAttributes<HTMLElement>;

export function OrganicCard({
  children,
  className,
  as,
  ...props
}: OrganicCardProps) {
  const Component = as || "div";
  return (
    <Component
      {...(props as Record<string, unknown>)}
      className={cn(
        "rounded-[2rem] border border-border bg-card p-5 text-left shadow-organic",
        className
      )}
    >
      {children}
    </Component>
  );
}
