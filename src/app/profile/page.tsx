'use client';

import React, { useContext, useEffect, useRef, useState } from "react";
import { BackButton } from "@/components/shared/BackButton";
import { VerticalCard } from "@/components/shared/VerticalCard";
import Link from "next/link";
import { AppContext } from "../../context/AppContextProvider";
import { CursorResponse, ReviewType, UserSettingsType } from "@/types";
import { PropertyType } from "@/types/property";
import { deleteUserProperty, getUserListedProp } from "@/services/propertyApi";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Popup from "@/components/shared/Popup";
import { getUserSettings } from "@/services/settingsApi";
import Image from "next/image";
import { ReviewCard } from "@/components/shared/Cards";
import Splash from "@/components/shared/Splash";
import ReplyReview from "@/components/ReplyReview";
import { getPropertyUserReviewApi } from "@/services/reviewApi";
import { useInfiniteCursorScroll } from "@/components/shared/useInfiniteCursorScroll";
import { ReviewCardSkeleton } from "@/components/skeletons/ReviewCardSkeleton";
import { VerticalPropertyCardSkeleton } from "@/components/skeletons/VerticalPropertyCardSkeleton";
import { SlMenu } from "react-icons/sl";
import ConfirmSheet from "@/components/shared/ConfirmSheet";
import { useLanguage } from "@/i18n/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActiveTab = "Listings" | "receivedReviews" | "sentReviews";

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { authUser }  = useContext(AppContext);
  const { t, openPicker, locale, } = useLanguage();

  // Tab definitions use translation keys — built inside component so t() is available
  const TABS: { key: ActiveTab; label: string }[] = [
    { key: "Listings",        label: t("profile_listings") },
    { key: "receivedReviews", label: t("profile_received") },
    { key: "sentReviews",     label: t("profile_sent")     },
  ];

  // Menu items in the settings popup
  const MENU_ITEMS = [
    { icon: "✏️", labelKey: "menu_edit_profile"  as const, link: "/profile/edit"         },
    { icon: "🏠", labelKey: "menu_list_property" as const, link: "/property/add"         },
    { icon: "🤝", labelKey: "menu_become_agent"  as const, link: "/profile/become-agent" },
    { icon: "❓", labelKey: "menu_faq"           as const, link: "/profile/faq"          },
  ];

  const [showStats, setShowStats]               = useState(true);
  const [activeTab, setActiveTab]               = useState<ActiveTab>("Listings");
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [userSettings, setUserSettings]         = useState<UserSettingsType | null>(null);
  const [isReplyPop, setIsReplyPop]             = useState(false);
  const [isDeleting, setIsDeleting]             = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId]   = useState<string | null>(null);
  const [replyReview, setReplyReview]           = useState<ReviewType | null>(null);
  const [totalProperties, setTotalProperties]   = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  // ── Scroll-collapse stats ──────────────────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setShowStats(el.scrollTop <= 20);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // ── Load user settings ─────────────────────────────────────────────────
  useEffect(() => {
    if (!authUser) return;
    getUserSettings()
      .then((s) => { if (s) setUserSettings(s); })
      .catch(() => {});
  }, [authUser]);

  // ── Infinite scroll: listed properties ────────────────────────────────
  const {
    items: listedProperties,
    loading: loadingProp,
    hasMore: hasMoreProp,
    setObserverTarget: setPropObserverTarget,
  } = useInfiniteCursorScroll({
    fetcher: async (cursor, signal): Promise<CursorResponse<PropertyType[]>> => {
      const res = await getUserListedProp({ cursor }, { signal });
      if (!res) return { items: [], nextCursor: null };
      setTotalProperties(res.totalProperties);
      return { items: res.properties, nextCursor: res.nextCursor };
    },
    enabled: true,
    isMissingRequired: authUser === null,
    deps: [authUser],
  });

  // ── Infinite scroll: received reviews ─────────────────────────────────
  const {
    items: receivedReviews,
    loading: loadingReceived,
    hasMore: hasMoreReceived,
    setObserverTarget: setReceivedObserverTarget,
  } = useInfiniteCursorScroll({
    fetcher: async (cursor, signal): Promise<CursorResponse<ReviewType[]>> => {
      const res = await getPropertyUserReviewApi({ receivedCursor: cursor }, { signal });
      if (!res) return { items: [], nextCursor: null };
      return { items: res.received.reviews, nextCursor: res.received.nextCursor };
    },
    enabled: true,
    isMissingRequired: authUser === null,
  });

  // ── Infinite scroll: sent reviews ─────────────────────────────────────
  const {
    items: sentReviews,
    loading: loadingsSent,
    hasMore: hasMoreSent,
    setObserverTarget,
  } = useInfiniteCursorScroll({
    fetcher: async (cursor, signal): Promise<CursorResponse<ReviewType[]>> => {
      const res = await getPropertyUserReviewApi({ sentCursor: cursor }, { signal });
      if (!res) return { items: [], nextCursor: null };
      return { items: res.sent.reviews, nextCursor: res.sent.nextCursor };
    },
    enabled: true,
    isMissingRequired: authUser === null,
  });

  // ── Delete handlers ────────────────────────────────────────────────────
  const requestDelete = (id: string) => {
    setPendingDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    const res = await deleteUserProperty(pendingDeleteId);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
    setPendingDeleteId(null);
    if (!res.success) {
      toast.error(t("profile_delete_fail"));
      return;
    }
    toast.success(t("profile_delete_success"));
  };

  const showReply = (review: ReviewType) => {
    setReplyReview(review);
    setIsReplyPop(true);
  };

  if (!authUser) return <Splash showFooter />;

  const tabCounts: Record<ActiveTab, number> = {
    Listings:        listedProperties.length,
    receivedReviews: receivedReviews.length,
    sentReviews:     sentReviews.length,
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <div ref={scrollRef} className="px-4 pb-24 bg-[#f5f7f9] h-full overflow-y-auto">

        {/* ── Sticky teal hero header ──────────────────────────────────── */}
        <header
          className="fixed top-0 left-0 right-0 z-50 md:max-w-[650px] mx-auto"
          style={{ background: "linear-gradient(160deg,#143d4d,#1e5f74)" }}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-4 py-3">
            <BackButton />

            <p
              className="font-extrabold text-white text-[16px] truncate"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              {userSettings?.brand || authUser.display_name || t("nav_profile")}
            </p>

            {/* Avatar + menu button */}
            <button
              onClick={() => setShowSettingsMenu(true)}
              className="flex items-center gap-2 rounded-full
                         bg-white/15 border border-white/25 pl-1 pr-3 py-1"
            >
              <div
                className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border-2"
                style={{ borderColor: "#f0a500" }}
              >
                <Image
                  src={userSettings?.image || "/logo.png"}
                  width={32} height={32}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <SlMenu size={14} className="text-white" />
            </button>
          </div>

          {/* Collapsible stats grid */}
          <div
            className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
              showStats ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="grid grid-cols-3 gap-2 px-4 pb-3">
              {[
                { val: totalProperties, lbl: t("profile_properties")          },
                { val: "4.9",           lbl: t("profile_rating"),  gold: true },
                { val: 25,              lbl: t("profile_reviews")             },
              ].map((s) => (
                <div
                  key={s.lbl}
                  className="text-center rounded-xl py-2.5 px-2"
                  style={{
                    background:     "rgba(255,255,255,0.12)",
                    border:         "1.5px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(4px)",
                  }}
                >
                  <p
                    className="font-extrabold text-[20px] leading-none"
                    style={{
                      color:      s.gold ? "#f0a500" : "white",
                      fontFamily: "'Raleway', sans-serif",
                    }}
                  >
                    {s.val}
                  </p>
                  <p className="text-[10px] text-white/70 mt-1 font-medium">{s.lbl}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tab sub-header */}
          <div className="px-4 pb-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-white font-bold text-sm">
                <span className="text-[#f0a500] mr-1">{tabCounts[activeTab]}</span>
                {TABS.find((tab) => tab.key === activeTab)?.label}
              </p>
              <Link
                href="/property/add"
                className="text-[12px] font-bold px-3 py-1.5 rounded-lg"
                style={{ background: "#f0a500", color: "#143d4d" }}
              >
                {t("profile_add_property")}
              </Link>
            </div>

            {/* Tab pills */}
            <div
              className="flex rounded-full p-[3px]"
              style={{ background: "rgba(0,0,0,0.2)" }}
            >
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-1.5 rounded-full text-[12px] font-semibold
                              transition-all duration-200
                              ${activeTab === tab.key
                                ? "bg-white text-[#1e5f74] font-bold"
                                : "text-white/60"
                              }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Spacer for fixed header */}
        <div className={`${showStats ? "h-[220px]" : "h-[130px]"} transition-all duration-300`} />

        {/* ── Listings tab ─────────────────────────────────────────────── */}
        {activeTab === "Listings" && (
          <section>
            {!loadingProp && listedProperties.length === 0 && (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">🏠</p>
                <p className="font-bold text-[#111827]">{t("profile_no_listings")}</p>
                <p className="text-sm text-[#9ca3af] mt-1">{t("profile_no_listings_sub")}</p>
                <Link
                  href="/property/add"
                  className="inline-block mt-4 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#143d4d,#1e5f74)" }}
                >
                  {t("profile_list_property")}
                </Link>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {listedProperties.map((item: PropertyType, index: number) => {
                const isLast = index === listedProperties.length - 1;
                return (
                  <div
                    key={item._id}
                    ref={isLast ? setPropObserverTarget : undefined}
                    className="relative group rounded-2xl overflow-hidden"
                  >
                    <VerticalCard
                      id={item._id}
                      name={item.title}
                      price={item.price}
                      currency={item.currency}
                      category={item.category ?? ""}
                      address={item.address}
                      image={item.banner}
                      period={item.period ?? ""}
                      listed_for={item.listed_for ?? ""}
                      rating={item.average_rating ?? 4.9}
                      expired={new Date(item.expired_by ?? "1970-01-01") < new Date()}
                    />

                    {/* Hover overlay with action buttons */}
                    <div
                      className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100
                                 transition-opacity duration-300 flex items-center justify-center
                                 rounded-2xl"
                    >
                      <div
                        className="flex items-center gap-2 rounded-full px-4 py-2.5
                                   shadow-lg backdrop-blur-sm"
                        style={{ background: "rgba(255,255,255,0.92)" }}
                      >
                        <Link
                          href={`/property/details/${item._id}`}
                          className="w-8 h-8 rounded-full flex items-center justify-center
                                     bg-[#e0f0f5] text-[#1e5f74]
                                     hover:bg-[#1e5f74] hover:text-white transition-colors"
                          aria-label="Preview"
                        >
                          <FaEye size={14} />
                        </Link>
                        <Link
                          href={`/property/edit/${item._id}`}
                          className="w-8 h-8 rounded-full flex items-center justify-center
                                     bg-[#e0f0f5] text-[#1e5f74]
                                     hover:bg-[#1e5f74] hover:text-white transition-colors"
                          aria-label="Edit"
                        >
                          <FaEdit size={14} />
                        </Link>
                        <button
                          onClick={() => requestDelete(item._id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center
                                     bg-[#fee2e2] text-[#ef4444]
                                     hover:bg-[#ef4444] hover:text-white transition-colors"
                          aria-label="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {loadingProp &&
                Array.from({ length: 4 }).map((_, i) => (
                  <VerticalPropertyCardSkeleton key={i} />
                ))
              }
            </div>

            {!hasMoreProp && listedProperties.length > 0 && (
              <p className="text-center text-sm text-[#9ca3af] mt-6 py-2">
                {t("profile_seen_all")}
              </p>
            )}
          </section>
        )}

        {/* ── Received reviews tab ─────────────────────────────────────── */}
        {activeTab === "receivedReviews" && (
          <section>
            {receivedReviews.length === 0 && !loadingReceived && (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">⭐</p>
                <p className="font-bold text-[#111827]">{t("profile_no_received")}</p>
                <p className="text-sm text-[#9ca3af] mt-1">{t("profile_no_received_sub")}</p>
              </div>
            )}

            <div className="space-y-3">
              {receivedReviews.map((review: ReviewType, index: number) => {
                const isLast = index === receivedReviews.length - 1;
                return (
                  <div key={review._id} ref={isLast ? setReceivedObserverTarget : undefined}>
                    <ReviewCard review={review} showReply={showReply} showPropDetails />
                  </div>
                );
              })}

              {loadingReceived &&
                Array.from({ length: 2 }).map((_, i) => (
                  <ReviewCardSkeleton key={i} showPropDetails />
                ))
              }

              {!hasMoreReceived && receivedReviews.length > 0 && (
                <p className="text-center text-sm text-[#9ca3af] py-2">
                  {t("profile_no_more")}
                </p>
              )}
            </div>
          </section>
        )}

        {/* ── Sent reviews tab ─────────────────────────────────────────── */}
        {activeTab === "sentReviews" && (
          <section>
            {sentReviews.length === 0 && !loadingsSent && (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">✍️</p>
                <p className="font-bold text-[#111827]">{t("profile_no_sent")}</p>
                <p className="text-sm text-[#9ca3af] mt-1">{t("profile_no_sent_sub")}</p>
              </div>
            )}

            <div className="space-y-3">
              {sentReviews.map((review: ReviewType, index: number) => {
                const isLast = index === sentReviews.length - 1;
                return (
                  <div key={review._id} ref={isLast ? setObserverTarget : undefined}>
                    <ReviewCard review={review} showReply={showReply} showPropDetails />
                  </div>
                );
              })}

              {loadingsSent &&
                Array.from({ length: 2 }).map((_, i) => (
                  <ReviewCardSkeleton key={i} showPropDetails />
                ))
              }

              {!hasMoreSent && sentReviews.length > 0 && (
                <p className="text-center text-sm text-[#9ca3af] py-2">
                  {t("profile_no_more")}
                </p>
              )}
            </div>
          </section>
        )}
      </div>

      {/* ── Settings / user menu popup ─────────────────────────────────── */}
      <Popup
        header=""
        toggle={showSettingsMenu}
        setToggle={setShowSettingsMenu}
        useMask
        hideReset
      >
        {/* User info */}
        <div className="flex items-center gap-4 pb-4 mb-2 border-b border-[#e5e7eb]">
          <div
            className="w-16 h-16 rounded-full flex-shrink-0 overflow-hidden border-[3px]"
            style={{ borderColor: "#f0a500", boxShadow: "0 2px 12px rgba(240,165,0,0.3)" }}
          >
            <Image
              src={userSettings?.image || "/logo.png"}
              width={64} height={64}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p
              className="font-extrabold text-[17px] text-[#111827] truncate"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              {userSettings?.brand || authUser.display_name}
            </p>
            <p className="text-[12px] text-[#9ca3af] truncate mt-0.5">{userSettings?.email}</p>
            <span
              className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold
                         bg-[#fef3cd] text-[#c88400] px-2 py-0.5 rounded-full
                         border border-[rgba(240,165,0,0.3)]"
            >
              🏆 {t("profile_top_agent")}
            </span>
          </div>
        </div>

        {/* Menu items */}
        <nav className="flex flex-col gap-0.5 my-2">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              onClick={() => setShowSettingsMenu(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                         hover:bg-[#e0f0f5] transition-colors"
            >
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center
                              text-[15px] flex-shrink-0 bg-[#e0f0f5] text-[#1e5f74]">
                {item.icon}
              </div>
              <span className="text-[13px] font-semibold text-[#111827]">
                {t(item.labelKey)}
              </span>
            </Link>
          ))}

          {/* Language selector row */}
          <button
            type="button"
            onClick={() => { setShowSettingsMenu(false); openPicker(); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                       hover:bg-[#e0f0f5] transition-colors w-full text-left"
          >
            <div className="w-8 h-8 rounded-[10px] flex items-center justify-center
                            text-[18px] flex-shrink-0 bg-[#e0f0f5]">
              {locale === "en" ? "🇬🇧" : locale === "fr" ? "🇫🇷" : "🇰🇪"}
            </div>
            <span className="text-[13px] font-semibold text-[#111827]">
              {t("menu_language")}
            </span>
          </button>
        </nav>

        {/* Footer */}
        <div className="flex gap-2 pt-3 border-t border-[#e5e7eb] mt-1">
          <Link
            href="/profile/edit"
            onClick={() => setShowSettingsMenu(false)}
            className="flex-1 py-2.5 rounded-xl text-center text-[13px] font-bold
                       bg-[#e0f0f5] text-[#1e5f74]"
          >
            ⚙️ {t("profile_manage_account")}
          </Link>
          <button
            type="button"
            onClick={() => setShowSettingsMenu(false)}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold bg-[#fee2e2] text-[#ef4444]"
          >
            ✕ {t("common_close")}
          </button>
        </div>
      </Popup>

      {/* ── Reply review popup ─────────────────────────────────────────── */}
      {replyReview && (
        <Popup
          header={t("profile_reply_review")}
          toggle={isReplyPop}
          setToggle={setIsReplyPop}
          useMask
          hideReset
        >
          <ReplyReview review={replyReview} />
        </Popup>
      )}

      {/* ── Delete confirmation sheet ─────────────────────────────────── */}
      <ConfirmSheet
        open={showDeleteConfirm}
        onClose={() => { setShowDeleteConfirm(false); setPendingDeleteId(null); }}
        onConfirm={confirmDelete}
        title={t("profile_delete_title")}
        description={t("profile_delete_desc")}
        confirmLabel={t("profile_delete_confirm")}
        confirmColor="#ef4444"
        loading={isDeleting}
        loadingLabel={t("profile_delete_loading")}
      />
    </>
  );
}
