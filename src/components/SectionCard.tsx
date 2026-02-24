import { ReactNode } from "react";

interface SectionCardProps {
  icon: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function SectionCard({ icon, title, children, className = "" }: SectionCardProps) {
  return (
    <div className={`bg-white rounded-2xl p-4 border border-[#e5e7eb] ${className}`}>
      <p className="text-xs font-semibold text-[#4b5563] uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <span>{icon}</span> {title}
      </p>
      {children}
    </div>
  );
}
