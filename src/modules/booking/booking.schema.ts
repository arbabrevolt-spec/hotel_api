import { z } from 'zod';

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD');

export const createBookingSchema = z.object({
  body: z
    .object({
      listing_id: z.number().int().positive('Invalid listing ID'),
      check_in: dateString,
      check_out: dateString,
      guests: z.number().int().min(1, 'At least 1 guest required'),
      notes: z.string().max(1000).optional(),
    })
    .refine((data) => new Date(data.check_out) > new Date(data.check_in), {
      message: 'Check-out must be after check-in',
      path: ['check_out'],
    }),
});

export const bookingIdParamSchema = z.object({
  params: z.object({ id: z.number().int().positive('Invalid booking ID') }),
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'cancelled']),
  }),
  params: z.object({ id: z.number().int().positive('Invalid booking ID') }),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>['body'];
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>['body'];
