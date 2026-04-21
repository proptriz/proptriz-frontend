// src/i18n/translations.ts
//
// Single source of truth for all UI strings across supported languages.
// Add new keys here first, then use t(key) via useLanguage() hook.
//
// Languages:
//   en — English  (default)
//   fr — French
//   sw — Swahili

export type Locale = "en" | "fr" | "sw";

export interface Translations {
  // ── Language names (shown in picker) ───────────────────────────────────────
  lang_en:              string;
  lang_fr:              string;
  lang_sw:              string;

  // ── Language picker modal ───────────────────────────────────────────────────
  lang_picker_title:    string;
  lang_picker_subtitle: string;
  lang_picker_save:     string;
  lang_picker_cancel:   string;

  // ── Footer / bottom nav ─────────────────────────────────────────────────────
  nav_map:              string;
  nav_explore:          string;
  nav_saved:            string;
  nav_profile:          string;

  // ── Category tabs ───────────────────────────────────────────────────────────
  cat_apartment:        string;
  cat_land:             string;
  cat_shortlet:         string;
  cat_hotel:            string;
  cat_shop:             string;
  cat_office:           string;
  cat_others:           string;

  // ── Home screen ─────────────────────────────────────────────────────────────
  home_greeting:        string;
  home_search_hint:     string;
  home_nearby:          string;
  home_see_all:         string;
  home_show_less:       string;
  home_loading:         string;
  home_no_results:      string;
  home_top_locations:   string;
  home_for_rent:        string;
  home_for_sale:        string;
  home_all:             string;

  // ── Nav menu (hamburger) ────────────────────────────────────────────────────
  menu_my_profile:      string;
  menu_edit_profile:    string;
  menu_list_property:   string;
  menu_become_agent:    string;
  menu_privacy:         string;
  menu_terms:           string;
  menu_faq:             string;
  menu_language:        string;

