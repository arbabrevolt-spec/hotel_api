export type PropertyType = 'hotel' | 'apartment' | 'villa' | 'resort' | 'guesthouse' | 'hostel';

export interface HotelListing {
  id: string;
  name: string;
  description: string;
  location: string;
  country: string;
  city: string;
  address: string;
  nightly_rate: number;
  max_guests: number;
  bedrooms: number;
  bathrooms: number;
  property_type: PropertyType;
  amenities: string[];
  image_url: string | null;
  is_active: boolean;
  rating: number | null;
  rating_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface ListingFilters {
  search?: string;
  city?: string;
  country?: string;
  property_type?: PropertyType;
  min_price?: number;
  max_price?: number;
  min_guests?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedListings {
  data: HotelListing[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
