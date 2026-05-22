"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function DetailDrawer({
  open,
  onOpenChange,
  title,
  children,
  className
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in" />
        <Dialog.Content
          className={cn(
            "fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[86vh] max-w-md overflow-y-auto rounded-t-[2.25rem] border border-border bg-background p-5 shadow-nav outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-full",
            className
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <Dialog.Title className="font-serif text-3xl leading-none">{title}</Dialog.Title>
            <Dialog.Close className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
