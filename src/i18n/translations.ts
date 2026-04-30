// src/i18n/translations.ts
//
// Single source of truth for all UI strings across supported languages.
// Add new keys here first, then use t(key) via useLanguage() hook.
//
// Languages:  en — English (default)  |  fr — French  |  sw — Swahili

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

  // ── Search bar ──────────────────────────────────────────────────────────────
  search_bar_filter:    string;
  search_filter_header: string;

  // ── Filter panel ────────────────────────────────────────────────────────────
  filter_location:      string;
  filter_location_ph:   string;
  filter_searching:     string;
  filter_prop_type:     string;
  filter_listed_for:    string;
  filter_price_budget:  string;
  filter_per_year:      string;
  filter_per_total:     string;
  filter_any:           string;
  filter_no_limit:      string;
  filter_min_price:     string;
  filter_max_price:     string;
  filter_showing:       string;
  filter_keywords:      string;
  filter_keywords_ph:   string;
  filter_keywords_hint: string;
  filter_reset:         string;
  filter_apply:         string;
  filter_show_results:  string;
  filter_pill:          string;
  filter_header:        string;
  filter_all:           string;
  filter_rent:          string;
  filter_sale:          string;

  // ── Add Property wizard ─────────────────────────────────────────────────────
  add_title:              string;
  add_subtitle:           string;
  add_ai_title:           string;
  add_ai_subtitle:        string;
  add_ai_entry:           string;
  add_ai_filled:          string;
  add_ai_filled_sub:      string;
  add_step_basics:        string;
  add_step_details:       string;
  add_step_preview:       string;
  add_step_ai:            string;
  add_cta_next:           string;
  add_cta_preview:        string;
  add_cta_publish:        string;
  add_cta_creating:       string;
  add_cta_uploading:      string;
  add_cta_published:      string;
  add_banner_creating:    string;
  add_banner_creating_sub: string;
  add_banner_uploading:   string;
  add_banner_uploading_sub: string;
  add_val_title:          string;
  add_val_price:          string;
  add_val_address:        string;
  add_val_photos:         string;
  add_val_login:          string;
  add_toast_pinned:       string;
  add_toast_listed:       string;
  add_toast_listed_photos: string;
  add_toast_photos_warn:  string;
  add_toast_failed:       string;

  // ── Add Property — Step 1 ───────────────────────────────────────────────────
  s1_prop_type:         string;
  s1_prop_title:        string;
  s1_prop_title_ph:     string;
  s1_pricing:           string;
  s1_listed_for:        string;
  s1_for_rent:          string;
  s1_for_sale:          string;
  s1_rent_price:        string;
  s1_sell_price:        string;
  s1_tenancy_period:    string;
  s1_period_daily:      string;
  s1_period_weekly:     string;
  s1_period_monthly:    string;
  s1_period_yearly:     string;
  s1_negotiable:        string;
  s1_fixed_price:       string;
  s1_negotiable_sub:    string;
  s1_fixed_sub:         string;
  s1_duration:          string;
  s1_duration_label:    string;
  s1_duration_suffix:   string;
  s1_location:          string;
  s1_location_ph:       string;

  // ── Add Property — Step 2 ───────────────────────────────────────────────────
  s2_photos:            string;
  s2_photos_sub:        string;
  s2_photos_tip:        string;
  s2_status:            string;
  s2_status_available:  string;
  s2_status_rented:     string;
  s2_status_unavail:    string;
  s2_description:       string;
  s2_description_ph:    string;
  s2_features:          string;
  s2_features_sub:      string;
  s2_custom_ph:         string;
  s2_add_custom:        string;

  // ── Add Property — Step 3 (Preview) ─────────────────────────────────────────
  s3_photos:            string;
  s3_photos_sub:        string;
  s3_prop_type:         string;
  s3_prop_title:        string;
  s3_pricing:           string;
  s3_description:       string;
  s3_description_ph:    string;
  s3_features:          string;
  s3_features_sub:      string;
  s3_duration:          string;
  s3_duration_sub:      string;
  s3_status:            string;
  s3_negotiable:        string;

  // ── AI Extraction ────────────────────────────────────────────────────────────
  ai_describe:          string;
  ai_describe_sub:      string;
  ai_describe_ph:       string;
  ai_chars:             string;
  ai_chars_good:        string;
  ai_photos:            string;
  ai_photos_sub:        string;
  ai_location:          string;
  ai_location_sub:      string;
  ai_location_ph:       string;
  ai_tips_title:        string;
  ai_tip_1:             string;
  ai_tip_2:             string;
  ai_tip_3:             string;
  ai_tip_4:             string;
  ai_extract_btn:       string;
  ai_extracting:        string;
  ai_how_describe:      string;
  ai_how_photos:        string;
  ai_how_location:      string;
  ai_how_extract:       string;
  ai_progress:          string;
  ai_powered_by:        string;
  ai_err_empty:         string;

  // ── ExtractionModal ──────────────────────────────────────────────────────────
  extr_title:           string;
  extr_subtitle:        string;
  extr_done_title:      string;
  extr_done_sub:        string;
  extr_err_title:       string;
  extr_geocoding:       string;
  extr_geocoding_sub:   string;
  extr_extracting:      string;
  extr_extracting_sub:  string;
  extr_done:            string;
  extr_done_step_sub:   string;
  extr_complete:        string;
  extr_cancel:          string;
  extr_retry:           string;
  extr_cancel_btn:      string;

  // ── PublishSuccessModal ──────────────────────────────────────────────────────
  pub_title:            string;
  pub_subtitle:         string;
  pub_list_another:     string;
  pub_list_another_sub: string;
  pub_view_listing:     string;
  pub_view_listing_sub: string;
  pub_go_profile:       string;
  pub_go_profile_sub:   string;
  pub_go_home:          string;
  pub_go_home_sub:      string;
  pub_listed_on:        string;

  // ── Edit Profile ─────────────────────────────────────────────────────────────
  ep_title:             string;
  ep_identity:          string;
  ep_full_name:         string;
  ep_full_name_ph:      string;
  ep_account_type:      string;
  ep_contact:           string;
  ep_email:             string;
  ep_email_ph:          string;
  ep_phone:             string;
  ep_whatsapp:          string;
  ep_whatsapp_ph:       string;
  ep_save:              string;
  ep_saving:            string;
  ep_privacy:           string;
  ep_photo_invalid:     string;
  ep_photo_large:       string;
  ep_photo_selected:    string;
  ep_updated:           string;
  ep_failed:            string;
  ep_type_individual:   string;
  ep_type_agent:        string;
  ep_type_company:      string;
  ep_type_individual_desc: string;
  ep_type_agent_desc:   string;
  ep_type_company_desc: string;

  // ── Edit Property ────────────────────────────────────────────────────────────
  edt_title:            string;
  edt_loading:          string;
  edt_error:            string;
  edt_go_back:          string;
  edt_expired_warn:     string;
  edt_prop_type:        string;
  edt_prop_title_sec:   string;
  edt_prop_title_ph:    string;
  edt_pricing:          string;
  edt_for_rent:         string;
  edt_for_sale:         string;
  edt_rent_price:       string;
  edt_sell_price:       string;
  edt_tenancy_period:   string;
  edt_negotiable:       string;
  edt_fixed_price:      string;
  edt_negotiable_sub:   string;
  edt_fixed_sub:        string;
  edt_duration:         string;
  edt_duration_warn:    string;
  edt_status:           string;
  edt_location:         string;
  edt_location_ph:      string;
  edt_map_hint:         string;
  edt_description:      string;
  edt_description_ph:   string;
  edt_features:         string;
  edt_custom_ph:        string;
  edt_add_custom:       string;
  edt_photos:           string;
  edt_photos_note:      string;
  edt_save:             string;
  edt_saving:           string;
  edt_login_save:       string;
  edt_danger_desc:      string;
  edt_delete_btn:       string;
  edt_delete_title:     string;
  edt_delete_desc:      string;
  edt_delete_confirm:   string;
  edt_delete_loading:   string;
  edt_updated:          string;
  edt_failed:           string;
  edt_deleted:          string;
  edt_not_found:        string;
  edt_val_title:        string;
  edt_val_price:        string;
  edt_val_address:      string;

  // ── Reviews ──────────────────────────────────────────────────────────────────
  rev_add_placeholder:  string;
  rev_add_submit:       string;
  rev_add_submitting:   string;
  rev_add_photo:        string;
  rev_add_login:        string;
  rev_add_own:          string;
  rev_add_failed:       string;
  rev_add_success:      string;
  rev_add_photo_invalid: string;
  rev_add_photo_large:  string;
  rev_add_photo_added:  string;
  rev_reply_placeholder: string;
  rev_reply_send:       string;
  rev_reply_failed:     string;
  rev_reply_success:    string;
  rev_reply_error:      string;
  rev_replies_header:   string;
  rev_write_header:     string;
  rev_owner:            string;

  // ── Splash / Login ───────────────────────────────────────────────────────────
  splash_checking:      string;
  splash_sdk:           string;
  splash_pi_auth:       string;
  splash_verifying:     string;
  splash_signed_in:     string;
  splash_timeout:       string;
  splash_failed:        string;
  splash_pi_required:   string;
  splash_pi_desc:       string;
  splash_pi_btn:        string;
  splash_pi_connecting: string;
  splash_help:          string;
  splash_trouble:       string;
  splash_or:            string;

  // ── Profile page ────────────────────────────────────────────────────────────
  profile_listings:         string;
  profile_received:         string;
  profile_sent:             string;
  profile_properties:       string;
  profile_rating:           string;
  profile_reviews:          string;
  profile_add_property:     string;
  profile_no_listings:      string;
  profile_no_listings_sub:  string;
  profile_list_property:    string;
  profile_no_received:      string;
  profile_no_received_sub:  string;
  profile_no_sent:          string;
  profile_no_sent_sub:      string;
  profile_seen_all:         string;
  profile_no_more:          string;
  profile_manage_account:   string;
  profile_top_agent:        string;
  profile_delete_title:     string;
  profile_delete_desc:      string;
  profile_delete_confirm:   string;
  profile_delete_loading:   string;
  profile_delete_success:   string;
  profile_delete_fail:      string;
  profile_reply_review:     string;

  // ── Nav menu (hamburger) ────────────────────────────────────────────────────
  menu_my_profile:      string;
  menu_edit_profile:    string;
  menu_list_property:   string;
  menu_become_agent:    string;
  menu_privacy:         string;
  menu_terms:           string;
  menu_faq:             string;
  menu_language:        string;

  // ── Property details ────────────────────────────────────────────────────────
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
  detail_add_review_hd: string;
  detail_all_reviews:   string;
  detail_nearby:        string;
  detail_wishlist:      string;
  detail_review_single: string;
  detail_review_plural: string;

  // ── Currency names ──────────────────────────────────────────────────────────
  cur_ngn:              string;
  cur_usd:              string;
  cur_kes:              string;
  cur_cfa:              string;
  cur_cda:              string;
  cur_pi:               string;

  // ── ListFor standalone ────────────────────────────────────────────────────────
  list_for_rent:        string;
  list_for_sale:        string;

  // ── Property status standalone ───────────────────────────────────────────────
  status_available:     string;
  status_sold:          string;
  status_rented:        string;
  status_unavailable:   string;
  status_expired:       string;

  // ── Negotiable standalone ────────────────────────────────────────────────────
  neg_negotiable:       string;
  neg_fixed:            string;

  // ── Map marker popup ─────────────────────────────────────────────────────────
  map_view:             string;
  map_negotiable:       string;

  // ── Sticky agent bar ─────────────────────────────────────────────────────────
  agent_owner:          string;
  agent_agent:          string;
  agent_company:        string;
  agent_call:           string;
  agent_email:          string;
  agent_whatsapp:       string;
  agent_chat:           string;

  // ── Step 3 Listing Summary ────────────────────────────────────────────────────
  s3_sum_header:        string;
  s3_sum_title:         string;
  s3_sum_category:      string;
  s3_sum_price:         string;
  s3_sum_listed_for:    string;
  s3_sum_period:        string;
  s3_sum_status:        string;
  s3_sum_duration:      string;
  s3_sum_weeks:         string;
  s3_sum_negotiable:    string;
  s3_sum_yes:           string;
  s3_sum_no:            string;
  s3_sum_features:      string;
  s3_sum_description:   string;
  s3_location:          string;

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

  // ── Property Map page ────────────────────────────────────────────────────────
  map_snap_expand:       string;
  map_snap_more:         string;
  map_snap_collapse:     string;
  map_centre_btn:        string;
  map_resize_panel:      string;
  map_tab_facilities:    string;
  map_tab_details:       string;
  map_no_facilities:     string;
  map_no_facilities_sub: string;
  map_landmark_fallback: string;
  map_nearby_label:      string;
  map_verified_title:    string;
  map_confirm_title:     string;
  map_verified_btn:      string;
  map_confirm_btn:       string;
  map_road_access:       string;
  map_prop_features:     string;
  map_full_address:      string;
  map_gps:               string;
  map_open_google:       string;

  // ── Image Manager ────────────────────────────────────────────────────────────
  img_upload_title:     string;
  img_add_photo:        string;
  img_removed:          string;
  img_remove_failed:    string;
  img_upload_success:   string;
  img_upload_failed:    string;

  // ── Property Location Modal (landmark picker) ────────────────────────────────
  lm_step_location:      string;
  lm_step_facilities:    string;
  lm_new_pin:            string;
  lm_pinned_location:    string;
  lm_already_tagged:     string;
  lm_duplicate_hint:     string;
  lm_name_label:         string;
  lm_name_ph:            string;
  lm_category_label:     string;
  lm_saving:             string;
  lm_add_btn:            string;
  lm_save_changes:       string;
  lm_other:              string;
  lm_delete_desc:        string;
  lm_keep_btn:           string;
  lm_remove_btn:         string;
  lm_edit_aria:          string;
  lm_delete_aria:        string;
  lm_empty_title:        string;
  lm_empty_sub:          string;
  lm_go_to_map:          string;
  lm_search_address_ph:  string;
  lm_search_area_ph:     string;
  lm_next_step:          string;
  lm_panel_title:        string;
  lm_optional:           string;
  lm_panel_desc:         string;
  lm_back_btn:           string;
  lm_skip_btn:           string;
  lm_save_btn:           string;
  lm_done_btn:           string;
  lm_mobile_list_title:  string;
  lm_added_count:        string;
  lm_mobile_list_hint:   string;
  lm_toggle_list:        string;
  lm_toggle_map:         string;
  lm_popup_add_title:    string;
  lm_popup_edit_title:   string;
  lm_popup_delete_title: string;
  lm_err_name_required:  string;
  lm_err_save_failed:    string;
  lm_err_update_failed:  string;

  // ── Map Preview widget ────────────────────────────────────────────────────────
  map_preview_tap_hint:  string;  // "Tap to pick your property location"
  map_preview_change:    string;  // "Change"
  map_preview_pick:      string;  // "Pick Location"
  map_preview_no_address: string; // "No address typed yet"
  map_preview_no_coords: string;  // "Coordinates not set"
  map_preview_open:      string;  // "Open Map →"

  // ── FAQ & Support ────────────────────────────────────────────────────────────
  faq_title_bold:        string;  // "FAQ"
  faq_title_light:       string;  // "& Support"
  faq_subtitle:          string;  // "Find answer to your problem using this app."
  faq_visit_website:     string;  // "Visit our website"
  faq_email_us:          string;  // "Email us"
  faq_privacy:           string;  // "Privacy policy"
  faq_terms:             string;  // "Terms of service"
  faq_tab_buyer:         string;  // "Buyer"
  faq_tab_agent:         string;  // "Estate Agent"
  // Buyer FAQ
  faq_b_q1:             string;
  faq_b_a1:             string;
  faq_b_q2:             string;
  faq_b_a2:             string;
  // Agent FAQ
  faq_a_q1:             string;
  faq_a_a1:             string;
  faq_a_q2:             string;
  faq_a_a2:             string;

  // ── Terms of Service page ────────────────────────────────────────────────────
  terms_screen_title:    string;  // ScreenName title
  terms_main_title:      string;  // h1
  terms_last_updated:    string;  // "Last Updated: 16/02/2026"
  terms_email_label:     string;  // "Email Address" / "Email"
  terms_s1_title:        string;
  terms_s1_body:         string;
  terms_s2_title:        string;
  terms_s2_body:         string;
  terms_s3_title:        string;
  terms_s3_body:         string;
  terms_s4_title:        string;
  terms_s4_li1:          string;
  terms_s4_li2:          string;
  terms_s4_li3:          string;
  terms_s4_li4:          string;
  terms_s5_title:        string;
  terms_s5_body:         string;
  terms_s6_title:        string;
  terms_s6_body:         string;
  terms_s7_title:        string;
  terms_s7_body:         string;
  terms_s8_title:        string;
  terms_s8_body:         string;
  terms_s9_title:        string;
  terms_s9_body:         string;
  terms_s10_title:       string;
  terms_s10_body:        string;
  terms_s11_title:       string;

  // ── Privacy Policy page ──────────────────────────────────────────────────────
  privacy_screen_title:       string;
  privacy_main_title:         string;
  privacy_s1_title:           string;
  privacy_s1_body1:           string;
  privacy_s1_body2:           string;
  privacy_s2_title:           string;
  privacy_s2_li1:             string;
  privacy_s2_li2:             string;
  privacy_s2_li3:             string;
  privacy_s2_li4:             string;
  privacy_s3_title:           string;
  privacy_s3_h_account:       string;
  privacy_s3_account_li1:     string;
  privacy_s3_account_li2:     string;
  privacy_s3_account_li3:     string;
  privacy_s3_account_li4:     string;
  privacy_s3_h_listing:       string;
  privacy_s3_listing_li1:     string;
  privacy_s3_listing_li2:     string;
  privacy_s3_listing_li3:     string;
  privacy_s3_h_tech:          string;
  privacy_s3_tech_li1:        string;
  privacy_s3_tech_li2:        string;
  privacy_s3_tech_li3:        string;
  privacy_s4_title:           string;
  privacy_s4_li1:             string;
  privacy_s4_li2:             string;
  privacy_s4_li3:             string;
  privacy_s4_li4:             string;
  privacy_s4_li5:             string;
  privacy_s5_title:           string;
  privacy_s5_intro:           string;
  privacy_s5_li1:             string;
  privacy_s5_li2:             string;
  privacy_s5_li3:             string;
  privacy_s5_li4:             string;
  privacy_s6_title:           string;
  privacy_s6_body:            string;
  privacy_s7_title:           string;
  privacy_s7_li1:             string;
  privacy_s7_li2:             string;
  privacy_s7_li3:             string;
  privacy_s7_li4:             string;
  privacy_s7_li5:             string;
  privacy_s8_title:           string;
  privacy_s8_body:            string;
  privacy_s9_title:           string;
}

