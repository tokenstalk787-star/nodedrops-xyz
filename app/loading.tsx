import { Cpu } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-md text-center flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-brand-purple/20 border border-brand-purple/50 flex items-center justify-center shadow-glow-purple animate-pulse">
          <Cpu className="w-8 h-8 text-brand-cyan animate-spin" />
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-bold text-white tracking-tight">Loading NodeDrops...</h3>
        <p className="text-xs text-text-muted font-mono">Synchronizing state with peers</p>
      </div>
    </div>
  );
}
