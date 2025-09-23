"use client";

import { Loader2 } from "lucide-react";
import { useLoading } from "./loading-provider";
import { cn } from "@/lib/utils";

export function LoadingOverlay() {
  const { isLoading } = useLoading();

  return (
    <div className={cn(
        "fixed top-6 right-6 z-50 transition-opacity duration-300",
        isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
    )}>
      <div className="flex items-center gap-3 rounded-full bg-background/90 p-3 shadow-lg backdrop-blur-sm border">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-sm font-medium text-foreground pr-2">Cargando...</span>
      </div>
    </div>
  );
}
