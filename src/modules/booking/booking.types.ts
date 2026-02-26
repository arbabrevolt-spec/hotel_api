export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  user_id: string;
  listing_id: string;
  check_in: string; // YYYY-MM-DD
  check_out: string;
  guests: number;
  nightly_rate: number; // snapshotted at booking time
  total_nights: number;
  total_price: number;
  status: BookingStatus;
  notes: string | null;
  created_at: Date;
  updated_at: Date;
}

// Enriched view returned to admins
export interface BookingWithDetails extends Booking {
  listing_name: string;
  user_email: string;
}