  // ── Common ──────────────────────────────────────────────────────────────────
  common_save:          string;
  common_cancel:        string;
  common_close:         string;
  common_loading:       string;
  common_error:         string;
  common_retry:         string;
  common_per_year:      string;
  common_per_month:     string;
  common_per_night:     string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ENGLISH (default)
// ─────────────────────────────────────────────────────────────────────────────

const en: Translations = {
  lang_en:              "English",
  lang_fr:              "Français",
  lang_sw:              "Kiswahili",

  lang_picker_title:    "Choose Language",
  lang_picker_subtitle: "Select your preferred language",
  lang_picker_save:     "Save",
  lang_picker_cancel:   "Cancel",

  nav_map:              "Map",
  nav_explore:          "Explore",
  nav_saved:            "Saved",
  nav_profile:          "Profile",

  cat_apartment:        "Apartment",
  cat_land:             "Land",
  cat_shortlet:         "Shortlet",
  cat_hotel:            "Hotel",
  cat_shop:             "Shop",
  cat_office:           "Office",
  cat_others:           "Others",

  home_greeting:        "Find your perfect space",
  home_search_hint:     "Search by location, type…",
  home_nearby:          "Nearby Properties",
  home_see_all:         "See All",
  home_show_less:       "Show Less",
  home_loading:         "Loading properties…",
  home_no_results:      "No properties found nearby",
  home_top_locations:   "Top Locations",
  home_for_rent:        "Rent",
  home_for_sale:        "Sale",
  home_all:             "All",

  menu_my_profile:      "My Profile",
  menu_edit_profile:    "Edit Profile",
  menu_list_property:   "List New Property",
  menu_become_agent:    "Become an Agent",
  menu_privacy:         "Privacy Policy",
  menu_terms:           "Terms of Service",
  menu_faq:             "FAQ",
  menu_language:        "Language",

  common_save:          "Save",
  common_cancel:        "Cancel",
  common_close:         "Close",
  common_loading:       "Loading…",
  common_error:         "Something went wrong",
  common_retry:         "Try Again",
  common_per_year:      "/yr",
  common_per_month:     "/mo",
  common_per_night:     "/night",
};

// ─────────────────────────────────────────────────────────────────────────────
// FRENCH
// ─────────────────────────────────────────────────────────────────────────────

const fr: Translations = {
  lang_en:              "English",
  lang_fr:              "Français",
  lang_sw:              "Kiswahili",

  lang_picker_title:    "Choisir la langue",
  lang_picker_subtitle: "Sélectionnez votre langue préférée",
  lang_picker_save:     "Enregistrer",
  lang_picker_cancel:   "Annuler",

  nav_map:              "Carte",
  nav_explore:          "Explorer",
  nav_saved:            "Favoris",
  nav_profile:          "Profil",

  cat_apartment:        "Appartement",
  cat_land:             "Terrain",
  cat_shortlet:         "Court séjour",
  cat_hotel:            "Hôtel",
  cat_shop:             "Boutique",
  cat_office:           "Bureau",
  cat_others:           "Autres",

  home_greeting:        "Trouvez votre espace idéal",
  home_search_hint:     "Rechercher par lieu, type…",
  home_nearby:          "Propriétés à proximité",
  home_see_all:         "Voir tout",
  home_show_less:       "Afficher moins",
  home_loading:         "Chargement des propriétés…",
  home_no_results:      "Aucune propriété trouvée",
  home_top_locations:   "Meilleurs emplacements",
  home_for_rent:        "Location",
  home_for_sale:        "Vente",
  home_all:             "Tout",

  menu_my_profile:      "Mon profil",
  menu_edit_profile:    "Modifier le profil",
  menu_list_property:   "Ajouter un bien",
  menu_become_agent:    "Devenir agent",
  menu_privacy:         "Politique de confidentialité",
  menu_terms:           "Conditions d'utilisation",
  menu_faq:             "FAQ",
  menu_language:        "Langue",

  common_save:          "Enregistrer",
  common_cancel:        "Annuler",
  common_close:         "Fermer",
  common_loading:       "Chargement…",
  common_error:         "Une erreur est survenue",
  common_retry:         "Réessayer",
  common_per_year:      "/an",
  common_per_month:     "/mois",
  common_per_night:     "/nuit",
};

// ─────────────────────────────────────────────────────────────────────────────
// SWAHILI
// ─────────────────────────────────────────────────────────────────────────────

const sw: Translations = {
  lang_en:              "English",
  lang_fr:              "Français",
  lang_sw:              "Kiswahili",

  lang_picker_title:    "Chagua Lugha",
  lang_picker_subtitle: "Chagua lugha unayopendelea",
  lang_picker_save:     "Hifadhi",
  lang_picker_cancel:   "Ghairi",

  nav_map:              "Ramani",
  nav_explore:          "Gundua",
  nav_saved:            "Zilizohifadhiwa",
  nav_profile:          "Wasifu",

  cat_apartment:        "Ghorofa",
  cat_land:             "Ardhi",
  cat_shortlet:         "Likizo",
  cat_hotel:            "Hoteli",
  cat_shop:             "Duka",
  cat_office:           "Ofisi",
  cat_others:           "Zingine",

  home_greeting:        "Pata nafasi yako bora",
  home_search_hint:     "Tafuta kwa eneo, aina…",
  home_nearby:          "Mali za karibu",
  home_see_all:         "Tazama Zote",
  home_show_less:       "Onyesha Chini",
  home_loading:         "Inapakia mali…",
  home_no_results:      "Hakuna mali iliyopatikana",
  home_top_locations:   "Maeneo Bora",
  home_for_rent:        "Kukodi",
  home_for_sale:        "Kuuza",
  home_all:             "Zote",

  menu_my_profile:      "Wasifu Wangu",
  menu_edit_profile:    "Hariri Wasifu",
  menu_list_property:   "Ongeza Mali",
  menu_become_agent:    "Kuwa Wakala",
  menu_privacy:         "Sera ya Faragha",
  menu_terms:           "Masharti ya Huduma",
  menu_faq:             "Maswali",
  menu_language:        "Lugha",

  common_save:          "Hifadhi",
  common_cancel:        "Ghairi",
  common_close:         "Funga",
  common_loading:       "Inapakia…",
  common_error:         "Kitu kilienda vibaya",
  common_retry:         "Jaribu Tena",
  common_per_year:      "/mwaka",
  common_per_month:     "/mwezi",
  common_per_night:     "/usiku",
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export const TRANSLATIONS: Record<Locale, Translations> = { en, fr, sw };

export const LOCALE_META: Record<Locale, { label: string; flag: string; nativeName: string }> = {
  en: { label: "English",    flag: "🇬🇧", nativeName: "English"    },
  fr: { label: "French",     flag: "🇫🇷", nativeName: "Français"   },
  sw: { label: "Swahili",    flag: "🇰🇪", nativeName: "Kiswahili"  },
};

export const DEFAULT_LOCALE: Locale = "en";
export const STORAGE_KEY = "proptriz_locale";