// ─────────────────────────────────────────────────────────────────────────────
// ENGLISH (default)
// ─────────────────────────────────────────────────────────────────────────────

const en: Translations = {
  lang_en: "English", lang_fr: "Français", lang_sw: "Kiswahili",

  lang_picker_title: "Choose Language", lang_picker_subtitle: "Select your preferred language",
  lang_picker_save: "Save", lang_picker_cancel: "Cancel",

  nav_map: "Map", nav_explore: "Explore", nav_saved: "Saved", nav_profile: "Profile",

  cat_apartment: "Apartment", cat_land: "Land", cat_shortlet: "Shortlet",
  cat_hotel: "Hotel", cat_shop: "Shop", cat_office: "Office", cat_others: "Others",

  home_greeting: "Find your perfect space", home_search_hint: "Search by location, type…",
  home_nearby: "Nearby Properties", home_see_all: "See All", home_show_less: "Show Less",
  home_loading: "Loading properties…", home_no_results: "No properties found nearby",
  home_top_locations: "Top Locations", home_for_rent: "Rent", home_for_sale: "Sale",
  home_all: "All", home_featured: "Featured Properties", home_top_agents: "Top Agents",
  home_seen_all: "You've seen all properties", home_view_all: "View all →",
  home_more: "More →", home_good_day: "Good day 👋", home_subtitle: "Find your next perfect home",

  map_list_property: "＋ List Property", map_my_location: "My location",

  search_bar_filter: "Filter", search_filter_header: "Filter Properties",

  filter_location: "Location", filter_location_ph: "Search city, area or landmark…",
  filter_searching: "Searching location…", filter_prop_type: "Property Type",
  filter_listed_for: "Listed For", filter_price_budget: "Price Budget",
  filter_per_year: "year", filter_per_total: "total", filter_any: "Any",
  filter_no_limit: "No limit", filter_min_price: "Min Price", filter_max_price: "Max Price",
  filter_showing: "Showing:", filter_keywords: "Keywords",
  filter_keywords_ph: "e.g. furnished, fenced, parking lot…",
  filter_keywords_hint: "Separate terms with commas for best results",
  filter_reset: "Reset", filter_apply: "Apply Filters",
  filter_show_results: "Show {n} results",
  filter_pill: "Filter", filter_header: "Filter Properties",
  filter_all: "All", filter_rent: "Rent", filter_sale: "Sale",

  add_title: "Add Property", add_subtitle: "Hi {name}, let's list your space",
  add_ai_title: "List with AI", add_ai_subtitle: "Describe your property — AI fills the form",
  add_ai_entry: "✨ List with AI — describe it, we fill the form",
  add_ai_filled: "✨ AI filled your listing",
  add_ai_filled_sub: "Review the details below — edit anything before publishing.",
  add_step_basics: "Basics", add_step_details: "Details",
  add_step_preview: "Preview", add_step_ai: "AI",
  add_cta_next: "Add Photos & Details →", add_cta_preview: "Preview Listing →",
  add_cta_publish: "Publish Property 🎉", add_cta_creating: "Creating listing…",
  add_cta_uploading: "Uploading photo {cur} of {total}…", add_cta_published: "Published! ✨",
  add_banner_creating: "Creating your listing…",
  add_banner_creating_sub: "Saving title, price & location — this is fast",
  add_banner_uploading: "Uploading photo {cur} of {total}",
  add_banner_uploading_sub: "Photos compressed & sent one by one for reliability",
  add_val_title: "Please enter a property title.",
  add_val_price: "Please enter a valid price.",
  add_val_address: "Please enter the property address.",
  add_val_photos: "Please add at least one property photo.",
  add_val_login: "Please login to list a property.",
  add_toast_pinned: "Location pinned",
  add_toast_listed: "Property successfully listed! 🎉",
  add_toast_listed_photos: "Property listed with all photos! 🎉",
  add_toast_photos_warn: "{s} photo(s) uploaded. {f} failed — add via Edit Property.",
  add_toast_failed: "Failed to create property.",

  s1_prop_type: "Property Type", s1_prop_title: "Property Title",
  s1_prop_title_ph: "e.g. Modern 3-Bed Duplex in Lekki",
  s1_pricing: "Pricing", s1_listed_for: "Listed For *",
  s1_for_rent: "For Rent", s1_for_sale: "For Sale",
  s1_rent_price: "Rent Price", s1_sell_price: "Sell Price",
  s1_tenancy_period: "Tenancy Period",
  s1_period_daily: "Daily", s1_period_weekly: "Weekly",
  s1_period_monthly: "Monthly", s1_period_yearly: "Yearly",
  s1_negotiable: "✅ Negotiable", s1_fixed_price: "🔒 Fixed Price",
  s1_negotiable_sub: "Buyers can propose a different price",
  s1_fixed_sub: "The listed price is final",
  s1_duration: "Listing Duration", s1_duration_label: "Duration",
  s1_duration_suffix: "weeks", s1_location: "Property Location",
  s1_location_ph: "Street address, area, city…",

  s2_photos: "Property Photos",
  s2_photos_sub: "Add up to 8 photos. The first photo becomes your cover image.",
  s2_photos_tip: "Properties with photos get 3× more views",
  s2_status: "Listing Status", s2_status_available: "Available",
  s2_status_rented: "Rented", s2_status_unavail: "Unavailable",
  s2_description: "Description",
  s2_description_ph: "Describe the property, its features and neighbourhood…",
  s2_features: "Features & Facilities",
  s2_features_sub: "Toggle common amenities or add your own below.",
  s2_custom_ph: "Custom feature or facility…",
  s2_add_custom: "Add Custom Feature",

  s3_photos: "Photos", s3_photos_sub: "Cover image · tap to change",
  s3_prop_type: "Property Type", s3_prop_title: "Property Title",
  s3_pricing: "Pricing", s3_description: "Description",
  s3_description_ph: "Describe the property, features and neighbourhood…",
  s3_features: "Features", s3_features_sub: "Tap × to remove any feature that doesn't apply.",
  s3_duration: "Listing Duration",
  s3_duration_sub: "How many weeks should this listing stay active before it expires?",
  s3_status: "Availability Status", s3_negotiable: "Negotiable",

  ai_describe: "Describe Your Property",
  ai_describe_sub: "Mention type, size, price, location, and standout features. The more detail, the better the result.",
  ai_describe_ph: "e.g. 3 bedroom duplex in Lekki Phase 1, Lagos. ₦4.5M/year for rent. Has 2 bathrooms, boys quarter, spacious compound, 24hr electricity and water. Gated estate, close to Chevron roundabout.",
  ai_chars: "{n} chars", ai_chars_good: "· ✓ good",
  ai_photos: "Property Photos (Optional)",
  ai_photos_sub: "Photos carry over to your listing automatically. Upload the exterior first — it becomes the cover image.",
  ai_location: "Property Location (Optional)",
  ai_location_sub: "Type the address or pin it on the map so AI can set coordinates accurately.",
  ai_location_ph: "Type address or area (optional)…",
  ai_tips_title: "Tips for best results",
  ai_tip_1: "• Mention price, property type, and number of rooms",
  ai_tip_2: "• Include the neighbourhood or nearest landmark",
  ai_tip_3: "• Typing an address gives the most accurate map pin",
  ai_tip_4: "• You can edit all extracted details before publishing",
  ai_extract_btn: "✨ Extract Information", ai_extracting: "Extracting…",
  ai_how_describe: "Describe it", ai_how_photos: "Add photos",
  ai_how_location: "Pin location", ai_how_extract: "Extract ✨",
  ai_progress: "Extracting property details — this may take up to 30 seconds…",
  ai_powered_by: "Powered by Llama 3 · usually 15–30 seconds",
  ai_err_empty: "Please describe the property so AI has something to work with.",

  extr_title: "Analysing Your Property",
  extr_subtitle: "Hang tight — AI is filling your listing form…",
  extr_done_title: "Details Extracted! ✨",
  extr_done_sub: "Review and edit the details before publishing.",
  extr_err_title: "Extraction Failed",
  extr_geocoding: "Resolving location", extr_geocoding_sub: "Looking up coordinates from your address",
  extr_extracting: "Extracting property details", extr_extracting_sub: "AI is reading your description — usually 15–30 s",
  extr_done: "Done!", extr_done_step_sub: "Your listing details are ready to review",
  extr_complete: "Complete",
  extr_cancel: "Cancel extraction", extr_retry: "↺ Try Again", extr_cancel_btn: "Cancel",

  pub_title: "Property Published! 🎉",
  pub_subtitle: "Your property is now live and visible to buyers and renters across PropTriz.",
  pub_list_another: "List Another Property", pub_list_another_sub: "Start a new listing from scratch",
  pub_view_listing: "View Your Listing", pub_view_listing_sub: "See how it looks to buyers",
  pub_go_profile: "Go to Profile", pub_go_profile_sub: "Manage all your listings",
  pub_go_home: "Back to Home", pub_go_home_sub: "Browse the marketplace",
  pub_listed_on: "Listed on",

  ep_title: "Edit Profile", ep_identity: "Identity",
  ep_full_name: "Full Name / Brand", ep_full_name_ph: "Enter your full name or brand",
  ep_account_type: "Account Type", ep_contact: "Contact Details",
  ep_email: "Email (optional)", ep_email_ph: "Enter your email",
  ep_phone: "Phone Number", ep_whatsapp: "WhatsApp (optional)",
  ep_whatsapp_ph: "+234 080 3288 9111",
  ep_save: "✓ Save Changes", ep_saving: "Updating…",
  ep_privacy: "Your information is only visible to parties you engage with.",
  ep_photo_invalid: "Invalid file type. Please select a PNG or JPG image.",
  ep_photo_large: "File is too large. Maximum size is 2 MB.",
  ep_photo_selected: "Photo selected — save to apply.",
  ep_updated: "Profile updated successfully!",
  ep_failed: "Failed to update profile.",
  ep_type_individual: "Individual", ep_type_agent: "Agent", ep_type_company: "Company",
  ep_type_individual_desc: "Personal property owner",
  ep_type_agent_desc: "Licensed property agent",
  ep_type_company_desc: "Real estate company",

  edt_title: "Edit Property", edt_loading: "Loading property…",
  edt_error: "Failed to load property. Please go back and try again.",
  edt_go_back: "← Go Back", edt_expired_warn: "This listing has expired. Extend the duration below to reactivate it.",
  edt_prop_type: "Property Type", edt_prop_title_sec: "Property Title",
  edt_prop_title_ph: "e.g. Modern 3-Bed Duplex in Lekki",
  edt_pricing: "Pricing", edt_for_rent: "For Rent", edt_for_sale: "For Sale",
  edt_rent_price: "Rent Price", edt_sell_price: "Sell Price",
  edt_tenancy_period: "Tenancy Period",
  edt_negotiable: "✅ Negotiable", edt_fixed_price: "🔒 Fixed Price",
  edt_negotiable_sub: "Buyers can propose a different price",
  edt_fixed_sub: "The listed price is final",
  edt_duration: "Listing Duration",
  edt_duration_warn: "Increase the duration to extend your listing's active period.",
  edt_status: "Availability Status", edt_location: "Property Location",
  edt_location_ph: "Street address, area, city…",
  edt_map_hint: "📌 Update the pin if your property's map location has changed — buyers search by proximity.",
  edt_description: "Description",
  edt_description_ph: "Describe the property, its features and neighbourhood…",
  edt_features: "Environment & Facilities",
  edt_custom_ph: "Custom feature name…", edt_add_custom: "Add Custom Feature",
  edt_photos: "Property Photos",
  edt_photos_note: "Photos save instantly when added or removed — independent of the \"Save Changes\" button below. Each photo is auto-optimised before upload.",
  edt_save: "✓ Save Changes", edt_saving: "Saving…",
  edt_login_save: "🔒 Login on Pi Browser to Save",
  edt_danger_desc: "Permanently remove this listing and all its data. This cannot be undone.",
  edt_delete_btn: "🗑️ Delete Listing",
  edt_delete_title: "Delete this listing?",
  edt_delete_desc: "will be permanently removed. This action cannot be undone.",
  edt_delete_confirm: "Yes, Delete Listing", edt_delete_loading: "Deleting…",
  edt_updated: "Property details updated! ✅",
  edt_failed: "Unexpected error occurred.",
  edt_deleted: "Listing deleted.", edt_not_found: "Property not found.",
  edt_val_title: "Please enter a property title.",
  edt_val_price: "Please enter a valid price.",
  edt_val_address: "Please enter the property address.",

  rev_add_placeholder: "Share your experience with this property…",
  rev_add_submit: "Submit Review", rev_add_submitting: "Submitting…",
  rev_add_photo: "Add Photo",
  rev_add_login: "You must be logged in to submit a review.",
  rev_add_own: "You cannot rate your own property.",
  rev_add_failed: "Failed to submit review. Please try again.",
  rev_add_success: "Review submitted successfully!",
  rev_add_photo_invalid: "Invalid file type. Please select a PNG or JPG image.",
  rev_add_photo_large: "File is too large. Maximum size is 2 MB.",
  rev_add_photo_added: "Photo added to review.",
  rev_reply_placeholder: "Write your reply…",
  rev_reply_send: "Send", rev_reply_failed: "Failed to submit reply.",
  rev_reply_success: "Reply sent!", rev_reply_error: "Something went wrong.",
  rev_replies_header: "Replies", rev_write_header: "Write a Review",
  rev_owner: "Owner",

  splash_checking: "Checking session…", splash_sdk: "Loading Pi SDK…",
  splash_pi_auth: "Authenticating with Pi…", splash_verifying: "Verifying identity…",
  splash_signed_in: "Signed in! Redirecting…", splash_timeout: "Connection timed out",
  splash_failed: "Login failed — please retry",
  splash_pi_required: "Required: Pi Browser",
  splash_pi_desc: "To use your Pi Wallet and Identity, you must be browsing within the Pi Browser app.",
  splash_pi_btn: "Continue with Pi Network",
  splash_pi_connecting: "Connecting to Pi…",
  splash_help: "Get Help", splash_trouble: "Trouble signing in?",
  splash_or: "or",

  profile_listings: "Listings", profile_received: "Received", profile_sent: "Sent",
  profile_properties: "Properties", profile_rating: "Rating", profile_reviews: "Reviews",
  profile_add_property: "+ Add Property",
  profile_no_listings: "No listings yet", profile_no_listings_sub: "Add your first property to get started",
  profile_list_property: "+ List Property",
  profile_no_received: "No reviews yet", profile_no_received_sub: "Reviews from tenants will appear here",
  profile_no_sent: "No reviews sent yet", profile_no_sent_sub: "Your property reviews will appear here",
  profile_seen_all: "You've seen all your listings", profile_no_more: "No more reviews",
  profile_manage_account: "Manage Account", profile_top_agent: "Top Agent #1",
  profile_delete_title: "Delete this listing?",
  profile_delete_desc: "This property will be permanently deleted. This action cannot be undone.",
  profile_delete_confirm: "Yes, Delete Listing", profile_delete_loading: "Deleting…",
  profile_delete_success: "Property deleted successfully", profile_delete_fail: "Failed to delete property",
  profile_reply_review: "Reply to Review",

  menu_my_profile: "My Profile", menu_edit_profile: "Edit Profile",
  menu_list_property: "List New Property", menu_become_agent: "Become an Agent",
  menu_privacy: "Privacy Policy", menu_terms: "Terms of Service",
  menu_faq: "FAQ", menu_language: "Language",

  detail_loading: "Loading property…", detail_error: "Couldn't load property",
  detail_go_back: "Go Back", detail_updated: "Updated",
  detail_available: "✅ Available", detail_unavailable: "❌ Unavailable",
  detail_description: "Description", detail_view_map: "View full map",
  detail_reviews: "Reviews", detail_add_review: "+ Add Review",
  detail_add_review_hd: "Add a review", detail_all_reviews: "View all {n} reviews →",
  detail_nearby: "Nearby Properties", detail_wishlist: "Save to wishlist",
  detail_review_single: "review", detail_review_plural: "reviews",

  cur_ngn: "Nigerian Naira (₦)", cur_usd: "US Dollar ($)",
  cur_kes: "Kenyan Shilling (KSh)", cur_cfa: "CFA Franc (FCFA)",
  cur_cda: "CDA", cur_pi: "Pi Network (Pi)",

  list_for_rent: "For Rent", list_for_sale: "For Sale",

  status_available: "Available", status_sold: "Sold",
  status_rented: "Rented", status_unavailable: "Unavailable",
  status_expired: "Expired",

  neg_negotiable: "Negotiable", neg_fixed: "Fixed Price",

  map_view: "View", map_negotiable: "Negotiable",

  agent_owner: "Property Owner", agent_agent: "Property Agent",
  agent_company: "Real Estate Company",
  agent_call: "Call", agent_email: "Email",
  agent_whatsapp: "WhatsApp", agent_chat: "Chat",

  s3_sum_header: "Listing Summary",
  s3_sum_title: "Title", s3_sum_category: "Category",
  s3_sum_price: "Price", s3_sum_listed_for: "Listed For",
  s3_sum_period: "Period", s3_sum_status: "Status",
  s3_sum_duration: "Duration", s3_sum_weeks: "{n} weeks",
  s3_sum_negotiable: "Negotiable",
  s3_sum_yes: "✅ Yes", s3_sum_no: "🔒 No",
  s3_sum_features: "Features", s3_sum_description: "Description",
  s3_location: "Location",

  common_save: "Save", common_cancel: "Cancel", common_close: "Close",
  common_loading: "Loading…", common_error: "Something went wrong",
  common_retry: "Try Again", common_per_year: "/yr",
  common_per_month: "/mo", common_per_night: "/night",

  map_snap_expand: "Expand ↑", map_snap_more: "Show more ↑", map_snap_collapse: "Collapse ↓",
  map_centre_btn: "Centre on property", map_resize_panel: "Resize panel",
  map_tab_facilities: "Nearby Facilities", map_tab_details: "Property Details",
  map_no_facilities: "No facilities nearby",
  map_no_facilities_sub: "No facilities have been added within 2 km of this property yet.",
  map_landmark_fallback: "Landmark", map_nearby_label: "nearby",
  map_verified_title: "Location verified by community", map_confirm_title: "Confirm this landmark",
  map_verified_btn: "Verified", map_confirm_btn: "Confirm",
  map_road_access: "Road Access & Environment", map_prop_features: "Property Features",
  map_full_address: "Full Address", map_gps: "GPS Coordinates",
  map_open_google: "Open in Google Maps",

  img_upload_title: "Upload Property Images", img_add_photo: "Add Photo",
  img_removed: "Image removed", img_remove_failed: "Failed to remove image",
  img_upload_success: "Image uploaded successfully", img_upload_failed: "Failed to upload image",

  lm_step_location: "Location", lm_step_facilities: "Facilities",
  lm_new_pin: "New Pin", lm_pinned_location: "Pinned location",
  lm_already_tagged: "Already tagged nearby",
  lm_duplicate_hint: "💡 Check the list before adding — you may be tagging the same place.",
  lm_name_label: "Landmark name", lm_name_ph: "e.g. Ikeja City Mall, General Hospital…",
  lm_category_label: "Category", lm_saving: "Saving…",
  lm_add_btn: "Add Nearby Facilities", lm_save_changes: "Save Changes",
  lm_other: "Other",
  lm_delete_desc: "This landmark will be removed from your list. This cannot be undone.",
  lm_keep_btn: "Keep It", lm_remove_btn: "Remove",
  lm_edit_aria: "Edit landmark", lm_delete_aria: "Delete landmark",
  lm_empty_title: "No facilities added yet",
  lm_empty_sub: "Tap the map to pin nearby schools, hospitals, transport stops, and more.",
  lm_go_to_map: "Go to Map",
  lm_search_address_ph: "Search address or area…", lm_search_area_ph: "Search area…",
  lm_next_step: "Next: Add Nearby Facilities",
  lm_panel_title: "Nearby Facilities", lm_optional: "Optional",
  lm_panel_desc: "Click the map to pin a landmark. Each pin is saved globally — anyone can discover it.",
  lm_back_btn: "Back", lm_skip_btn: "Skip", lm_save_btn: "Save", lm_done_btn: "Done",
  lm_mobile_list_title: "Nearby Landmarks", lm_added_count: "{n} added",
  lm_mobile_list_hint: "Use ✏️ to edit or 🗑 to remove. Switch to Map to add more.",
  lm_toggle_list: "List ({n})", lm_toggle_map: "Map",
  lm_popup_add_title: "Add Nearby Facilities", lm_popup_edit_title: "Edit Landmark",
  lm_popup_delete_title: "Remove Landmark",
  lm_err_name_required: "Please enter a name for this landmark.",
  lm_err_save_failed: "Failed to save landmark. Please try again.",
  lm_err_update_failed: "Failed to update landmark. Please try again.",

  map_preview_tap_hint: "Tap to pick your property location",
  map_preview_change: "Change", map_preview_pick: "Pick Location",
  map_preview_no_address: "No address typed yet", map_preview_no_coords: "Coordinates not set",
  map_preview_open: "Open Map →",

  faq_title_bold: "FAQ", faq_title_light: "& Support",
  faq_subtitle: "Find answers to your questions about this app.",
  faq_visit_website: "Visit our website", faq_email_us: "Email us",
  faq_privacy: "Privacy policy", faq_terms: "Terms of service",
  faq_tab_buyer: "Buyer", faq_tab_agent: "Estate Agent",
  faq_b_q1: "What is Proptriz?",
  faq_b_a1: "Proptriz is a property listing and discovery platform that connects buyers, renters, and sellers across Africa.",
  faq_b_q2: "How do I search for properties?",
  faq_b_a2: "Use the Explore tab to browse listings by location, category, and price. You can also use the Map view to find properties near you.",
  faq_a_q1: "How do I list a property?",
  faq_a_a1: "Tap '+ List Property' from the home screen or your profile. Fill in the details or use our AI-powered form filler to get started quickly.",
  faq_a_q2: "How long does a listing stay active?",
  faq_a_a2: "Listings stay active for the duration you select (in weeks) when creating or editing them. You can extend the duration at any time from Edit Property.",

  terms_screen_title: "Terms of Service",
  terms_main_title: "Proptriz - Terms of Service",
  terms_last_updated: "Last Updated: 16/02/2026",
  terms_email_label: "Email",
  terms_s1_title: "1. Acceptance of Terms",
  terms_s1_body: "By accessing or using Proptriz, you agree to be bound by these Terms. If you do not agree, you must discontinue use immediately.",
  terms_s2_title: "2. Eligibility",
  terms_s2_body: "You must be at least 18 years old and legally capable of entering into binding agreements.",
  terms_s3_title: "3. Platform Nature",
  terms_s3_body: "Proptriz is a property listing and discovery marketplace. We do not own or manage listed properties and do not guarantee transaction outcomes.",
  terms_s4_title: "4. User Responsibilities",
  terms_s4_li1: "Provide accurate information",
  terms_s4_li2: "Only list properties you are authorized to list",
  terms_s4_li3: "Do not post fraudulent or misleading content",
  terms_s4_li4: "Do not harass or abuse other users",
  terms_s5_title: "5. Content License",
  terms_s5_body: "By posting content, you grant Proptriz a non-exclusive, royalty-free, worldwide license to use, display, and promote such content for operating the platform.",
  terms_s6_title: "6. Fees and Payments",
  terms_s6_body: "If paid features are introduced, fees will be disclosed clearly. Payments may be processed via approved third-party providers.",
  terms_s7_title: "7. Disclaimers",
  terms_s7_body: "The platform is provided \"as is\" without warranties of any kind. Proptriz is not responsible for user disputes or transaction outcomes.",
  terms_s8_title: "8. Limitation of Liability",
  terms_s8_body: "To the fullest extent permitted by law, Proptriz shall not be liable for indirect or consequential damages arising from use of the platform.",
  terms_s9_title: "9. Termination",
  terms_s9_body: "We may suspend or terminate accounts that violate these Terms. You may delete your account at any time.",
  terms_s10_title: "10. Governing Law",
  terms_s10_body: "These Terms are governed by the laws of the Federal Republic of Nigeria.",
  terms_s11_title: "11. Contact",

  privacy_screen_title: "Privacy Policy",
  privacy_main_title: "Privacy Policy",
  privacy_s1_title: "1. Introduction",
  privacy_s1_body1: "Proptriz Hub (\"Proptriz,\" \"we,\" \"our,\" or \"us\") is committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application, website, and related services.",
  privacy_s1_body2: "This Policy complies with the Nigeria Data Protection Regulation (NDPR) and international data protection standards.",
  privacy_s2_title: "2. Lawful Basis for Processing",
  privacy_s2_li1: "Consent provided by you",
  privacy_s2_li2: "Performance of a contract",
  privacy_s2_li3: "Compliance with legal obligations",
  privacy_s2_li4: "Legitimate business interests",
  privacy_s3_title: "3. Information We Collect",
  privacy_s3_h_account: "Account Information",
  privacy_s3_account_li1: "Full name", privacy_s3_account_li2: "Email address",
  privacy_s3_account_li3: "Username", privacy_s3_account_li4: "Phone/WhatsApp number",
  privacy_s3_h_listing: "Property Listing Information",
  privacy_s3_listing_li1: "Property title, category, location",
  privacy_s3_listing_li2: "Price and description",
  privacy_s3_listing_li3: "Images and media uploads",
  privacy_s3_h_tech: "Technical Information",
  privacy_s3_tech_li1: "Device type and OS",
  privacy_s3_tech_li2: "IP address",
  privacy_s3_tech_li3: "App usage analytics",
  privacy_s4_title: "4. How We Use Your Data",
  privacy_s4_li1: "Provide and manage accounts",
  privacy_s4_li2: "Enable property listings and searches",
  privacy_s4_li3: "Facilitate communication between users",
  privacy_s4_li4: "Improve platform performance",
  privacy_s4_li5: "Prevent fraud and abuse",
  privacy_s5_title: "5. Data Sharing",
  privacy_s5_intro: "We do not sell your personal data. We may share information with:",
  privacy_s5_li1: "Interested property seekers (contact details only)",
  privacy_s5_li2: "Cloud hosting and analytics providers",
  privacy_s5_li3: "Payment processors (if applicable)",
  privacy_s5_li4: "Authorities where required by law",
  privacy_s6_title: "6. Data Retention",
  privacy_s6_body: "We retain personal data only as long as necessary to fulfill legitimate business or legal purposes. Data is securely deleted or anonymized when no longer required.",
  privacy_s7_title: "7. Your Rights",
  privacy_s7_li1: "Access your personal data",
  privacy_s7_li2: "Request correction",
  privacy_s7_li3: "Request deletion",
  privacy_s7_li4: "Withdraw consent",
  privacy_s7_li5: "Lodge complaints with relevant authorities",
  privacy_s8_title: "8. Security",
  privacy_s8_body: "We implement technical and organizational safeguards including encryption, secure hosting, and access controls. However, no system is completely secure.",
  privacy_s9_title: "9. Contact Us",
};

