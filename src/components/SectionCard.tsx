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
      <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px] mb-3
                    flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#1e5f74" }} />
        <span>{icon}</span> {title}
      </p>
      {children}
    </div>
  );
}