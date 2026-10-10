export interface TourDay {
  day: number | string;
  title: string;
  details: string[];
}

export interface TourPackage {
  id: string;
  slug: string;
  name: string;
  category: 'Cultural Immersion' | 'Festival & Tshechu' | 'Trekking' | 'Adventure & Nature';
  sourceCategory: 'Culture / Classic' | 'Festival' | 'Trekking' | 'Nature / Birding' | 'Cycling / River';
  duration: string;
  durationDays: number | null;
  destinations: string[];
  travelStyle: string | null;
  difficulty: string | null;
  bestSeason: string | null;
  originalPrice: number | null;
  proposedPrice: number | null;
  proposedPriceDisplay: string;
  currency: string | null;
  pricingBasis: string;
  singleSupplement: string | null;
  overview: string;
  highlights: string[];
  itinerary: TourDay[];
  inclusions: string[];
  exclusions: string[];
  practicalInfo: string | null;
  verificationNotes: string[];
  sourceUrls: string[];
  imageKey: string;
  isAlias: boolean;
  showPublicly: boolean;
  durationNeedsConfirmation: boolean;
  currencyNeedsConfirmation: boolean;
  displayExclusionsOnRequest: boolean;
}

declare global {
  interface Window {
    NB_TOURS: TourPackage[];
    NB_TOUR_CATEGORIES: Array<{ name: string; slug: string; icon: string; imageKey: string; description: string }>;
  }
}
