'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/context/AppContextProvider';
import { FaUser, FaEnvelope, FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { UserSettingsType, UserTypeEnum } from '@/types';
import ToggleCollapse from '@/components/shared/ToggleCollapse';
import { addOrUpdateUserSettings, getUserSettings } from '@/services/settingsApi';
import Image from 'next/image';
import { EmailInput, SelectInput, TextInput } from '@/components/shared/Input';
import { PhoneInput } from '@/components/shared/PhoneInput';
import Splash from '@/components/shared/Splash';
import { BackButton } from '@/components/shared/buttons';

// ─── Brand palette ────────────────────────────────────────────────────────────
// Teal dark:#143d4d  Teal:#1e5f74  Teal-light:#e0f0f5  Gold:#f0a500
// ─────────────────────────────────────────────────────────────────────────────

const USER_TYPE_META: Record<string, { label: string; emoji: string; desc: string }> = {
  [UserTypeEnum.Individual]: { label: "Individual",   emoji: "🏠", desc: "Personal property owner" },
  [UserTypeEnum.Agent]:      { label: "Agent",        emoji: "🤝", desc: "Licensed property agent" },
  company:                   { label: "Company",      emoji: "🏢", desc: "Real estate company" },
};

// ─── Component ────────────────────────────────────────────────────────────────

const EditProfile = () => {
  const { authUser } = useContext(AppContext);

  const [photo, setPhoto]                           = useState<File | undefined>();
  const [existingPhotoUrl, setExistingPhotoUrl]     = useState("/logo.png");
  const [formData, setFormData]                     = useState<Partial<UserSettingsType>>({});
  const [phone, setPhone]                           = useState("");
  const [normalizedPhone, setNormalizedPhone]       = useState<string | null>(null);
  const [whatsapp, setWhatsapp]                     = useState("");
  const [normalizedWhatsapp, setNormalizedWhatsapp] = useState<string | null>(null);
  const [isLoading, setIsLoading]                   = useState(false);
  const [photoPreview, setPhotoPreview]             = useState<string | null>(null);

  // ── Fetch existing settings ─────────────────────────────────────────────
  useEffect(() => {
    if (!authUser) return;
    (async () => {
      try {
        const settings = await getUserSettings();
        if (!settings) return;
        setFormData(settings);
        setExistingPhotoUrl(settings.image || "/logo.png");
        setPhone(settings.phone ?? "");
        setNormalizedPhone(settings.phone ?? null);
        setWhatsapp(settings.whatsapp ?? "");
        setNormalizedWhatsapp(settings.whatsapp ?? null);
      } catch {/* silent */}
    })();
  }, [authUser]);

  // ── Handlers ─────────────────────────────────────────────────────────────
  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please select a PNG or JPG image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 2 MB.");
      return;
    }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    toast.success("Photo selected — save to apply.");
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      formData.phone    = normalizedPhone ?? "";
      formData.whatsapp = normalizedWhatsapp ?? "";
      await addOrUpdateUserSettings(formData, photo);
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Gate ─────────────────────────────────────────────────────────────────
  if (!authUser) return <Splash showFooter />;

  const displayName  = formData.brand || authUser.display_name || "Your Name";
  const displayEmail = formData.email || authUser.primary_email || "";
  const userTypeMeta = USER_TYPE_META[formData.user_type ?? UserTypeEnum.Individual];

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="pb-10 min-h-screen" style={{ background: "#f5f7f9" }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div
        className="relative flex flex-col items-center px-4 pt-12 pb-8"
        style={{ background: "linear-gradient(160deg,#143d4d 0%,#1e5f74 100%)" }}
      >
        {/* Decorative background rings */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <div style={{
            position: "absolute", top: -60, right: -60,
            width: 200, height: 200, borderRadius: "50%",
            border: "1px solid rgba(240,165,0,0.12)",
          }} />
          <div style={{
            position: "absolute", top: -20, right: -20,
            width: 110, height: 110, borderRadius: "50%",
            border: "1px solid rgba(240,165,0,0.08)",
          }} />
          <div style={{
            position: "absolute", bottom: -40, left: -40,
            width: 160, height: 160, borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.06)",
          }} />
        </div>

        {/* ── Top bar: back button + title ─────────────────────────────── */}
        <div className="absolute top-4 left-0 right-0 flex items-center px-4 z-20">
          <BackButton />
          <p
            className="absolute left-1/2 -translate-x-1/2 text-white/90
                       text-[13px] font-bold tracking-wide"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            Edit Profile
          </p>
        </div>

        {/* ── Avatar ───────────────────────────────────────────────────── */}
        <div className="relative mt-6 z-10">
          {/* Gold halo glow */}
          <div style={{
            position: "absolute", inset: -5, borderRadius: "50%",
            background: "linear-gradient(135deg,#f0a500,#f8cc66)",
            opacity: 0.3,
          }} />

          {/* White border + photo */}
          <div style={{
            width: 96, height: 96, borderRadius: "50%",
            padding: 3, background: "white", position: "relative",
            boxShadow: "0 6px 24px rgba(240,165,0,0.45), 0 0 0 4px rgba(240,165,0,0.18)",
          }}>
            <div style={{
              width: "100%", height: "100%",
              borderRadius: "50%", overflow: "hidden", position: "relative",
            }}>
              <Image
                src={photoPreview ?? existingPhotoUrl}
                fill
                sizes="96px"
                alt="Profile photo"
                className="object-cover"
              />
            </div>
          </div>

          {/* Camera upload overlay */}
          <label className="absolute inset-0 rounded-full cursor-pointer z-10 flex items-end justify-end" title="Change photo">
            <input
              type="file"
              name="image"
              accept="image/png,image/jpeg,image/jpg"
              className="sr-only"
              onChange={handleUpload}
            />
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center
                         shadow-lg pointer-events-none"
              style={{ background: "#f0a500", border: "2.5px solid white", marginBottom: 2, marginRight: 2 }}
            >
              <FaCamera className="text-white" size={12} />
            </div>
          </label>
        </div>

        {/* ── Name + badge ─────────────────────────────────────────────── */}
        <div className="text-center mt-3 z-10">
          <p
            className="text-white font-extrabold text-[19px] tracking-tight leading-none"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            {displayName}
          </p>

          {displayEmail && (
            <p className="text-white/60 text-[12px] mt-1">{displayEmail}</p>
          )}

          <div
            className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-full text-[11px] font-bold"
            style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)" }}
          >
            <span>{userTypeMeta?.emoji}</span>
            <span>{userTypeMeta?.label ?? "Member"}</span>
          </div>
        </div>

        {/* Curve separator into content */}
        <div
          className="absolute bottom-0 left-0 right-0 h-5 bg-[#f5f7f9]"
          style={{ borderRadius: "28px 28px 0 0" }}
        />
      </div>

      {/* ── Form sections ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 px-4 pt-3">

        {/* Identity */}
        <div
          className="bg-white rounded-2xl border border-[#e5e7eb] p-4"
          style={{ boxShadow: "0 2px 12px rgba(30,95,116,0.06)" }}
        >
          <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px]
                        flex items-center gap-1.5 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e5f74] inline-block" />
            Identity
          </p>
          <div className="space-y-3">
            <TextInput
              label="Full Name / Brand"
              icon={<FaUser className="text-[#1e5f74]" />}
              name="brand"
              id="brand"
              value={formData.brand ?? ""}
              onChange={onChange}
              placeholder="Enter your full name or brand"
            />
            <SelectInput
              label="Account Type"
              value={formData.user_type ?? UserTypeEnum.Individual}
              onChange={onChange}
              name="user_type"
              options={Object.values(UserTypeEnum).map((t) => ({
                name:  t.charAt(0).toUpperCase() + t.slice(1),
                value: t,
              }))}
            />
            {userTypeMeta?.desc && (
              <p className="text-[11px] text-[#9ca3af] pl-1 -mt-1">{userTypeMeta.desc}</p>
            )}
          </div>
        </div>

        {/* Contact */}
        <div
          className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden"
          style={{ boxShadow: "0 2px 12px rgba(30,95,116,0.06)" }}
        >
          <ToggleCollapse header="📞 Contact Details" open>
            <div className="space-y-3 px-4 pb-4">
              <EmailInput
                label="Email (optional)"
                icon={<FaEnvelope className="text-[#1e5f74]" />}
                name="email"
                id="email"
                value={formData.email ?? ""}
                onChange={onChange}
                placeholder="Enter your email"
              />
              <PhoneInput
                label="Phone Number"
                value={phone}
                onChange={setPhone}
                onNormalize={setNormalizedPhone}
              />
              <PhoneInput
                label="WhatsApp (optional)"
                name="whatsapp"
                id="whatsapp"
                value={whatsapp}
                onChange={setWhatsapp}
                onNormalize={setNormalizedWhatsapp}
                placeholder="+234 080 3288 9111"
              />
            </div>
          </ToggleCollapse>
        </div>

        {/* Save */}
        <button
          type="button"
          disabled={isLoading || !authUser}
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl text-white text-[15px] font-bold
                     flex items-center justify-center gap-2.5
                     transition-all duration-200 mt-1 active:scale-[0.98]
                     disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg,#143d4d,#1e5f74)",
            boxShadow: "0 4px 20px rgba(30,95,116,0.38)",
            fontFamily: "'Raleway', sans-serif",
          }}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin flex-shrink-0" />
              Updating…
            </>
          ) : (
            <>✓ Save Changes</>
          )}
        </button>

        <p className="text-center text-[11px] text-[#9ca3af] pb-2">
          Your information is only visible to parties you engage with.
        </p>
      </div>
    </div>
  );
};

export default EditProfile;