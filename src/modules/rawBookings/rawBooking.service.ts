import type { RawBookingRepo } from './rawBooking.repo';
import type { RawBooking } from './rawBooking.types';
import type { CreateRawBookingInput } from './rawBooking.schema';
import { NotFoundError } from '../../lib/AppError';

export class RawBookingService {
    constructor(private readonly repo: RawBookingRepo) { }

    async getAll(): Promise<RawBooking[]> {
        return this.repo.findAll();
    }

    async get(id: string): Promise<RawBooking> {
        const booking = await this.repo.findById(id);
        if (!booking) throw new NotFoundError('Raw booking');
        return booking;
    }

    async create(input: CreateRawBookingInput): Promise<RawBooking> {
        // input matches repository payload except for omitted fields
        return this.repo.create(input);
    }

    async update(id: string, input: Partial<CreateRawBookingInput>): Promise<RawBooking> {
        const updated = await this.repo.update(id, input);
        if (!updated) throw new NotFoundError('Raw booking');
        return updated;
    }

    async delete(id: string): Promise<void> {
        const ok = await this.repo.delete(id);
        if (!ok) throw new NotFoundError('Raw booking');
    }
}
