import type { Knex } from 'knex';
import type { HotelListing, ListingFilters, PaginatedListings } from './hotelListing.types';
import type { CreateListingInput, UpdateListingInput } from './hotelListing.schema';

export class HotelListingRepo {
  constructor(private readonly db: Knex) {}

  async findPaginated(filters: ListingFilters): Promise<PaginatedListings> {
    const {
      page = 1,
      limit = 20,
      search,
      city,
      country,
      property_type,
      min_price,
      max_price,
      min_guests,
    } = filters;

    const offset = (page - 1) * limit;

    // Shared filter function applied to both the data query and the count query
    const applyFilters = (query: Knex.QueryBuilder) => {
      query.where('is_active', true);

      if (search) {
        query.where((q) =>
          q
            .whereILike('name', `%${search}%`)
            .orWhereILike('description', `%${search}%`)
            .orWhereILike('city', `%${search}%`)
            .orWhereILike('country', `%${search}%`),
        );
      }

      if (city) query.whereILike('city', `%${city}%`);
      if (country) query.whereILike('country', `%${country}%`);
      if (property_type) query.where({ property_type });
      if (min_price !== undefined) query.where('nightly_rate', '>=', min_price);
      if (max_price !== undefined) query.where('nightly_rate', '<=', max_price);
      if (min_guests !== undefined) query.where('max_guests', '>=', min_guests);

      return query;
    };

    const [data, countResult] = await Promise.all([
      applyFilters(this.db<HotelListing>('hotel_listings').select('*'))
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset),
      applyFilters(
        this.db<HotelListing>('hotel_listings').count<{ count: string }>('id as count').first(),
      ),
    ]);

    const total = parseInt(countResult?.count ?? '0', 10);

    return { data, total, page, limit, total_pages: Math.ceil(total / limit) };
  }

  async findById(id: string): Promise<HotelListing | undefined> {
    return this.db<HotelListing>('hotel_listings').where({ id }).first();
  }

  async create(data: CreateListingInput & { image_url: string | null }): Promise<HotelListing> {
    const [listing] = await this.db<HotelListing>('hotel_listings').insert(data).returning('*');
    return listing;
  }

  async update(
    id: string,
    data: UpdateListingInput & { image_url?: string | null },
  ): Promise<HotelListing | undefined> {
    const [listing] = await this.db<HotelListing>('hotel_listings')
      .where({ id })
      .update({ ...data, updated_at: this.db.fn.now() })
      .returning('*');
    return listing;
  }

  async delete(id: string): Promise<boolean> {
    const count = await this.db<HotelListing>('hotel_listings').where({ id }).delete();
    return count > 0;
  }
}
