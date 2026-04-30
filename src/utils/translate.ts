import { Translations } from "@/i18n/translations";
import { CategoryEnum, ListForEnum, NegotiableEnum, PropertyStatusEnum, RenewalEnum } from "@/types/property";

export const getPropertyCategoryOptions = (t: (key: keyof Translations) => string) => [
  {
    value: CategoryEnum.house,
    name: t(
      'cat_apartment',
    ),
  },
  {
    value: CategoryEnum.shortlet,
    name: t(
      'cat_shortlet',
    ),
  },
  {
    value: CategoryEnum.hotel,
    name: t(
      'cat_hotel',
    ),
  },
  {
    value: CategoryEnum.land,
    name: t(
      'cat_land',
    ),
  },
  {
    value: CategoryEnum.office,
    name: t(
      'cat_office',
    ),
  },
  {
    value: CategoryEnum.shop,
    name: t(
      'cat_shop',
    ),
  },
  {
    value: CategoryEnum.others,
    name: t(
      'cat_others',
    ),
  },
  
];

export const translateListedForOptions = (option: ListForEnum, t: (key: keyof Translations) => string): string => {
  switch (option) {
    case ListForEnum.rent:
      return t('list_for_rent');
    case ListForEnum.sale:
      return t('list_for_sale');
    default:
      return '';
  }
};

export const translateCategoryOptions = (option: CategoryEnum, t: (key: keyof Translations) => string): string => {
  switch (option) {
    case CategoryEnum.house:
      return t('cat_apartment');
    case CategoryEnum.shortlet:
      return t('cat_shortlet');
    case CategoryEnum.hotel:
      return t('cat_hotel');
    case CategoryEnum.land:
      return t('cat_land');
    case CategoryEnum.office:
      return t('cat_office');
    case CategoryEnum.shop:
      return t('cat_shop');
    case CategoryEnum.others:
      return t('cat_others');
    default:
      return '';
  }
};

export const translateRenewalOptions = (option: RenewalEnum, t: (key: keyof Translations) => string): string => {
  switch (option) {
    case RenewalEnum.daily:
      return t('s1_period_daily');
    case RenewalEnum.weekly:
      return t('s1_period_weekly');
    case RenewalEnum.monthly:
      return t('s1_period_monthly');
    case RenewalEnum.yearly:
      return t('s1_period_yearly');
    default:
      return '';
  }
};

export const translatePropertyStatusOptions = (option: PropertyStatusEnum, t: (key: keyof Translations) => string): string => {
  switch (option) {
    case PropertyStatusEnum.available:
      return t('status_available');
    case PropertyStatusEnum.unavailable:
      return t('status_unavailable');
    case PropertyStatusEnum.rented:
      return t('status_rented');
    case PropertyStatusEnum.sold:
      return t('status_sold');
    case PropertyStatusEnum.expired:
      return t('status_expired');
    default:
      return '';
  }
};

export const translateNegotiableOptions = (option: NegotiableEnum, t: (key: keyof Translations) => string): string => {
  switch (option) {
    case NegotiableEnum.Negotiable:
      return t('neg_negotiable');
    case NegotiableEnum.NonNegotiable:
      return t('neg_fixed');
    default:
      return '';
  }
};
