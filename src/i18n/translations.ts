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
  // ── Language names ──────────────────────────────────────────────────────────
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

  // ── Home / Explore page ─────────────────────────────────────────────────────
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
  home_featured:        string;
  home_top_agents:      string;
  home_seen_all:        string;
  home_view_all:        string;
  home_more:            string;
  home_good_day:        string;
  home_subtitle:        string;

  // ── Map page ────────────────────────────────────────────────────────────────
  map_list_property:    string;
  map_my_location:      string;

  // ── Filter ──────────────────────────────────────────────────────────────────
  filter_location:      string;
  filter_location_ph:   string;     // placeholder: "Search city…"
  filter_searching:     string;     // "Searching location…"
  filter_prop_type:     string;
  filter_listed_for:    string;
  filter_price_budget:  string;
  filter_per_year:      string;
  filter_per_total:     string;
  filter_any:           string;
  filter_no_limit:      string;
  filter_min_price:     string;
  filter_max_price:     string;
  filter_showing:       string;     // "Showing:"
  filter_keywords:      string;
  filter_keywords_ph:   string;     // placeholder
  filter_keywords_hint: string;     // tip below keywords
  filter_reset:         string;
  filter_apply:         string;
  filter_show_results:  string;     // "Show {n} results"
  filter_all:           string;
  filter_rent:          string;
  filter_sale:          string;

  // ── Profile page ────────────────────────────────────────────────────────────
  profile_listings:       string;
  profile_received:       string;
  profile_sent:           string;
  profile_properties:     string;
  profile_rating:         string;
  profile_reviews:        string;
  profile_add_property:   string;
  profile_no_listings:    string;
  profile_no_listings_sub: string;
  profile_list_property:  string;
  profile_no_received:    string;
  profile_no_received_sub: string;
  profile_no_sent:        string;
  profile_no_sent_sub:    string;
  profile_seen_all:       string;
  profile_no_more:        string;
  profile_manage_account: string;
  profile_top_agent:      string;
  profile_delete_title:   string;
  profile_delete_desc:    string;
  profile_delete_confirm: string;
  profile_delete_loading: string;
  profile_delete_success: string;
  profile_delete_fail:    string;
  profile_reply_review:   string;

  // ── Nav menu (hamburger) ────────────────────────────────────────────────────
  menu_my_profile:      string;
  menu_edit_profile:    string;
  menu_list_property:   string;
  menu_become_agent:    string;
  menu_privacy:         string;
  menu_terms:           string;
  menu_faq:             string;
  menu_language:        string;

  // ── Property details page ───────────────────────────────────────────────────
  detail_loading:       string;
  detail_error:         string;
  detail_go_back:       string;
  detail_updated:       string;
  detail_available:     string;
  detail_unavailable:   string;
  detail_description:   string;
  detail_view_map:      string;
  detail_reviews:       string;
  detail_add_review:    string;
  detail_add_review_hd: string;     // popup header
  detail_all_reviews:   string;     // "View all X reviews →"
  detail_nearby:        string;
  detail_wishlist:      string;
  detail_review_single: string;     // "review"
  detail_review_plural: string;     // "reviews"

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
  home_featured:        "Featured Properties",
  home_top_agents:      "Top Agents",
  home_seen_all:        "You've seen all properties",
  home_view_all:        "View all →",
  home_more:            "More →",
  home_good_day:        "Good day 👋",
  home_subtitle:        "Find your next perfect home",

  map_list_property:    "＋ List Property",
  map_my_location:      "My location",

  filter_location:      "Location",
  filter_location_ph:   "Search city, area or landmark…",
  filter_searching:     "Searching location…",
  filter_prop_type:     "Property Type",
  filter_listed_for:    "Listed For",
  filter_price_budget:  "Price Budget",
  filter_per_year:      "year",
  filter_per_total:     "total",
  filter_any:           "Any",
  filter_no_limit:      "No limit",
  filter_min_price:     "Min Price",
  filter_max_price:     "Max Price",
  filter_showing:       "Showing:",
  filter_keywords:      "Keywords",
  filter_keywords_ph:   "e.g. furnished, fenced, parking lot…",
  filter_keywords_hint: "Separate terms with commas for best results",
  filter_reset:         "↺ Reset",
  filter_apply:         "Apply Filters",
  filter_show_results:  "Show {n} results",
  filter_all:           "All",
  filter_rent:          "Rent",
  filter_sale:          "Sale",

  profile_listings:       "Listings",
  profile_received:       "Received",
  profile_sent:           "Sent",
  profile_properties:     "Properties",
  profile_rating:         "Rating",
  profile_reviews:        "Reviews",
  profile_add_property:   "+ Add Property",
  profile_no_listings:    "No listings yet",
  profile_no_listings_sub: "Add your first property to get started",
  profile_list_property:  "+ List Property",
  profile_no_received:    "No reviews yet",
  profile_no_received_sub: "Reviews from tenants will appear here",
  profile_no_sent:        "No reviews sent yet",
  profile_no_sent_sub:    "Your property reviews will appear here",
  profile_seen_all:       "You've seen all your listings",
  profile_no_more:        "No more reviews",
  profile_manage_account: "Manage Account",
  profile_top_agent:      "Top Agent #1",
  profile_delete_title:   "Delete this listing?",
  profile_delete_desc:    "This property will be permanently deleted. This action cannot be undone.",
  profile_delete_confirm: "Yes, Delete Listing",
  profile_delete_loading: "Deleting…",
  profile_delete_success: "Property deleted successfully",
  profile_delete_fail:    "Failed to delete property",
  profile_reply_review:   "Reply to Review",

  menu_my_profile:      "My Profile",
  menu_edit_profile:    "Edit Profile",
  menu_list_property:   "List New Property",
  menu_become_agent:    "Become an Agent",
  menu_privacy:         "Privacy Policy",
  menu_terms:           "Terms of Service",
  menu_faq:             "FAQ",
  menu_language:        "Language",

  detail_loading:       "Loading property…",
  detail_error:         "Couldn't load property",
  detail_go_back:       "Go Back",
  detail_updated:       "Updated",
  detail_available:     "✅ Available",
  detail_unavailable:   "❌ Unavailable",
  detail_description:   "Description",
  detail_view_map:      "View full map",
  detail_reviews:       "Reviews",
  detail_add_review:    "+ Add Review",
  detail_add_review_hd: "Add a review",
  detail_all_reviews:   "View all {n} reviews →",
  detail_nearby:        "Nearby Properties",
  detail_wishlist:      "Save to wishlist",
  detail_review_single: "review",
  detail_review_plural: "reviews",

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
  home_featured:        "Propriétés vedettes",
  home_top_agents:      "Meilleurs agents",
  home_seen_all:        "Vous avez tout vu",
  home_view_all:        "Voir tout →",
  home_more:            "Plus →",
  home_good_day:        "Bonjour 👋",
  home_subtitle:        "Trouvez votre prochaine maison idéale",

  map_list_property:    "＋ Ajouter un bien",
  map_my_location:      "Ma position",

  filter_location:      "Localisation",
  filter_location_ph:   "Rechercher une ville, un quartier…",
  filter_searching:     "Recherche en cours…",
  filter_prop_type:     "Type de bien",
  filter_listed_for:    "Proposé pour",
  filter_price_budget:  "Budget",
  filter_per_year:      "an",
  filter_per_total:     "total",
  filter_any:           "Tous",
  filter_no_limit:      "Sans limite",
  filter_min_price:     "Prix min",
  filter_max_price:     "Prix max",
  filter_showing:       "Affichage :",
  filter_keywords:      "Mots-clés",
  filter_keywords_ph:   "ex. meublé, clôturé, parking…",
  filter_keywords_hint: "Séparez les termes par des virgules",
  filter_reset:         "↺ Réinitialiser",
  filter_apply:         "Appliquer",
  filter_show_results:  "Voir {n} résultats",
  filter_all:           "Tout",
  filter_rent:          "Location",
  filter_sale:          "Vente",

  profile_listings:       "Annonces",
  profile_received:       "Reçus",
  profile_sent:           "Envoyés",
  profile_properties:     "Biens",
  profile_rating:         "Note",
  profile_reviews:        "Avis",
  profile_add_property:   "+ Ajouter un bien",
  profile_no_listings:    "Aucune annonce",
  profile_no_listings_sub: "Ajoutez votre premier bien pour commencer",
  profile_list_property:  "+ Lister un bien",
  profile_no_received:    "Aucun avis reçu",
  profile_no_received_sub: "Les avis des locataires apparaîtront ici",
  profile_no_sent:        "Aucun avis envoyé",
  profile_no_sent_sub:    "Vos avis sur les biens apparaîtront ici",
  profile_seen_all:       "Vous avez vu toutes vos annonces",
  profile_no_more:        "Plus d'avis",
  profile_manage_account: "Gérer le compte",
  profile_top_agent:      "Meilleur agent #1",
  profile_delete_title:   "Supprimer cette annonce ?",
  profile_delete_desc:    "Ce bien sera définitivement supprimé. Cette action est irréversible.",
  profile_delete_confirm: "Oui, supprimer",
  profile_delete_loading: "Suppression…",
  profile_delete_success: "Bien supprimé avec succès",
  profile_delete_fail:    "Échec de la suppression",
  profile_reply_review:   "Répondre à l'avis",

  menu_my_profile:      "Mon profil",
  menu_edit_profile:    "Modifier le profil",
  menu_list_property:   "Ajouter un bien",
  menu_become_agent:    "Devenir agent",
  menu_privacy:         "Politique de confidentialité",
  menu_terms:           "Conditions d'utilisation",
  menu_faq:             "FAQ",
  menu_language:        "Langue",

  detail_loading:       "Chargement du bien…",
  detail_error:         "Impossible de charger le bien",
  detail_go_back:       "Retour",
  detail_updated:       "Mis à jour",
  detail_available:     "✅ Disponible",
  detail_unavailable:   "❌ Indisponible",
  detail_description:   "Description",
  detail_view_map:      "Voir la carte complète",
  detail_reviews:       "Avis",
  detail_add_review:    "+ Ajouter un avis",
  detail_add_review_hd: "Ajouter un avis",
  detail_all_reviews:   "Voir les {n} avis →",
  detail_nearby:        "Biens à proximité",
  detail_wishlist:      "Sauvegarder",
  detail_review_single: "avis",
  detail_review_plural: "avis",

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
  home_featured:        "Mali Zilizoangaziwa",
  home_top_agents:      "Mawakala Bora",
  home_seen_all:        "Umesoma mali zote",
  home_view_all:        "Tazama zote →",
  home_more:            "Zaidi →",
  home_good_day:        "Habari 👋",
  home_subtitle:        "Tafuta nyumba yako bora",

  map_list_property:    "＋ Ongeza Mali",
  map_my_location:      "Mahali pangu",

  filter_location:      "Mahali",
  filter_location_ph:   "Tafuta mji, eneo…",
  filter_searching:     "Inatafuta…",
  filter_prop_type:     "Aina ya Mali",
  filter_listed_for:    "Imeorodheshwa kwa",
  filter_price_budget:  "Bajeti ya Bei",
  filter_per_year:      "mwaka",
  filter_per_total:     "jumla",
  filter_any:           "Yote",
  filter_no_limit:      "Hakuna kikomo",
  filter_min_price:     "Bei ya Chini",
  filter_max_price:     "Bei ya Juu",
  filter_showing:       "Inaonyesha:",
  filter_keywords:      "Maneno Muhimu",
  filter_keywords_ph:   "mf. na samani, imefungwa, maegesho…",
  filter_keywords_hint: "Tenganisha maneno kwa mkato bora",
  filter_reset:         "↺ Weka upya",
  filter_apply:         "Tumia Vichujio",
  filter_show_results:  "Onyesha matokeo {n}",
  filter_all:           "Zote",
  filter_rent:          "Kukodi",
  filter_sale:          "Kuuza",

  profile_listings:       "Orodha",
  profile_received:       "Zilizopokelewa",
  profile_sent:           "Zilizotumwa",
  profile_properties:     "Mali",
  profile_rating:         "Ukadiriaji",
  profile_reviews:        "Maoni",
  profile_add_property:   "+ Ongeza Mali",
  profile_no_listings:    "Hakuna orodha bado",
  profile_no_listings_sub: "Ongeza mali yako ya kwanza kuanza",
  profile_list_property:  "+ Orodhesha Mali",
  profile_no_received:    "Hakuna maoni bado",
  profile_no_received_sub: "Maoni ya wapangaji yataonekana hapa",
  profile_no_sent:        "Hakuna maoni yaliyotumwa",
  profile_no_sent_sub:    "Maoni yako ya mali yataonekana hapa",
  profile_seen_all:       "Umeona orodha zako zote",
  profile_no_more:        "Hakuna maoni zaidi",
  profile_manage_account: "Simamia Akaunti",
  profile_top_agent:      "Wakala Bora #1",
  profile_delete_title:   "Futa orodha hii?",
  profile_delete_desc:    "Mali hii itafutwa kabisa. Kitendo hiki hakiwezi kutenduliwa.",
  profile_delete_confirm: "Ndiyo, Futa",
  profile_delete_loading: "Inafuta…",
  profile_delete_success: "Mali imefutwa",
  profile_delete_fail:    "Kufuta kumeshindwa",
  profile_reply_review:   "Jibu Maoni",

  menu_my_profile:      "Wasifu Wangu",
  menu_edit_profile:    "Hariri Wasifu",
  menu_list_property:   "Ongeza Mali",
  menu_become_agent:    "Kuwa Wakala",
  menu_privacy:         "Sera ya Faragha",
  menu_terms:           "Masharti ya Huduma",
  menu_faq:             "Maswali",
  menu_language:        "Lugha",

  detail_loading:       "Inapakia mali…",
  detail_error:         "Imeshindwa kupakia mali",
  detail_go_back:       "Rudi",
  detail_updated:       "Imesasishwa",
  detail_available:     "✅ Inapatikana",
  detail_unavailable:   "❌ Haipatikani",
  detail_description:   "Maelezo",
  detail_view_map:      "Tazama ramani kamili",
  detail_reviews:       "Maoni",
  detail_add_review:    "+ Ongeza Maoni",
  detail_add_review_hd: "Ongeza maoni",
  detail_all_reviews:   "Tazama maoni yote {n} →",
  detail_nearby:        "Mali za karibu",
  detail_wishlist:      "Hifadhi",
  detail_review_single: "maoni",
  detail_review_plural: "maoni",

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
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export const TRANSLATIONS: Record<Locale, Translations> = { en, fr, sw };

export const LOCALE_META: Record<Locale, { label: string; flag: string; nativeName: string }> = {
  en: { label: "English", flag: "🇬🇧", nativeName: "English"   },
  fr: { label: "French",  flag: "🇫🇷", nativeName: "Français"  },
  sw: { label: "Swahili", flag: "🇰🇪", nativeName: "Kiswahili" },
};

export const DEFAULT_LOCALE: Locale = "en";
export const STORAGE_KEY = "proptriz_locale";

// ─────────────────────────────────────────────────────────────────────────────
// INTERPOLATION HELPER
// Replaces {n} in a translated string with a runtime value.
// Usage: interpolate(t("filter_show_results"), { n: 42 }) → "Show 42 results"
// ─────────────────────────────────────────────────────────────────────────────

export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return Object.entries(vars).reduce(
    (acc, [key, val]) => acc.replace(new RegExp(`\\{${key}\\}`, "g"), String(val)),
    template,
  );
}