// ─────────────────────────────────────────────────────────────────────────────
// FRENCH
// ─────────────────────────────────────────────────────────────────────────────

const fr: Translations = {
  lang_en: "English", lang_fr: "Français", lang_sw: "Kiswahili",

  lang_picker_title: "Choisir la langue", lang_picker_subtitle: "Sélectionnez votre langue préférée",
  lang_picker_save: "Enregistrer", lang_picker_cancel: "Annuler",

  nav_map: "Carte", nav_explore: "Explorer", nav_saved: "Favoris", nav_profile: "Profil",

  cat_apartment: "Appartement", cat_land: "Terrain", cat_shortlet: "Court séjour",
  cat_hotel: "Hôtel", cat_shop: "Boutique", cat_office: "Bureau", cat_others: "Autres",

  home_greeting: "Trouvez votre espace idéal", home_search_hint: "Rechercher par lieu, type…",
  home_nearby: "Propriétés à proximité", home_see_all: "Voir tout",
  home_show_less: "Afficher moins", home_no_results: "Aucune propriété trouvée",
  home_for_rent: "Location", home_for_sale: "Vente",
  home_featured: "Propriétés vedettes", home_top_agents: "Meilleurs agents",
  home_seen_all: "Vous avez tout vu", home_view_all: "Voir tout →",
  home_more: "Plus →", home_good_day: "Bonjour 👋",
  home_subtitle: "Trouvez votre prochaine maison idéale",
  home_loading: "Chargement des propriétés…",
  home_top_locations: "Meilleurs emplacements", home_all: "Tout",

  map_list_property: "＋ Ajouter un bien", map_my_location: "Ma position",
  search_bar_filter: "Filtrer", search_filter_header: "Filtrer les biens",

  filter_location: "Localisation", filter_location_ph: "Rechercher une ville, un quartier…",
  filter_searching: "Recherche en cours…", filter_prop_type: "Type de bien",
  filter_listed_for: "Proposé pour", filter_price_budget: "Budget",
  filter_per_year: "an", filter_per_total: "total", filter_any: "Tous",
  filter_no_limit: "Sans limite", filter_min_price: "Prix min", filter_max_price: "Prix max",
  filter_showing: "Affichage :", filter_keywords: "Mots-clés",
  filter_keywords_ph: "ex. meublé, clôturé, parking…",
  filter_keywords_hint: "Séparez les termes par des virgules",
  filter_reset: "Réinitialiser", filter_apply: "Appliquer",
  filter_show_results: "Voir {n} résultats",
  filter_pill: "Filtrer", filter_header: "Filtrer les biens",
  filter_all: "Tout", filter_rent: "Location", filter_sale: "Vente",

  add_title: "Ajouter un bien", add_subtitle: "Bonjour {name}, listons votre espace",
  add_ai_title: "Lister avec l'IA", add_ai_subtitle: "Décrivez votre bien — l'IA remplit le formulaire",
  add_ai_entry: "✨ Lister avec l'IA — décrivez-le, on remplit le formulaire",
  add_ai_filled: "✨ L'IA a rempli votre annonce",
  add_ai_filled_sub: "Vérifiez les détails — modifiez avant de publier.",
  add_step_basics: "Bases", add_step_details: "Détails",
  add_step_preview: "Aperçu", add_step_ai: "IA",
  add_cta_next: "Ajouter photos & détails →", add_cta_preview: "Aperçu de l'annonce →",
  add_cta_publish: "Publier le bien 🎉", add_cta_creating: "Création en cours…",
  add_cta_uploading: "Chargement photo {cur} sur {total}…", add_cta_published: "Publié ! ✨",
  add_banner_creating: "Création de votre annonce…",
  add_banner_creating_sub: "Enregistrement du titre, prix et localisation",
  add_banner_uploading: "Chargement photo {cur} sur {total}",
  add_banner_uploading_sub: "Photos optimisées et envoyées une par une",
  add_val_title: "Veuillez saisir un titre.",
  add_val_price: "Veuillez saisir un prix valide.",
  add_val_photos: "Ajoutez au moins une photo.",
  add_val_address: "Veuillez saisir l'adresse.",
  add_val_login: "Veuillez vous connecter pour lister un bien.",
  add_toast_pinned: "Emplacement épinglé",
  add_toast_listed: "Bien listé avec succès ! 🎉",
  add_toast_listed_photos: "Bien listé avec toutes les photos ! 🎉",
  add_toast_photos_warn: "{s} photo(s) chargée(s). {f} échouée(s) — ajoutez via Modifier.",
  add_toast_failed: "Échec de la création.",

  s1_prop_type: "Type de bien", s1_prop_title: "Titre du bien",
  s1_prop_title_ph: "ex. Duplex 3 chambres moderne à Lekki",
  s1_pricing: "Tarification", s1_listed_for: "Proposé pour *",
  s1_for_rent: "À louer", s1_for_sale: "À vendre",
  s1_rent_price: "Prix de location", s1_sell_price: "Prix de vente",
  s1_tenancy_period: "Durée du bail",
  s1_period_daily: "Journalier", s1_period_weekly: "Hebdomadaire",
  s1_period_monthly: "Mensuel", s1_period_yearly: "Annuel",
  s1_negotiable: "✅ Négociable", s1_fixed_price: "🔒 Prix fixe",
  s1_negotiable_sub: "Les acheteurs peuvent proposer un prix différent",
  s1_fixed_sub: "Le prix affiché est définitif",
  s1_duration: "Durée d'annonce", s1_duration_label: "Durée",
  s1_duration_suffix: "semaines", s1_location: "Localisation",
  s1_location_ph: "Adresse, quartier, ville…",

  s2_photos: "Photos du bien",
  s2_photos_sub: "Ajoutez jusqu'à 8 photos. La première devient la couverture.",
  s2_photos_tip: "Les biens avec photos reçoivent 3× plus de visites",
  s2_status: "Statut de l'annonce", s2_status_available: "Disponible",
  s2_status_rented: "Loué", s2_status_unavail: "Indisponible",
  s2_description: "Description",
  s2_description_ph: "Décrivez le bien, ses caractéristiques et son quartier…",
  s2_features: "Caractéristiques & équipements",
  s2_features_sub: "Sélectionnez des équipements ou ajoutez les vôtres.",
  s2_custom_ph: "Équipement personnalisé…", s2_add_custom: "Ajouter un équipement",

  s3_photos: "Photos", s3_photos_sub: "Image de couverture · tap pour changer",
  s3_prop_type: "Type de bien", s3_prop_title: "Titre du bien",
  s3_pricing: "Tarification", s3_description: "Description",
  s3_description_ph: "Décrivez le bien, ses caractéristiques et son quartier…",
  s3_features: "Caractéristiques",
  s3_features_sub: "Appuyez × pour supprimer une caractéristique.",
  s3_duration: "Durée d'annonce",
  s3_duration_sub: "Combien de semaines cette annonce doit-elle rester active ?",
  s3_status: "Statut de disponibilité", s3_negotiable: "Négociable",

  ai_describe: "Décrivez votre bien",
  ai_describe_sub: "Mentionnez le type, la taille, le prix, la localisation et les atouts.",
  ai_describe_ph: "ex. Duplex 3 chambres à Lekki Phase 1, Lagos. ₦4,5M/an en location…",
  ai_chars: "{n} car.", ai_chars_good: "· ✓ bon",
  ai_photos: "Photos du bien (optionnel)",
  ai_photos_sub: "Les photos sont ajoutées automatiquement. Mettez l'extérieur en premier.",
  ai_location: "Localisation (optionnel)",
  ai_location_sub: "Saisissez l'adresse ou épinglez sur la carte.",
  ai_location_ph: "Saisissez l'adresse ou la zone (optionnel)…",
  ai_tips_title: "Conseils pour de meilleurs résultats",
  ai_tip_1: "• Mentionnez le prix, le type et le nombre de pièces",
  ai_tip_2: "• Incluez le quartier ou le monument proche",
  ai_tip_3: "• Saisir une adresse donne l'épingle la plus précise",
  ai_tip_4: "• Vous pouvez modifier tous les détails avant de publier",
  ai_extract_btn: "✨ Extraire les informations", ai_extracting: "Extraction…",
  ai_how_describe: "Décrire", ai_how_photos: "Ajouter photos",
  ai_how_location: "Épingler", ai_how_extract: "Extraire ✨",
  ai_progress: "Extraction des détails — cela peut prendre 30 secondes…",
  ai_powered_by: "Propulsé par Llama 3 · généralement 15–30 secondes",
  ai_err_empty: "Veuillez décrire le bien pour que l'IA puisse travailler.",

  extr_title: "Analyse de votre bien",
  extr_subtitle: "Patientez — l'IA remplit votre formulaire…",
  extr_done_title: "Détails extraits ! ✨",
  extr_done_sub: "Vérifiez et modifiez les détails avant de publier.",
  extr_err_title: "Extraction échouée",
  extr_geocoding: "Résolution de la localisation",
  extr_geocoding_sub: "Recherche des coordonnées depuis votre adresse",
  extr_extracting: "Extraction des détails du bien",
  extr_extracting_sub: "L'IA lit votre description — généralement 15–30 s",
  extr_done: "Terminé !", extr_done_step_sub: "Les détails de votre annonce sont prêts",
  extr_complete: "Complété",
  extr_cancel: "Annuler l'extraction", extr_retry: "↺ Réessayer", extr_cancel_btn: "Annuler",

  pub_title: "Bien publié ! 🎉",
  pub_subtitle: "Votre bien est maintenant visible pour les acheteurs et locataires sur PropTriz.",
  pub_list_another: "Lister un autre bien", pub_list_another_sub: "Démarrer une nouvelle annonce",
  pub_view_listing: "Voir votre annonce", pub_view_listing_sub: "Voir l'aperçu acheteur",
  pub_go_profile: "Aller au profil", pub_go_profile_sub: "Gérer toutes vos annonces",
  pub_go_home: "Retour à l'accueil", pub_go_home_sub: "Parcourir le marché",
  pub_listed_on: "Listé sur",

  ep_title: "Modifier le profil", ep_identity: "Identité",
  ep_full_name: "Nom complet / Marque", ep_full_name_ph: "Saisissez votre nom ou marque",
  ep_account_type: "Type de compte", ep_contact: "Coordonnées",
  ep_email: "Email (optionnel)", ep_email_ph: "Saisissez votre email",
  ep_phone: "Numéro de téléphone", ep_whatsapp: "WhatsApp (optionnel)",
  ep_whatsapp_ph: "+234 080 3288 9111",
  ep_save: "✓ Enregistrer", ep_saving: "Mise à jour…",
  ep_privacy: "Vos informations ne sont visibles que par les parties avec lesquelles vous interagissez.",
  ep_photo_invalid: "Type de fichier invalide. Sélectionnez une image PNG ou JPG.",
  ep_photo_large: "Fichier trop volumineux. Taille maximale : 2 Mo.",
  ep_photo_selected: "Photo sélectionnée — enregistrez pour appliquer.",
  ep_updated: "Profil mis à jour avec succès !",
  ep_failed: "Échec de la mise à jour du profil.",
  ep_type_individual: "Particulier", ep_type_agent: "Agent", ep_type_company: "Société",
  ep_type_individual_desc: "Propriétaire particulier",
  ep_type_agent_desc: "Agent immobilier agréé",
  ep_type_company_desc: "Société immobilière",

  edt_title: "Modifier le bien", edt_loading: "Chargement du bien…",
  edt_error: "Impossible de charger le bien. Veuillez revenir en arrière et réessayer.",
  edt_go_back: "← Retour",
  edt_expired_warn: "Cette annonce a expiré. Prolongez la durée ci-dessous pour la réactiver.",
  edt_prop_type: "Type de bien", edt_prop_title_sec: "Titre du bien",
  edt_prop_title_ph: "ex. Duplex 3 chambres moderne à Lekki",
  edt_pricing: "Tarification", edt_for_rent: "À louer", edt_for_sale: "À vendre",
  edt_rent_price: "Prix de location", edt_sell_price: "Prix de vente",
  edt_tenancy_period: "Durée du bail",
  edt_negotiable: "✅ Négociable", edt_fixed_price: "🔒 Prix fixe",
  edt_negotiable_sub: "Les acheteurs peuvent proposer un prix différent",
  edt_fixed_sub: "Le prix affiché est définitif",
  edt_duration: "Durée d'annonce",
  edt_duration_warn: "Augmentez la durée pour prolonger la période active de votre annonce.",
  edt_status: "Statut de disponibilité", edt_location: "Localisation",
  edt_location_ph: "Adresse, quartier, ville…",
  edt_map_hint: "📌 Mettez à jour l'épingle si la localisation de votre bien a changé.",
  edt_description: "Description",
  edt_description_ph: "Décrivez le bien, ses caractéristiques et son quartier…",
  edt_features: "Environnement & équipements",
  edt_custom_ph: "Nom de l'équipement personnalisé…", edt_add_custom: "Ajouter un équipement",
  edt_photos: "Photos du bien",
  edt_photos_note: "Les photos s'enregistrent instantanément — indépendamment du bouton Enregistrer. Chaque photo est auto-optimisée.",
  edt_save: "✓ Enregistrer", edt_saving: "Enregistrement…",
  edt_login_save: "🔒 Connectez-vous sur Pi Browser pour enregistrer",
  edt_danger_desc: "Supprimer définitivement cette annonce et toutes ses données.",
  edt_delete_btn: "🗑️ Supprimer l'annonce",
  edt_delete_title: "Supprimer cette annonce ?",
  edt_delete_desc: "sera définitivement supprimé. Cette action est irréversible.",
  edt_delete_confirm: "Oui, supprimer", edt_delete_loading: "Suppression…",
  edt_updated: "Bien mis à jour ! ✅",
  edt_failed: "Une erreur inattendue s'est produite.",
  edt_deleted: "Annonce supprimée.", edt_not_found: "Bien introuvable.",
  edt_val_title: "Veuillez saisir un titre.",
  edt_val_price: "Veuillez saisir un prix valide.",
  edt_val_address: "Veuillez saisir l'adresse.",

  rev_add_placeholder: "Partagez votre expérience avec ce bien…",
  rev_add_submit: "Soumettre l'avis", rev_add_submitting: "Envoi en cours…",
  rev_add_photo: "Ajouter une photo",
  rev_add_login: "Vous devez être connecté pour soumettre un avis.",
  rev_add_own: "Vous ne pouvez pas noter votre propre bien.",
  rev_add_failed: "Échec de la soumission. Réessayez.",
  rev_add_success: "Avis soumis avec succès !",
  rev_add_photo_invalid: "Type de fichier invalide. Sélectionnez PNG ou JPG.",
  rev_add_photo_large: "Fichier trop volumineux. Maximum 2 Mo.",
  rev_add_photo_added: "Photo ajoutée à l'avis.",
  rev_reply_placeholder: "Écrivez votre réponse…",
  rev_reply_send: "Envoyer", rev_reply_failed: "Échec de l'envoi.",
  rev_reply_success: "Réponse envoyée !", rev_reply_error: "Une erreur est survenue.",
  rev_replies_header: "Réponses", rev_write_header: "Écrire un avis",
  rev_owner: "Propriétaire",

  splash_checking: "Vérification de la session…", splash_sdk: "Chargement du SDK Pi…",
  splash_pi_auth: "Authentification avec Pi…", splash_verifying: "Vérification de l'identité…",
  splash_signed_in: "Connecté ! Redirection…", splash_timeout: "Délai de connexion dépassé",
  splash_failed: "Connexion échouée — réessayez",
  splash_pi_required: "Requis : Pi Browser",
  splash_pi_desc: "Pour utiliser votre Pi Wallet, vous devez naviguer dans l'application Pi Browser.",
  splash_pi_btn: "Continuer avec Pi Network",
  splash_pi_connecting: "Connexion à Pi…",
  splash_help: "Obtenir de l'aide", splash_trouble: "Problème de connexion ?",
  splash_or: "ou",

  profile_listings: "Annonces", profile_received: "Reçus", profile_sent: "Envoyés",
  profile_properties: "Biens", profile_rating: "Note", profile_reviews: "Avis",
  profile_add_property: "+ Ajouter un bien",
  profile_no_listings: "Aucune annonce", profile_no_listings_sub: "Ajoutez votre premier bien pour commencer",
  profile_list_property: "+ Lister un bien",
  profile_no_received: "Aucun avis reçu", profile_no_received_sub: "Les avis des locataires apparaîtront ici",
  profile_no_sent: "Aucun avis envoyé", profile_no_sent_sub: "Vos avis apparaîtront ici",
  profile_seen_all: "Vous avez vu toutes vos annonces", profile_no_more: "Plus d'avis",
  profile_manage_account: "Gérer le compte", profile_top_agent: "Meilleur agent #1",
  profile_delete_title: "Supprimer cette annonce ?",
  profile_delete_desc: "Ce bien sera définitivement supprimé. Cette action est irréversible.",
  profile_delete_confirm: "Oui, supprimer", profile_delete_loading: "Suppression…",
  profile_delete_success: "Bien supprimé avec succès", profile_delete_fail: "Échec de la suppression",
  profile_reply_review: "Répondre à l'avis",

  menu_my_profile: "Mon profil", menu_edit_profile: "Modifier le profil",
  menu_list_property: "Ajouter un bien", menu_become_agent: "Devenir agent",
  menu_privacy: "Politique de confidentialité", menu_terms: "Conditions d'utilisation",
  menu_faq: "FAQ", menu_language: "Langue",

  detail_loading: "Chargement du bien…", detail_error: "Impossible de charger le bien",
  detail_go_back: "Retour", detail_updated: "Mis à jour",
  detail_available: "✅ Disponible", detail_unavailable: "❌ Indisponible",
  detail_description: "Description", detail_view_map: "Voir la carte complète",
  detail_reviews: "Avis", detail_add_review: "+ Ajouter un avis",
  detail_add_review_hd: "Ajouter un avis", detail_all_reviews: "Voir les {n} avis →",
  detail_nearby: "Biens à proximité", detail_wishlist: "Sauvegarder",
  detail_review_single: "avis", detail_review_plural: "avis",

  cur_ngn: "Naira nigérian (₦)", cur_usd: "Dollar américain ($)",
  cur_kes: "Shilling kényan (KSh)", cur_cfa: "Franc CFA (FCFA)",
  cur_cda: "CDA", cur_pi: "Pi Network (Pi)",

  list_for_rent: "À louer", list_for_sale: "À vendre",

  status_available: "Disponible", status_sold: "Vendu",
  status_rented: "Loué", status_unavailable: "Indisponible",
  status_expired: "Expiré",

  neg_negotiable: "Négociable", neg_fixed: "Prix fixe",
  map_view: "Voir", map_negotiable: "Négociable",

  agent_owner: "Propriétaire", agent_agent: "Agent immobilier",
  agent_company: "Agence immobilière",
  agent_call: "Appeler", agent_email: "E-mail",
  agent_whatsapp: "WhatsApp", agent_chat: "Chat",

  s3_sum_header: "Résumé de l'annonce",
  s3_sum_title: "Titre", s3_sum_category: "Catégorie",
  s3_sum_price: "Prix", s3_sum_listed_for: "Proposé pour",
  s3_sum_period: "Période", s3_sum_status: "Statut",
  s3_sum_duration: "Durée", s3_sum_weeks: "{n} semaines",
  s3_sum_negotiable: "Négociable",
  s3_sum_yes: "✅ Oui", s3_sum_no: "🔒 Non",
  s3_sum_features: "Caractéristiques", s3_sum_description: "Description",
  s3_location: "Localisation",

  common_save: "Enregistrer", common_cancel: "Annuler", common_close: "Fermer",
  common_loading: "Chargement…", common_error: "Une erreur est survenue",
  common_retry: "Réessayer", common_per_year: "/an",
  common_per_month: "/mois", common_per_night: "/nuit",

  map_snap_expand: "Agrandir ↑", map_snap_more: "Voir plus ↑", map_snap_collapse: "Réduire ↓",
  map_centre_btn: "Centrer sur le bien", map_resize_panel: "Redimensionner",
  map_tab_facilities: "Équipements proches", map_tab_details: "Détails du bien",
  map_no_facilities: "Aucun équipement à proximité",
  map_no_facilities_sub: "Aucun équipement n'a été ajouté dans un rayon de 2 km.",
  map_landmark_fallback: "Point d'intérêt", map_nearby_label: "proche",
  map_verified_title: "Lieu vérifié par la communauté", map_confirm_title: "Confirmer ce point d'intérêt",
  map_verified_btn: "Vérifié", map_confirm_btn: "Confirmer",
  map_road_access: "Accès routier & environnement", map_prop_features: "Caractéristiques du bien",
  map_full_address: "Adresse complète", map_gps: "Coordonnées GPS",
  map_open_google: "Ouvrir dans Google Maps",

  img_upload_title: "Télécharger des photos du bien", img_add_photo: "Ajouter une photo",
  img_removed: "Photo supprimée", img_remove_failed: "Impossible de supprimer la photo",
  img_upload_success: "Photo téléchargée avec succès", img_upload_failed: "Échec du téléchargement",

  lm_step_location: "Localisation", lm_step_facilities: "Équipements",
  lm_new_pin: "Nouvelle épingle", lm_pinned_location: "Emplacement épinglé",
  lm_already_tagged: "Déjà référencé à proximité",
  lm_duplicate_hint: "💡 Vérifiez la liste avant d'ajouter — vous taggez peut-être le même endroit.",
  lm_name_label: "Nom du point d'intérêt", lm_name_ph: "ex. Ikeja City Mall, Hôpital général…",
  lm_category_label: "Catégorie", lm_saving: "Enregistrement…",
  lm_add_btn: "Ajouter des équipements", lm_save_changes: "Enregistrer",
  lm_other: "Autre",
  lm_delete_desc: "Ce point d'intérêt sera supprimé de votre liste. Cette action est irréversible.",
  lm_keep_btn: "Conserver", lm_remove_btn: "Supprimer",
  lm_edit_aria: "Modifier le point d'intérêt", lm_delete_aria: "Supprimer le point d'intérêt",
  lm_empty_title: "Aucun équipement ajouté",
  lm_empty_sub: "Appuyez sur la carte pour épingler des écoles, hôpitaux, arrêts de transport, etc.",
  lm_go_to_map: "Aller à la carte",
  lm_search_address_ph: "Rechercher une adresse ou un quartier…", lm_search_area_ph: "Rechercher une zone…",
  lm_next_step: "Suivant : Ajouter des équipements",
  lm_panel_title: "Équipements proches", lm_optional: "Optionnel",
  lm_panel_desc: "Cliquez sur la carte pour épingler un point d'intérêt. Chaque épingle est partagée globalement.",
  lm_back_btn: "Retour", lm_skip_btn: "Passer", lm_save_btn: "Sauvegarder", lm_done_btn: "Terminer",
  lm_mobile_list_title: "Points d'intérêt proches", lm_added_count: "{n} ajouté(s)",
  lm_mobile_list_hint: "Utilisez ✏️ pour modifier ou 🗑 pour supprimer. Revenez à la carte pour en ajouter.",
  lm_toggle_list: "Liste ({n})", lm_toggle_map: "Carte",
  lm_popup_add_title: "Ajouter des équipements", lm_popup_edit_title: "Modifier le point d'intérêt",
  lm_popup_delete_title: "Supprimer le point d'intérêt",
  lm_err_name_required: "Veuillez saisir un nom pour ce point d'intérêt.",
  lm_err_save_failed: "Échec de l'enregistrement. Veuillez réessayer.",
  lm_err_update_failed: "Échec de la mise à jour. Veuillez réessayer.",

  map_preview_tap_hint: "Appuyez pour choisir l'emplacement",
  map_preview_change: "Modifier", map_preview_pick: "Choisir un emplacement",
  map_preview_no_address: "Aucune adresse saisie", map_preview_no_coords: "Coordonnées non définies",
  map_preview_open: "Ouvrir la carte →",

  faq_title_bold: "FAQ", faq_title_light: "& Assistance",
  faq_subtitle: "Trouvez des réponses à vos questions sur cette application.",
  faq_visit_website: "Visiter notre site web", faq_email_us: "Nous envoyer un e-mail",
  faq_privacy: "Politique de confidentialité", faq_terms: "Conditions d'utilisation",
  faq_tab_buyer: "Acheteur", faq_tab_agent: "Agent immobilier",
  faq_b_q1: "Qu'est-ce que Proptriz ?",
  faq_b_a1: "Proptriz est une plateforme de référencement et de découverte de biens immobiliers qui met en relation acheteurs, locataires et vendeurs à travers l'Afrique.",
  faq_b_q2: "Comment rechercher des biens ?",
  faq_b_a2: "Utilisez l'onglet Explorer pour parcourir les annonces par lieu, catégorie et prix. Vous pouvez aussi utiliser la vue Carte pour trouver des biens près de vous.",
  faq_a_q1: "Comment lister un bien ?",
  faq_a_a1: "Appuyez sur '+ Lister un bien' depuis l'accueil ou votre profil. Remplissez les détails ou utilisez notre formulaire assisté par IA pour démarrer rapidement.",
  faq_a_q2: "Combien de temps reste active une annonce ?",
  faq_a_a2: "Les annonces restent actives pendant la durée choisie (en semaines) lors de leur création ou modification. Vous pouvez prolonger la durée à tout moment via Modifier le bien.",

  terms_screen_title: "Conditions d'utilisation",
  terms_main_title: "Proptriz - Conditions d'utilisation",
  terms_last_updated: "Dernière mise à jour : 16/02/2026",
  terms_email_label: "E-mail",
  terms_s1_title: "1. Acceptation des conditions",
  terms_s1_body: "En accédant ou en utilisant Proptriz, vous acceptez d'être lié par ces conditions. Si vous n'êtes pas d'accord, vous devez cesser immédiatement toute utilisation.",
  terms_s2_title: "2. Éligibilité",
  terms_s2_body: "Vous devez avoir au moins 18 ans et être légalement capable de conclure des accords contraignants.",
  terms_s3_title: "3. Nature de la plateforme",
  terms_s3_body: "Proptriz est une place de marché de référencement et de découverte de biens immobiliers. Nous ne possédons pas les biens listés et ne garantissons pas les résultats des transactions.",
  terms_s4_title: "4. Responsabilités de l'utilisateur",
  terms_s4_li1: "Fournir des informations exactes",
  terms_s4_li2: "Lister uniquement les biens que vous êtes autorisé à lister",
  terms_s4_li3: "Ne pas publier de contenu frauduleux ou trompeur",
  terms_s4_li4: "Ne pas harceler ou abuser d'autres utilisateurs",
  terms_s5_title: "5. Licence de contenu",
  terms_s5_body: "En publiant du contenu, vous accordez à Proptriz une licence non exclusive, sans redevance, mondiale pour utiliser, afficher et promouvoir ce contenu dans le cadre de l'exploitation de la plateforme.",
  terms_s6_title: "6. Frais et paiements",
  terms_s6_body: "Si des fonctionnalités payantes sont introduites, les frais seront clairement communiqués. Les paiements peuvent être traités via des prestataires tiers approuvés.",
  terms_s7_title: "7. Avertissements",
  terms_s7_body: "La plateforme est fournie « telle quelle » sans garantie d'aucune sorte. Proptriz n'est pas responsable des litiges entre utilisateurs ni des résultats des transactions.",
  terms_s8_title: "8. Limitation de responsabilité",
  terms_s8_body: "Dans toute la mesure permise par la loi, Proptriz ne sera pas responsable des dommages indirects ou consécutifs découlant de l'utilisation de la plateforme.",
  terms_s9_title: "9. Résiliation",
  terms_s9_body: "Nous pouvons suspendre ou résilier les comptes qui violent ces conditions. Vous pouvez supprimer votre compte à tout moment.",
  terms_s10_title: "10. Droit applicable",
  terms_s10_body: "Ces conditions sont régies par les lois de la République fédérale du Nigeria.",
  terms_s11_title: "11. Contact",

  privacy_screen_title: "Politique de confidentialité",
  privacy_main_title: "Politique de confidentialité",
  privacy_s1_title: "1. Introduction",
  privacy_s1_body1: "Proptriz Hub (« Proptriz », « nous », « notre » ou « nos ») s'engage à protéger vos données personnelles. Cette politique explique comment nous collectons, utilisons, divulguons et protégeons vos informations lorsque vous utilisez notre application mobile, notre site web et nos services associés.",
  privacy_s1_body2: "Cette politique est conforme au Règlement nigérian sur la protection des données (NDPR) et aux normes internationales de protection des données.",
  privacy_s2_title: "2. Base légale du traitement",
  privacy_s2_li1: "Consentement fourni par vous",
  privacy_s2_li2: "Exécution d'un contrat",
  privacy_s2_li3: "Respect des obligations légales",
  privacy_s2_li4: "Intérêts commerciaux légitimes",
  privacy_s3_title: "3. Informations que nous collectons",
  privacy_s3_h_account: "Informations de compte",
  privacy_s3_account_li1: "Nom complet", privacy_s3_account_li2: "Adresse e-mail",
  privacy_s3_account_li3: "Nom d'utilisateur", privacy_s3_account_li4: "Numéro de téléphone/WhatsApp",
  privacy_s3_h_listing: "Informations sur les annonces",
  privacy_s3_listing_li1: "Titre, catégorie, localisation du bien",
  privacy_s3_listing_li2: "Prix et description",
  privacy_s3_listing_li3: "Images et fichiers multimédias",
  privacy_s3_h_tech: "Informations techniques",
  privacy_s3_tech_li1: "Type d'appareil et système d'exploitation",
  privacy_s3_tech_li2: "Adresse IP",
  privacy_s3_tech_li3: "Statistiques d'utilisation de l'application",
  privacy_s4_title: "4. Utilisation de vos données",
  privacy_s4_li1: "Fournir et gérer les comptes",
  privacy_s4_li2: "Permettre les annonces et les recherches de biens",
  privacy_s4_li3: "Faciliter la communication entre utilisateurs",
  privacy_s4_li4: "Améliorer les performances de la plateforme",
  privacy_s4_li5: "Prévenir la fraude et les abus",
  privacy_s5_title: "5. Partage des données",
  privacy_s5_intro: "Nous ne vendons pas vos données personnelles. Nous pouvons partager des informations avec :",
  privacy_s5_li1: "Les chercheurs de biens intéressés (coordonnées uniquement)",
  privacy_s5_li2: "Les prestataires d'hébergement cloud et d'analyse",
  privacy_s5_li3: "Les processeurs de paiement (le cas échéant)",
  privacy_s5_li4: "Les autorités lorsque la loi l'exige",
  privacy_s6_title: "6. Conservation des données",
  privacy_s6_body: "Nous conservons les données personnelles uniquement le temps nécessaire pour répondre à des fins commerciales ou légales légitimes. Les données sont supprimées de façon sécurisée ou anonymisées lorsqu'elles ne sont plus nécessaires.",
  privacy_s7_title: "7. Vos droits",
  privacy_s7_li1: "Accéder à vos données personnelles",
  privacy_s7_li2: "Demander une correction",
  privacy_s7_li3: "Demander la suppression",
  privacy_s7_li4: "Retirer votre consentement",
  privacy_s7_li5: "Déposer des plaintes auprès des autorités compétentes",
  privacy_s8_title: "8. Sécurité",
  privacy_s8_body: "Nous mettons en œuvre des mesures techniques et organisationnelles incluant le chiffrement, l'hébergement sécurisé et les contrôles d'accès. Cependant, aucun système n'est totalement sécurisé.",
  privacy_s9_title: "9. Nous contacter",
};

