import { z } from 'zod';

const propertyType = z.enum(['hotel', 'apartment', 'villa', 'resort', 'guesthouse', 'hostel']);

/**
 * amenities arrives as a JSON string when sent via multipart/form-data,
 * or as a plain array when sent as JSON. We handle both.
 */
const amenitiesField = z
  .union([z.array(z.string()), z.string()])
  .transform((val) => {
    if (typeof val === 'string') {
      try {
        return JSON.parse(val) as string[];
      } catch {
        return val.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }
    return val;
  })
  .pipe(z.array(z.string()))
  .optional()
  .default([]);

const baseListingBody = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(10).max(5000),
  location: z.string().min(1).max(255),
  country: z.string().min(1).max(100),
  city: z.string().min(1).max(100),
  address: z.string().min(1).max(500),
  nightly_rate: z.coerce.number().positive('Nightly rate must be positive'),
  max_guests: z.coerce.number().int().min(1),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().int().min(0),
  property_type: propertyType,
  amenities: amenitiesField,
  is_active: z.coerce.boolean().optional().default(true),
});

export const createListingSchema = z.object({
  body: baseListingBody,
});

export const updateListingSchema = z.object({
  body: baseListingBody.partial(),
  params: z.object({ id: z.number().int().positive('Invalid listing ID') }),
});

export const listingIdParamSchema = z.object({
  params: z.object({ id: z.number().int().positive('Invalid listing ID') }),
});

export const listingQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    property_type: propertyType.optional(),
    min_price: z.coerce.number().positive().optional(),
    max_price: z.coerce.number().positive().optional(),
    min_guests: z.coerce.number().int().positive().optional(),
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  }),
});

export type CreateListingInput = z.infer<typeof createListingSchema>['body'];
export type UpdateListingInput = z.infer<typeof updateListingSchema>['body'];
export type ListingQuery = z.infer<typeof listingQuerySchema>['query'];
