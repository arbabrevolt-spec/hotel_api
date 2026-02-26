import { z } from 'zod';

const dateString = z.string().regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, 'Date must be YYYY-MM-DD');
export const createRawBookingSchema = z.object({
    body: z.object({
        full_name: z.string().min(1),
        email: z.string().email(),
        contact_number: z.string().min(1),
        number_of_guests: z.number().int().min(1),
        check_in: dateString,
        check_out: dateString,
        payment_method: z.enum(['cash', 'upi', 'net', 'credit']),
    }).refine((d) => new Date(d.check_out) > new Date(d.check_in), {
        message: 'Check-out must be after check-in',
        path: ['check_out'],
    }),
});

export const idParamSchema = z.object({
    params: z.object({ id: z.number().int().positive('Invalid ID') }),
});

export type CreateRawBookingInput = z.infer<typeof createRawBookingSchema>['body'];
