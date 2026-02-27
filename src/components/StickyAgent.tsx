import { PropertyType, UserSettingsType, UserTypeEnum } from "@/types";
import { generateWhatsAppLink } from "@/utils/generateWhatsappLink";
import { Call3DIcon, GmailMinimalIcon, WhatsAppMinimalIcon } from "./Icons";
import { normalizePhone } from "@/utils/normalizePhone";
import Image from "next/image";

// ─── Brand palette ────────────────────────────────────────────────────────────
// Teal dark:#143d4d  Teal:#1e5f74  Teal-light:#e0f0f5  Gold:#f0a500
// ─────────────────────────────────────────────────────────────────────────────

const USER_TYPE_LABEL: Record<string, string> = {
  [UserTypeEnum.Individual]: "Property Owner",
  [UserTypeEnum.Agent]:      "Property Agent",
};

const StickyAgentInfo = ({
  user,
  property,
}: {
  user: UserSettingsType;
  property: PropertyType;
}) => {
  const link = generateWhatsAppLink({
    phoneNumber: user.whatsapp || user.phone || "",
    messageTop: `Hello, I'm interested in this property: ${property.title}`,
    pageUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/property/details/${property._id}`,
    bustCache: false,
  });

  const userLabel =
    USER_TYPE_LABEL[user.user_type ?? ""] ?? "Real Estate Company";

  return (
    <div className="fixed bottom-0 left-0 w-full z-50">
      {/* Brand accent separator line */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(to right,transparent,rgba(30,95,116,0.18),transparent)",
        }}
      />

      <div
        className="mx-auto md:max-w-[650px] w-full px-4 py-3
                   flex items-center gap-3 bg-white"
        style={{ boxShadow: "0 -6px 28px rgba(0,0,0,0.08)" }}
      >
        {/* ── Avatar ────────────────────────────────────────────────── */}
        <div
          className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden"
          style={{
            border: "2.5px solid #f0a500",
            boxShadow: "0 2px 14px rgba(240,165,0,0.28)",
          }}
        >
          <Image
            src={user?.image || "/logo.png"}
            width={48}
            height={48}
            alt={user.brand || user.username || "Property owner"}
            className="w-full h-full object-cover"
          />
        </div>

        {/* ── Info ──────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-[#111827] truncate leading-snug">
            {user.brand || user.username}
          </h2>
          <p className="text-[11px] mt-0.5 flex items-center gap-1.5"
             style={{ color: "#9ca3af" }}>
            {/* Teal dot accent */}
            <span
              className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: "#1e5f74" }}
            />
            {userLabel}
          </p>
        </div>

        {/* ── Contact actions ───────────────────────────────────────── */}
        <div className="flex items-center gap-2 flex-shrink-0">

          {/* Call */}
          {user.phone && (
            <a
              href={`tel:${normalizePhone(user.phone)}`}
              aria-label="Call"
              className="w-10 h-10 rounded-xl flex items-center justify-center
                         transition-all duration-200 active:scale-95"
              style={{ background: "#e0f0f5", color: "#1e5f74" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#1e5f74";
                (e.currentTarget as HTMLAnchorElement).style.color = "white";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#e0f0f5";
                (e.currentTarget as HTMLAnchorElement).style.color = "#1e5f74";
              }}
            >
              <Call3DIcon className="text-[18px]" />
            </a>
          )}

          {/* Email */}
          {user.email && (
            <a
              href={`mailto:${user.email}`}
              aria-label="Email"
              className="w-10 h-10 rounded-xl flex items-center justify-center
                         transition-all duration-200 active:scale-95"
              style={{ background: "#e0f0f5", color: "#1e5f74" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#1e5f74";
                (e.currentTarget as HTMLAnchorElement).style.color = "white";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#e0f0f5";
                (e.currentTarget as HTMLAnchorElement).style.color = "#1e5f74";
              }}
            >
              <GmailMinimalIcon className="text-[18px]" />
            </a>
          )}

          {/* WhatsApp — primary CTA with gradient */}
          {user.whatsapp && (
            <a
              href={link}
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl
                         text-white text-[13px] font-bold
                         transition-all duration-200 active:scale-[0.96]"
              style={{
                background: "linear-gradient(135deg,#143d4d,#1e5f74)",
                boxShadow: "0 3px 14px rgba(30,95,116,0.35)",
              }}
            >
              <WhatsAppMinimalIcon className="text-[18px]" />
              Chat
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default StickyAgentInfo;