// ─────────────────────────────────────────────────────────────────────────────
// SWAHILI
// ─────────────────────────────────────────────────────────────────────────────

const sw: Translations = {
  lang_en: "English", lang_fr: "Français", lang_sw: "Kiswahili",

  lang_picker_title: "Chagua Lugha", lang_picker_subtitle: "Chagua lugha unayopendelea",
  lang_picker_save: "Hifadhi", lang_picker_cancel: "Ghairi",

  nav_map: "Ramani", nav_explore: "Gundua", nav_saved: "Zilizohifadhiwa", nav_profile: "Wasifu",

  cat_apartment: "Ghorofa", cat_land: "Ardhi", cat_shortlet: "Likizo",
  cat_hotel: "Hoteli", cat_shop: "Duka", cat_office: "Ofisi", cat_others: "Zingine",

  home_greeting: "Pata nafasi yako bora", home_search_hint: "Tafuta kwa eneo, aina…",
  home_nearby: "Mali za karibu", home_see_all: "Tazama Zote",
  home_show_less: "Onyesha Chini", home_no_results: "Hakuna mali iliyopatikana",
  home_for_rent: "Kukodi", home_for_sale: "Kuuza",
  home_featured: "Mali Zilizoangaziwa", home_top_agents: "Mawakala Bora",
  home_seen_all: "Umesoma mali zote", home_view_all: "Tazama zote →",
  home_more: "Zaidi →", home_good_day: "Habari 👋",
  home_subtitle: "Tafuta nyumba yako bora",
  home_loading: "Inapakia mali…", home_top_locations: "Maeneo Bora", home_all: "Zote",

  map_list_property: "＋ Ongeza Mali", map_my_location: "Mahali pangu",
  search_bar_filter: "Chuja", search_filter_header: "Chuja Mali",

  filter_location: "Mahali", filter_location_ph: "Tafuta mji, eneo…",
  filter_searching: "Inatafuta…", filter_prop_type: "Aina ya Mali",
  filter_listed_for: "Imeorodheshwa kwa", filter_price_budget: "Bajeti ya Bei",
  filter_per_year: "mwaka", filter_per_total: "jumla", filter_any: "Yote",
  filter_no_limit: "Hakuna kikomo", filter_min_price: "Bei ya Chini", filter_max_price: "Bei ya Juu",
  filter_showing: "Inaonyesha:", filter_keywords: "Maneno Muhimu",
  filter_keywords_ph: "mf. na samani, imefungwa, maegesho…",
  filter_keywords_hint: "Tenganisha maneno kwa mkato bora",
  filter_reset: "Weka upya", filter_apply: "Tumia Vichujio",
  filter_show_results: "Onyesha matokeo {n}",
  filter_pill: "Chuja", filter_header: "Chuja Mali",
  filter_all: "Zote", filter_rent: "Kukodi", filter_sale: "Kuuza",

  add_title: "Ongeza Mali", add_subtitle: "Habari {name}, orodhesha nafasi yako",
  add_ai_title: "Orodhesha na AI", add_ai_subtitle: "Elezea mali yako — AI inajaza fomu",
  add_ai_entry: "✨ Orodhesha na AI — elezea, tunajaza fomu",
  add_ai_filled: "✨ AI imejaza orodha yako",
  add_ai_filled_sub: "Angalia maelezo — hariri chochote kabla ya kuchapisha.",
  add_step_basics: "Misingi", add_step_details: "Maelezo",
  add_step_preview: "Hakikisho", add_step_ai: "AI",
  add_cta_next: "Ongeza Picha & Maelezo →", add_cta_preview: "Angalia Orodha →",
  add_cta_publish: "Chapisha Mali 🎉", add_cta_creating: "Inaunda orodha…",
  add_cta_uploading: "Inapakia picha {cur} ya {total}…", add_cta_published: "Imechapishwa! ✨",
  add_banner_creating: "Inaunda orodha yako…",
  add_banner_creating_sub: "Inahifadhi kichwa, bei na eneo — hii ni ya haraka",
  add_banner_uploading: "Inapakia picha {cur} ya {total}",
  add_banner_uploading_sub: "Picha zimesagwa na kutumwa moja moja kwa uaminifu",
  add_val_title: "Tafadhali ingiza kichwa cha mali.",
  add_val_price: "Tafadhali ingiza bei halali.",
  add_val_address: "Tafadhali ingiza anwani ya mali.",
  add_val_photos: "Tafadhali ongeza picha angalau moja.",
  add_val_login: "Tafadhali ingia ili kuorodhesha mali.",
  add_toast_pinned: "Mahali pamepigwa pini",
  add_toast_listed: "Mali imeorodheshwa! 🎉",
  add_toast_listed_photos: "Mali imeorodheshwa na picha zote! 🎉",
  add_toast_photos_warn: "Picha {s} zimepakiwa. {f} zimeshindwa — ongeza kupitia Hariri.",
  add_toast_failed: "Kuunda mali kumeshindwa.",

  s1_prop_type: "Aina ya Mali", s1_prop_title: "Kichwa cha Mali",
  s1_prop_title_ph: "mf. Duplex 3 Chumba Kisasa Lekki",
  s1_pricing: "Bei", s1_listed_for: "Imeorodheshwa kwa *",
  s1_for_rent: "Kukodi", s1_for_sale: "Kuuza",
  s1_rent_price: "Bei ya Kukodi", s1_sell_price: "Bei ya Kuuza",
  s1_tenancy_period: "Muda wa Kukaa",
  s1_period_daily: "Kila Siku", s1_period_weekly: "Kila Wiki",
  s1_period_monthly: "Kila Mwezi", s1_period_yearly: "Kila Mwaka",
  s1_negotiable: "✅ Inaweza Kujadiliwa", s1_fixed_price: "🔒 Bei ya Mwisho",
  s1_negotiable_sub: "Wanunuzi wanaweza kupendekeza bei tofauti",
  s1_fixed_sub: "Bei iliyoorodheshwa ni ya mwisho",
  s1_duration: "Muda wa Orodha", s1_duration_label: "Muda",
  s1_duration_suffix: "wiki", s1_location: "Mahali pa Mali",
  s1_location_ph: "Anwani, mtaa, mji…",

  s2_photos: "Picha za Mali",
  s2_photos_sub: "Ongeza hadi picha 8. Ya kwanza inakuwa picha ya jalada.",
  s2_photos_tip: "Mali zenye picha zinapata maoni 3× zaidi",
  s2_status: "Hali ya Orodha", s2_status_available: "Inapatikana",
  s2_status_rented: "Imekodishwa", s2_status_unavail: "Haipatikani",
  s2_description: "Maelezo",
  s2_description_ph: "Elezea mali, vipengele vyake na mtaa…",
  s2_features: "Vipengele & Vifaa",
  s2_features_sub: "Chagua vifaa vya kawaida au ongeza vyako.",
  s2_custom_ph: "Kipengele au kifaa cha kipekee…", s2_add_custom: "Ongeza Kipengele Kipekee",

  s3_photos: "Picha", s3_photos_sub: "Picha ya jalada · gusa kubadilisha",
  s3_prop_type: "Aina ya Mali", s3_prop_title: "Kichwa cha Mali",
  s3_pricing: "Bei", s3_description: "Maelezo",
  s3_description_ph: "Elezea mali, vipengele vyake na mtaa…",
  s3_features: "Vipengele", s3_features_sub: "Gusa × kuondoa kipengele kisichohusika.",
  s3_duration: "Muda wa Orodha",
  s3_duration_sub: "Wiki ngapi orodha hii ibaki hai kabla ya kuisha muda?",
  s3_status: "Hali ya Upatikanaji", s3_negotiable: "Inaweza Kujadiliwa",

  ai_describe: "Elezea Mali Yako",
  ai_describe_sub: "Taja aina, ukubwa, bei, eneo na vipengele. Maelezo zaidi, matokeo bora zaidi.",
  ai_describe_ph: "mf. Duplex chumba 3 Lekki Phase 1, Lagos. ₦4.5M/mwaka kukodi…",
  ai_chars: "herufi {n}", ai_chars_good: "· ✓ nzuri",
  ai_photos: "Picha za Mali (Hiari)",
  ai_photos_sub: "Picha zinahamia kwenye orodha yako. Pakia nje kwanza — inakuwa jalada.",
  ai_location: "Mahali pa Mali (Hiari)",
  ai_location_sub: "Andika anwani au pigisha pini kwenye ramani.",
  ai_location_ph: "Andika anwani au eneo (hiari)…",
  ai_tips_title: "Vidokezo vya matokeo bora",
  ai_tip_1: "• Taja bei, aina ya mali na idadi ya vyumba",
  ai_tip_2: "• Jumuisha mtaa au alama ya karibu",
  ai_tip_3: "• Kuandika anwani hutoa pini sahihi zaidi",
  ai_tip_4: "• Unaweza kuhariri maelezo yote kabla ya kuchapisha",
  ai_extract_btn: "✨ Toa Taarifa", ai_extracting: "Inatoa…",
  ai_how_describe: "Elezea", ai_how_photos: "Ongeza picha",
  ai_how_location: "Pigisha pini", ai_how_extract: "Toa ✨",
  ai_progress: "Inatoa maelezo ya mali — inaweza kuchukua sekunde 30…",
  ai_powered_by: "Inayoendeshwa na Llama 3 · kawaida sekunde 15–30",
  ai_err_empty: "Tafadhali elezea mali ili AI iweze kufanya kazi.",

  extr_title: "Inachunguza Mali Yako",
  extr_subtitle: "Subiri — AI inajaza fomu yako ya orodha…",
  extr_done_title: "Maelezo Yametolewa! ✨",
  extr_done_sub: "Angalia na uhariri maelezo kabla ya kuchapisha.",
  extr_err_title: "Kutoa Kumeshindwa",
  extr_geocoding: "Inatafuta mahali",
  extr_geocoding_sub: "Inatafuta kuratibu kutoka kwa anwani yako",
  extr_extracting: "Inatoa maelezo ya mali",
  extr_extracting_sub: "AI inasoma maelezo yako — kawaida sekunde 15–30",
  extr_done: "Imekamilika!", extr_done_step_sub: "Maelezo ya orodha yako yako tayari",
  extr_complete: "Imekamilika",
  extr_cancel: "Ghairi kutoa", extr_retry: "↺ Jaribu Tena", extr_cancel_btn: "Ghairi",

  pub_title: "Mali Imechapishwa! 🎉",
  pub_subtitle: "Mali yako sasa inaonekana kwa wanunuzi na wapangaji kwenye PropTriz.",
  pub_list_another: "Orodhesha Mali Nyingine", pub_list_another_sub: "Anza orodha mpya",
  pub_view_listing: "Tazama Orodha Yako", pub_view_listing_sub: "Angalia jinsi inavyoonekana",
  pub_go_profile: "Nenda Kwenye Wasifu", pub_go_profile_sub: "Simamia orodha zako zote",
  pub_go_home: "Rudi Nyumbani", pub_go_home_sub: "Vinjari soko",
  pub_listed_on: "Imeorodheshwa kwenye",

  ep_title: "Hariri Wasifu", ep_identity: "Utambulisho",
  ep_full_name: "Jina Kamili / Chapa", ep_full_name_ph: "Ingiza jina lako au chapa",
  ep_account_type: "Aina ya Akaunti", ep_contact: "Mawasiliano",
  ep_email: "Barua pepe (hiari)", ep_email_ph: "Ingiza barua pepe yako",
  ep_phone: "Nambari ya Simu", ep_whatsapp: "WhatsApp (hiari)",
  ep_whatsapp_ph: "+234 080 3288 9111",
  ep_save: "✓ Hifadhi Mabadiliko", ep_saving: "Inasasisha…",
  ep_privacy: "Taarifa zako zinaonekana tu kwa pande unazoshirikiana nazo.",
  ep_photo_invalid: "Aina ya faili si sahihi. Chagua picha ya PNG au JPG.",
  ep_photo_large: "Faili kubwa sana. Ukubwa wa juu ni 2 MB.",
  ep_photo_selected: "Picha imechaguliwa — hifadhi ili kutumia.",
  ep_updated: "Wasifu umesasishwa!", ep_failed: "Kusasisha kumeshindwa.",
  ep_type_individual: "Mtu Binafsi", ep_type_agent: "Wakala", ep_type_company: "Kampuni",
  ep_type_individual_desc: "Mmiliki wa mali binafsi",
  ep_type_agent_desc: "Wakala wa mali aliyeidhinishwa",
  ep_type_company_desc: "Kampuni ya mali isiyohamia",

  edt_title: "Hariri Mali", edt_loading: "Inapakia mali…",
  edt_error: "Imeshindwa kupakia mali. Rudi nyuma na ujaribu tena.",
  edt_go_back: "← Rudi",
  edt_expired_warn: "Orodha hii imeisha muda. Ongeza muda hapa chini ili kuiamsha tena.",
  edt_prop_type: "Aina ya Mali", edt_prop_title_sec: "Kichwa cha Mali",
  edt_prop_title_ph: "mf. Duplex 3 Chumba Kisasa Lekki",
  edt_pricing: "Bei", edt_for_rent: "Kukodi", edt_for_sale: "Kuuza",
  edt_rent_price: "Bei ya Kukodi", edt_sell_price: "Bei ya Kuuza",
  edt_tenancy_period: "Muda wa Kukaa",
  edt_negotiable: "✅ Inaweza Kujadiliwa", edt_fixed_price: "🔒 Bei ya Mwisho",
  edt_negotiable_sub: "Wanunuzi wanaweza kupendekeza bei tofauti",
  edt_fixed_sub: "Bei iliyoorodheshwa ni ya mwisho",
  edt_duration: "Muda wa Orodha",
  edt_duration_warn: "Ongeza muda ili kupanua kipindi cha orodha yako.",
  edt_status: "Hali ya Upatikanaji", edt_location: "Mahali pa Mali",
  edt_location_ph: "Anwani, mtaa, mji…",
  edt_map_hint: "📌 Sasisha pini ikiwa mahali pa mali yako pamebadilika.",
  edt_description: "Maelezo",
  edt_description_ph: "Elezea mali, vipengele vyake na mtaa…",
  edt_features: "Mazingira & Vifaa",
  edt_custom_ph: "Jina la kipengele kipekee…", edt_add_custom: "Ongeza Kipengele Kipekee",
  edt_photos: "Picha za Mali",
  edt_photos_note: "Picha zinahifadhiwa mara moja — bila kutegemea kitufe cha Hifadhi. Kila picha inaboreshwa kiotomatiki.",
  edt_save: "✓ Hifadhi Mabadiliko", edt_saving: "Inahifadhi…",
  edt_login_save: "🔒 Ingia kwenye Pi Browser kuhifadhi",
  edt_danger_desc: "Futa orodha hii na data yake yote daima.",
  edt_delete_btn: "🗑️ Futa Orodha",
  edt_delete_title: "Futa orodha hii?",
  edt_delete_desc: "itafutwa kabisa. Kitendo hiki hakiwezi kutenduliwa.",
  edt_delete_confirm: "Ndiyo, Futa", edt_delete_loading: "Inafuta…",
  edt_updated: "Maelezo ya mali yamesasishwa! ✅",
  edt_failed: "Hitilafu isiyotarajiwa imetokea.",
  edt_deleted: "Orodha imefutwa.", edt_not_found: "Mali haikupatikana.",
  edt_val_title: "Tafadhali ingiza kichwa cha mali.",
  edt_val_price: "Tafadhali ingiza bei halali.",
  edt_val_address: "Tafadhali ingiza anwani.",

  rev_add_placeholder: "Shiriki uzoefu wako na mali hii…",
  rev_add_submit: "Wasilisha Maoni", rev_add_submitting: "Inatuma…",
  rev_add_photo: "Ongeza Picha",
  rev_add_login: "Lazima uwe umeingia kutuma maoni.",
  rev_add_own: "Huwezi kutathmini mali yako mwenyewe.",
  rev_add_failed: "Kutuma maoni kumeshindwa. Jaribu tena.",
  rev_add_success: "Maoni yametumwa!",
  rev_add_photo_invalid: "Aina ya faili si sahihi. Chagua PNG au JPG.",
  rev_add_photo_large: "Faili kubwa sana. Kikomo ni 2 MB.",
  rev_add_photo_added: "Picha imeongezwa kwenye maoni.",
  rev_reply_placeholder: "Andika jibu lako…",
  rev_reply_send: "Tuma", rev_reply_failed: "Kutuma jibu kumeshindwa.",
  rev_reply_success: "Jibu limetumwa!", rev_reply_error: "Kitu kilienda vibaya.",
  rev_replies_header: "Majibu", rev_write_header: "Andika Maoni",
  rev_owner: "Mmiliki",

  splash_checking: "Inakagua kipindi…", splash_sdk: "Inapakia Pi SDK…",
  splash_pi_auth: "Inathibitisha na Pi…", splash_verifying: "Inathibitisha utambulisho…",
  splash_signed_in: "Umeingia! Inaelekeza…", splash_timeout: "Muda wa muunganisho umeisha",
  splash_failed: "Kuingia kumeshindwa — jaribu tena",
  splash_pi_required: "Inahitajika: Pi Browser",
  splash_pi_desc: "Kutumia Pi Wallet yako, lazima uvinjari ndani ya programu ya Pi Browser.",
  splash_pi_btn: "Endelea na Pi Network",
  splash_pi_connecting: "Inaunganika na Pi…",
  splash_help: "Pata Msaada", splash_trouble: "Tatizo la kuingia?",
  splash_or: "au",

  profile_listings: "Orodha", profile_received: "Zilizopokelewa", profile_sent: "Zilizotumwa",
  profile_properties: "Mali", profile_rating: "Ukadiriaji", profile_reviews: "Maoni",
  profile_add_property: "+ Ongeza Mali",
  profile_no_listings: "Hakuna orodha bado",
  profile_no_listings_sub: "Ongeza mali yako ya kwanza kuanza",
  profile_list_property: "+ Orodhesha Mali",
  profile_no_received: "Hakuna maoni bado",
  profile_no_received_sub: "Maoni ya wapangaji yataonekana hapa",
  profile_no_sent: "Hakuna maoni yaliyotumwa",
  profile_no_sent_sub: "Maoni yako ya mali yataonekana hapa",
  profile_seen_all: "Umeona orodha zako zote", profile_no_more: "Hakuna maoni zaidi",
  profile_manage_account: "Simamia Akaunti", profile_top_agent: "Wakala Bora #1",
  profile_delete_title: "Futa orodha hii?",
  profile_delete_desc: "Mali hii itafutwa kabisa. Kitendo hiki hakiwezi kutenduliwa.",
  profile_delete_confirm: "Ndiyo, Futa", profile_delete_loading: "Inafuta…",
  profile_delete_success: "Mali imefutwa", profile_delete_fail: "Kufuta kumeshindwa",
  profile_reply_review: "Jibu Maoni",

  menu_my_profile: "Wasifu Wangu", menu_edit_profile: "Hariri Wasifu",
  menu_list_property: "Ongeza Mali", menu_become_agent: "Kuwa Wakala",
  menu_privacy: "Sera ya Faragha", menu_terms: "Masharti ya Huduma",
  menu_faq: "Maswali", menu_language: "Lugha",

  detail_loading: "Inapakia mali…", detail_error: "Imeshindwa kupakia mali",
  detail_go_back: "Rudi", detail_updated: "Imesasishwa",
  detail_available: "✅ Inapatikana", detail_unavailable: "❌ Haipatikani",
  detail_description: "Maelezo", detail_view_map: "Tazama ramani kamili",
  detail_reviews: "Maoni", detail_add_review: "+ Ongeza Maoni",
  detail_add_review_hd: "Ongeza maoni", detail_all_reviews: "Tazama maoni yote {n} →",
  detail_nearby: "Mali za karibu", detail_wishlist: "Hifadhi",
  detail_review_single: "maoni", detail_review_plural: "maoni",

  cur_ngn: "Naira ya Nigeria (₦)", cur_usd: "Dola ya Marekani ($)",
  cur_kes: "Shilingi ya Kenya (KSh)", cur_cfa: "Faranga ya CFA (FCFA)",
  cur_cda: "CDA", cur_pi: "Pi Network (Pi)",

  list_for_rent: "Kukodi", list_for_sale: "Kuuza",

  status_available: "Inapatikana", status_sold: "Imeuzwa",
  status_rented: "Imekodishwa", status_unavailable: "Haipatikani",
  status_expired: "Imeisha Muda",

  neg_negotiable: "Inaweza Kujadiliwa", neg_fixed: "Bei ya Mwisho",
  map_view: "Tazama", map_negotiable: "Inaweza Kujadiliwa",

  agent_owner: "Mmiliki wa Mali", agent_agent: "Wakala wa Mali",
  agent_company: "Kampuni ya Mali",
  agent_call: "Piga Simu", agent_email: "Barua pepe",
  agent_whatsapp: "WhatsApp", agent_chat: "Zungumza",

  s3_sum_header: "Muhtasari wa Orodha",
  s3_sum_title: "Kichwa", s3_sum_category: "Jamii",
  s3_sum_price: "Bei", s3_sum_listed_for: "Imeorodheshwa kwa",
  s3_sum_period: "Kipindi", s3_sum_status: "Hali",
  s3_sum_duration: "Muda", s3_sum_weeks: "wiki {n}",
  s3_sum_negotiable: "Inaweza Kujadiliwa",
  s3_sum_yes: "✅ Ndiyo", s3_sum_no: "🔒 Hapana",
  s3_sum_features: "Vipengele", s3_sum_description: "Maelezo",
  s3_location: "Mahali",

  common_save: "Hifadhi", common_cancel: "Ghairi", common_close: "Funga",
  common_loading: "Inapakia…", common_error: "Kitu kilienda vibaya",
  common_retry: "Jaribu Tena", common_per_year: "/mwaka",
  common_per_month: "/mwezi", common_per_night: "/usiku",

  map_snap_expand: "Panua ↑", map_snap_more: "Onyesha zaidi ↑", map_snap_collapse: "Punguza ↓",
  map_centre_btn: "Rejea kwenye mali", map_resize_panel: "Badilisha ukubwa",
  map_tab_facilities: "Vituo vya Karibu", map_tab_details: "Maelezo ya Mali",
  map_no_facilities: "Hakuna vituo karibu",
  map_no_facilities_sub: "Hakuna vituo vilivyoongezwa ndani ya km 2 ya mali hii.",
  map_landmark_fallback: "Alama ya eneo", map_nearby_label: "karibu",
  map_verified_title: "Mahali imethibitishwa na jamii", map_confirm_title: "Thibitisha alama hii",
  map_verified_btn: "Imethibitishwa", map_confirm_btn: "Thibitisha",
  map_road_access: "Ufikiaji wa Barabara & Mazingira", map_prop_features: "Vipengele vya Mali",
  map_full_address: "Anwani Kamili", map_gps: "Kuratibu za GPS",
  map_open_google: "Fungua katika Google Maps",

  img_upload_title: "Pakia Picha za Mali", img_add_photo: "Ongeza Picha",
  img_removed: "Picha imeondolewa", img_remove_failed: "Imeshindwa kuondoa picha",
  img_upload_success: "Picha imepakiwa", img_upload_failed: "Kupakia picha kumeshindwa",

  lm_step_location: "Mahali", lm_step_facilities: "Vituo",
  lm_new_pin: "Pini Mpya", lm_pinned_location: "Mahali Piliwa Pini",
  lm_already_tagged: "Tayari imewekwa alama karibu",
  lm_duplicate_hint: "💡 Angalia orodha kabla ya kuongeza — huenda unaweka alama sehemu ile ile.",
  lm_name_label: "Jina la alama", lm_name_ph: "mf. Ikeja City Mall, Hospitali Kuu…",
  lm_category_label: "Jamii", lm_saving: "Inahifadhi…",
  lm_add_btn: "Ongeza Vituo vya Karibu", lm_save_changes: "Hifadhi Mabadiliko",
  lm_other: "Nyingine",
  lm_delete_desc: "Alama hii itaondolewa kwenye orodha yako. Kitendo hiki hakiwezi kutenduliwa.",
  lm_keep_btn: "Ibaki", lm_remove_btn: "Ondoa",
  lm_edit_aria: "Hariri alama", lm_delete_aria: "Futa alama",
  lm_empty_title: "Hakuna vituo vilivyoongezwa",
  lm_empty_sub: "Gusa ramani kuweka pini shule, hospitali, vituo vya usafiri, na zaidi.",
  lm_go_to_map: "Nenda Ramani",
  lm_search_address_ph: "Tafuta anwani au eneo…", lm_search_area_ph: "Tafuta eneo…",
  lm_next_step: "Ifuatayo: Ongeza Vituo vya Karibu",
  lm_panel_title: "Vituo vya Karibu", lm_optional: "Hiari",
  lm_panel_desc: "Bonyeza ramani kuweka pini alama. Kila pini inahifadhiwa kimataifa — mtu yeyote anaweza kuipata.",
  lm_back_btn: "Rudi", lm_skip_btn: "Ruka", lm_save_btn: "Hifadhi", lm_done_btn: "Imekamilika",
  lm_mobile_list_title: "Alama za Karibu", lm_added_count: "{n} zimeongezwa",
  lm_mobile_list_hint: "Tumia ✏️ kuhariri au 🗑 kuondoa. Rudi kwenye Ramani kuongeza zaidi.",
  lm_toggle_list: "Orodha ({n})", lm_toggle_map: "Ramani",
  lm_popup_add_title: "Ongeza Vituo vya Karibu", lm_popup_edit_title: "Hariri Alama",
  lm_popup_delete_title: "Ondoa Alama",
  lm_err_name_required: "Tafadhali ingiza jina la alama hii.",
  lm_err_save_failed: "Kuhifadhi kumeshindwa. Tafadhali jaribu tena.",
  lm_err_update_failed: "Kusasisha kumeshindwa. Tafadhali jaribu tena.",

  map_preview_tap_hint: "Gusa kuchagua mahali pa mali",
  map_preview_change: "Badilisha", map_preview_pick: "Chagua Mahali",
  map_preview_no_address: "Hakuna anwani iliyoandikwa", map_preview_no_coords: "Kuratibu hazijawekwa",
  map_preview_open: "Fungua Ramani →",

  faq_title_bold: "Maswali", faq_title_light: "& Msaada",
  faq_subtitle: "Pata majibu ya maswali yako kuhusu programu hii.",
  faq_visit_website: "Tembelea tovuti yetu", faq_email_us: "Tutumie barua pepe",
  faq_privacy: "Sera ya faragha", faq_terms: "Masharti ya huduma",
  faq_tab_buyer: "Mnunuzi", faq_tab_agent: "Wakala wa Mali",
  faq_b_q1: "Proptriz ni nini?",
  faq_b_a1: "Proptriz ni jukwaa la kuorodhesha na kugundua mali ambalo linaunganisha wanunuzi, wapangaji na wauzaji kote Afrika.",
  faq_b_q2: "Jinsi ya kutafuta mali?",
  faq_b_a2: "Tumia kichupo cha Gundua kuvinjari orodha kwa eneo, jamii na bei. Unaweza pia kutumia mtazamo wa Ramani kupata mali karibu nawe.",
  faq_a_q1: "Jinsi ya kuorodhesha mali?",
  faq_a_a1: "Gusa '+ Orodhesha Mali' kutoka skrini ya nyumbani au wasifu wako. Jaza maelezo au tumia fomu yetu inayosaidiwa na AI kuanza haraka.",
  faq_a_q2: "Orodha inabaki hai kwa muda gani?",
  faq_a_a2: "Orodha zinabaki hai kwa muda uliochagua (kwa wiki) unapoziunda au kuzihariri. Unaweza kupanua muda wakati wowote kupitia Hariri Mali.",

  terms_screen_title: "Masharti ya Huduma",
  terms_main_title: "Proptriz - Masharti ya Huduma",
  terms_last_updated: "Ilisasishwa Mwisho: 16/02/2026",
  terms_email_label: "Barua pepe",
  terms_s1_title: "1. Kukubali Masharti",
  terms_s1_body: "Kwa kufikia au kutumia Proptriz, unakubali kufungwa na Masharti haya. Ikiwa hukubaliani, lazima usimame kutumia mara moja.",
  terms_s2_title: "2. Ustahili",
  terms_s2_body: "Lazima uwe na umri wa miaka 18 au zaidi na uwe na uwezo wa kisheria kuingia katika makubaliano yanayofunga.",
  terms_s3_title: "3. Asili ya Jukwaa",
  terms_s3_body: "Proptriz ni soko la kuorodhesha na kugundua mali. Hatumiliki mali zilizoorodheshwa na hatuhakikishi matokeo ya miamala.",
  terms_s4_title: "4. Majukumu ya Mtumiaji",
  terms_s4_li1: "Toa taarifa sahihi",
  terms_s4_li2: "Orodhesha tu mali unazoidhinishwa kuorodhesha",
  terms_s4_li3: "Usichapishe maudhui ya udanganyifu au ya kupotosha",
  terms_s4_li4: "Usimfuate au kumdhulumu mtumiaji mwingine",
  terms_s5_title: "5. Leseni ya Maudhui",
  terms_s5_body: "Kwa kuchapisha maudhui, unatoa Proptriz leseni isiyonikia, bila ada, ya kimataifa ya kutumia, kuonyesha na kukuza maudhui hayo kwa uendeshaji wa jukwaa.",
  terms_s6_title: "6. Ada na Malipo",
  terms_s6_body: "Ikiwa vipengele vya kulipa vitaanzishwa, ada zitaelezwa wazi. Malipo yanaweza kushughulikiwa kupitia watoa huduma wa tatu walioidhinishwa.",
  terms_s7_title: "7. Kanusho",
  terms_s7_body: "Jukwaa linatolewa \"kama lilivyo\" bila dhamana yoyote. Proptriz si wajibu wa migogoro ya watumiaji au matokeo ya miamala.",
  terms_s8_title: "8. Ukomo wa Dhima",
  terms_s8_body: "Kwa kiwango kinachohusika cha kisheria, Proptriz haitawajibika kwa uharibifu usio wa moja kwa moja unaotokana na matumizi ya jukwaa.",
  terms_s9_title: "9. Kusimamishwa",
  terms_s9_body: "Tunaweza kusimamisha au kumaliza akaunti zinazokiuka Masharti haya. Unaweza kufuta akaunti yako wakati wowote.",
  terms_s10_title: "10. Sheria Inayotumika",
  terms_s10_body: "Masharti haya yanafuata sheria za Jamhuri ya Shirikisho la Nigeria.",
  terms_s11_title: "11. Mawasiliano",

  privacy_screen_title: "Sera ya Faragha",
  privacy_main_title: "Sera ya Faragha",
  privacy_s1_title: "1. Utangulizi",
  privacy_s1_body1: "Proptriz Hub (\"Proptriz,\" \"sisi,\" \"yetu,\" au \"zetu\") imejitolea kulinda data yako ya kibinafsi. Sera hii ya Faragha inaeleza jinsi tunavyokusanya, kutumia, kufichua na kulinda taarifa zako unapotumia programu yetu ya simu, tovuti na huduma zinazohusiana.",
  privacy_s1_body2: "Sera hii inazingatia Kanuni ya Ulinzi wa Data ya Nigeria (NDPR) na viwango vya kimataifa vya ulinzi wa data.",
  privacy_s2_title: "2. Msingi wa Kisheria wa Usindikaji",
  privacy_s2_li1: "Idhini uliyotoa",
  privacy_s2_li2: "Utekelezaji wa mkataba",
  privacy_s2_li3: "Utiifu wa majukumu ya kisheria",
  privacy_s2_li4: "Maslahi ya biashara halali",
  privacy_s3_title: "3. Taarifa Tunazokusanya",
  privacy_s3_h_account: "Taarifa za Akaunti",
  privacy_s3_account_li1: "Jina kamili", privacy_s3_account_li2: "Anwani ya barua pepe",
  privacy_s3_account_li3: "Jina la mtumiaji", privacy_s3_account_li4: "Nambari ya simu/WhatsApp",
  privacy_s3_h_listing: "Taarifa za Orodha ya Mali",
  privacy_s3_listing_li1: "Kichwa, jamii, eneo la mali",
  privacy_s3_listing_li2: "Bei na maelezo",
  privacy_s3_listing_li3: "Picha na maudhui ya media",
  privacy_s3_h_tech: "Taarifa za Kiufundi",
  privacy_s3_tech_li1: "Aina ya kifaa na mfumo wa uendeshaji",
  privacy_s3_tech_li2: "Anwani ya IP",
  privacy_s3_tech_li3: "Takwimu za matumizi ya programu",
  privacy_s4_title: "4. Jinsi Tunavyotumia Data Yako",
  privacy_s4_li1: "Kutoa na kusimamia akaunti",
  privacy_s4_li2: "Kuwezesha orodha za mali na utafutaji",
  privacy_s4_li3: "Kurahisisha mawasiliano kati ya watumiaji",
  privacy_s4_li4: "Kuboresha utendaji wa jukwaa",
  privacy_s4_li5: "Kuzuia udanganyifu na matumizi mabaya",
  privacy_s5_title: "5. Kushiriki Data",
  privacy_s5_intro: "Hatuuzi data yako ya kibinafsi. Tunaweza kushiriki taarifa na:",
  privacy_s5_li1: "Watafutaji wa mali wanaovutiwa (mawasiliano tu)",
  privacy_s5_li2: "Watoa huduma wa uhifadhi wa wingu na uchambuzi",
  privacy_s5_li3: "Wasindikaji wa malipo (ikitumika)",
  privacy_s5_li4: "Mamlaka inapohitajika kisheria",
  privacy_s6_title: "6. Uhifadhi wa Data",
  privacy_s6_body: "Tunashikilia data ya kibinafsi kwa muda unaohitajika tu kutimiza madhumuni ya biashara au kisheria halali. Data inafutwa kwa usalama au kutamkwa jina isipokuwa inapohitajika tena.",
  privacy_s7_title: "7. Haki Zako",
  privacy_s7_li1: "Pata data yako ya kibinafsi",
  privacy_s7_li2: "Omba marekebisho",
  privacy_s7_li3: "Omba kufutwa",
  privacy_s7_li4: "Ondoa idhini",
  privacy_s7_li5: "Leta malalamiko kwa mamlaka husika",
  privacy_s8_title: "8. Usalama",
  privacy_s8_body: "Tunatekeleza ulinzi wa kiufundi na wa shirika ikiwemo usimbuaji, uhifadhi salama na udhibiti wa ufikiaji. Hata hivyo, hakuna mfumo unaokuwa salama kabisa.",
  privacy_s9_title: "9. Wasiliana Nasi",
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
// interpolate(t("add_cta_uploading"), { cur: 2, total: 5 })
// → "Uploading photo 2 of 5…"
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