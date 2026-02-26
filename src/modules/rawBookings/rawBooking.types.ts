export type PaymentMethod = 'cash' | 'upi' | 'net' | 'credit';

export interface RawBooking {
    id: string;
    full_name: string;
    email: string;
    contact_number: string;
    number_of_guests: number;
    check_in: string; // YYYY-MM-DD
    check_out: string;
    payment_method: PaymentMethod;
    created_at: Date;
    updated_at: Date;
}
