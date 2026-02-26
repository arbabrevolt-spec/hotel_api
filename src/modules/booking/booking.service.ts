import type { BookingRepo } from './booking.repo';
import type { HotelListingRepo } from '../hotelListing/hotelListing.repo';
import type { Booking, BookingWithDetails } from './booking.types';
import type { CreateBookingInput } from './booking.schema';
import { NotFoundError, BadRequestError } from '../../lib/AppError';

export class BookingService {
  constructor(
    private readonly bookingRepo: BookingRepo,
    private readonly listingRepo: HotelListingRepo,
  ) { }

  async getMyBookings(userId: string): Promise<Booking[]> {
    return this.bookingRepo.findAllByUser(userId);
  }

  async getMyBooking(id: string, userId: string): Promise<Booking> {
    const booking = await this.bookingRepo.findByIdAndUser(id, userId);
    if (!booking) throw new NotFoundError('Booking');
    return booking;
  }

  async getAllBookings(): Promise<BookingWithDetails[]> {
    return this.bookingRepo.findAllWithDetails();
  }

  async create(userId: string, input: CreateBookingInput): Promise<Booking> {
    // Use transaction to prevent double-booking race conditions
    return this.bookingRepo['db'].transaction(async (trx) => {
      // Lock the listing row for the duration of this transaction
      const listing = await trx<any>('hotel_listings')
        .first();

      if (!listing) throw new NotFoundError('Hotel listing');
      if (!listing.is_active) throw new BadRequestError('This listing is not currently available');

      if (input.guests > listing.max_guests) {
        throw new BadRequestError(
          `This listing accommodates a maximum of ${listing.max_guests} guests`,
        );
      }

      const checkIn = new Date(input.check_in);
      if (checkIn < new Date()) throw new BadRequestError('Check-in date cannot be in the past');

      const checkOut = new Date(input.check_out);
      const totalNights = Math.ceil(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24),
      );
      const totalPrice = Number((listing.nightly_rate * totalNights).toFixed(2));

      return this.bookingRepo.create({
        user_id: userId,
        listing_id: listing.id,
        check_in: input.check_in,
        check_out: input.check_out,
        guests: input.guests,
        nightly_rate: listing.nightly_rate,
        total_nights: totalNights,
        total_price: totalPrice,
        status: 'pending',
        notes: input.notes ?? null,
      }, trx);
    });
  }

  async cancelBooking(id: string, userId: string): Promise<Booking> {
    const booking = await this.bookingRepo.findByIdAndUser(id, userId);
    if (!booking) throw new NotFoundError('Booking');
    if (booking.status === 'cancelled') throw new BadRequestError('Booking is already cancelled');

    const updated = await this.bookingRepo.updateStatus(id, 'cancelled');
    return updated!;
  }

  async updateStatus(id: string, status: Booking['status']): Promise<Booking> {
    const updated = await this.bookingRepo.updateStatus(id, status);
    if (!updated) throw new NotFoundError('Booking');
    return updated;
  }
}
