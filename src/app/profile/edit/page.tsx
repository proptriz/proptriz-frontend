'use client';

import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/context/AppContextProvider';
import { FaUser, FaEnvelope } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { UserSettingsType, UserTypeEnum } from '@/types';
import ToggleCollapse from '@/components/shared/ToggleCollapse';
import { addOrUpdateUserSettings, getUserSettings } from '@/services/settingsApi';
import Image from 'next/image';
import { EmailInput, SelectInput, TextInput } from '@/components/shared/Input';
import { PhoneInput } from '@/components/shared/PhoneInput';
import Splash from '@/components/shared/Splash';

// ─── Component ────────────────────────────────────────────────────────────────

const EditProfile = () => {
  const { authUser } = useContext(AppContext);

  const [photo, setPhoto]                       = useState<File | undefined>();
  const [existingPhotoUrl, setExistingPhotoUrl] = useState("/logo.png");
  const [formData, setFormData]                 = useState<Partial<UserSettingsType>>({});
  const [phone, setPhone]                       = useState("");
  const [normalizedPhone, setNormalizedPhone]   = useState<string | null>(null);
  const [whatsapp, setWhatsapp]                 = useState("");
  const [normalizedWhatsapp, setNormalizedWhatsapp] = useState<string | null>(null);
  const [isLoading, setIsLoading]               = useState(false);

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
    toast.success("Profile photo selected");
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      formData.phone    = normalizedPhone ?? "";
      formData.whatsapp = normalizedWhatsapp ?? "";
      const updated = addOrUpdateUserSettings(formData, photo);
      // if (updated) toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Gate ─────────────────────────────────────────────────────────────────
  if (!authUser) return <Splash showFooter />;

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="pb-8 bg-[#f5f7f9] min-h-screen">

      {/* ── Hero with avatar ─────────────────────────────────────────── */}
      <div
        className="flex flex-col items-center px-4 pt-14 pb-6"
        style={{ background: "linear-gradient(160deg,#143d4d,#1e5f74)" }}
      >
        {/* Avatar with gold ring + pencil */}
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full p-[3px] bg-white"
            style={{ boxShadow: "0 4px 20px rgba(240,165,0,0.4), 0 0 0 4px rgba(240,165,0,0.2)" }}
          >
            <div className="w-full h-full rounded-full overflow-hidden relative">
              <Image
                src={photo ? URL.createObjectURL(photo) : existingPhotoUrl}
                fill
                sizes="96px"
                alt="Profile"
                className="object-cover"
              />
            </div>
          </div>

          {/* Invisible file input overlay */}
          <label className="absolute inset-0 rounded-full cursor-pointer z-10">
            <input
              type="file"
              name="image"
              accept="image/png,image/jpeg,image/jpg"
              className="sr-only"
              onChange={handleUpload}
            />
          </label>

          {/* Pencil badge */}
          <div
            className="absolute bottom-1 right-1 w-7 h-7 rounded-full flex items-center
                       justify-center pointer-events-none z-20
                       shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
            style={{ background: "#f0a500" }}
          >
            <FaPencil className="text-white" size={11} />
          </div>
        </div>

        <p
          className="text-white font-extrabold text-[18px] mt-3 tracking-tight"
          style={{ fontFamily: "'Raleway', sans-serif" }}
        >
          {formData.brand || authUser.display_name || "Your Name"}
        </p>
        <p className="text-white/70 text-[12px] mt-0.5">
          {formData.email || authUser.primary_email || ""}
        </p>
      </div>

      {/* ── Form sections ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 px-4 pt-4">

        {/* Identity card */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4">
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
              label="Register as"
              value={formData.user_type ?? UserTypeEnum.Individual}
              onChange={onChange}
              name="user_type"
              options={Object.values(UserTypeEnum).map((t) => ({
                name:  t.charAt(0).toUpperCase() + t.slice(1),
                value: t,
              }))}
            />
          </div>
        </div>

        {/* Contact details (collapsible) */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden">
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

        {/* Submit */}
        <button
          type="button"
          disabled={isLoading || !authUser}
          onClick={handleSubmit}
          className="w-full py-4 rounded-2xl text-white text-[15px] font-bold
                     flex items-center justify-center gap-2
                     transition-all duration-200 mt-2
                     disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg,#143d4d,#1e5f74)",
            boxShadow: "0 4px 18px rgba(30,95,116,0.35)",
          }}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Updating…
            </>
          ) : (
            "✓ Update Profile"
          )}
        </button>

      </div>
    </div>
  );
};

export default EditProfile;
