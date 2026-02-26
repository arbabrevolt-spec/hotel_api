import type { Knex } from 'knex';
import type { RawBooking } from './rawBooking.types';

export class RawBookingRepo {
    constructor(private readonly db: Knex) { }

    async findAll(): Promise<RawBooking[]> {
        return this.db<RawBooking>('raw_bookings').orderBy('created_at', 'desc');
    }

    async findById(id: string): Promise<RawBooking | undefined> {
        return this.db<RawBooking>('raw_bookings').where({ id }).first();
    }

    async create(data: Omit<RawBooking, 'id' | 'created_at' | 'updated_at'>): Promise<RawBooking> {
        const [row] = await this.db<RawBooking>('raw_bookings').insert(data).returning('*');
        return row;
    }

    async update(id: string, data: Partial<Omit<RawBooking, 'id' | 'created_at' | 'updated_at'>>): Promise<RawBooking | undefined> {
        const [row] = await this.db<RawBooking>('raw_bookings')
            .where({ id })
            .update({ ...data, updated_at: this.db.fn.now() })
            .returning('*');
        return row;
    }

    async delete(id: string): Promise<boolean> {
        const count = await this.db<RawBooking>('raw_bookings').where({ id }).delete();
        return count > 0;
    }
}
