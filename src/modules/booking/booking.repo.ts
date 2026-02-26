import type { Knex } from 'knex';
import type { Booking, BookingWithDetails } from './booking.types';

export class BookingRepo {
  constructor(private readonly db: Knex) { }

  async findAllByUser(userId: string): Promise<Booking[]> {
    return this.db<Booking>('bookings')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc');
  }

  async findByIdAndUser(id: string, userId: string): Promise<Booking | undefined> {
    return this.db<Booking>('bookings').where({ id, user_id: userId }).first();
  }

  async findAllWithDetails(): Promise<BookingWithDetails[]> {
    return this.db('bookings as b')
      .select('b.*', 'hl.name as listing_name', 'u.email as user_email')
      .join('hotel_listings as hl', 'b.listing_id', 'hl.id')
      .join('users as u', 'b.user_id', 'u.id')
      .orderBy('b.created_at', 'desc') as unknown as BookingWithDetails[];
  }

  async create(data: Omit<Booking, 'id' | 'created_at' | 'updated_at'>, trx?: Knex.Transaction): Promise<Booking> {
    const query = trx ?? this.db;
    const [booking] = await query<Booking>('bookings').insert(data).returning('*');
    return booking;
  }

  async updateStatus(id: string, status: Booking['status']): Promise<Booking | undefined> {
    const [booking] = await this.db<Booking>('bookings')
      .where({ id })
      .update({ status, updated_at: this.db.fn.now() })
      .returning('*');
    return booking;
  }
}
