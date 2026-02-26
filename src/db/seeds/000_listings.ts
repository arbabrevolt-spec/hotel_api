import type { Knex } from 'knex';
import { faker } from '@faker-js/faker';

// number of listings to create; default 20 if not set
const COUNT = Number(process.env.LISTINGS_SEED_COUNT) || 20;

export async function seed(knex: Knex): Promise<void> {
    // delete existing
    await knex('hotel_listings').del();

    const rows = [];
    for (let i = 0; i < COUNT; i++) {
        rows.push({
            name: faker.company.name(),
            description: faker.lorem.paragraph(),
            location: faker.location.streetAddress(),
            country: faker.location.country(),
            city: faker.location.city(),
            address: faker.location.streetAddress(),
            nightly_rate: faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
            max_guests: faker.number.int({ min: 1, max: 10 }),
            bedrooms: faker.number.int({ min: 1, max: 5 }),
            bathrooms: faker.number.int({ min: 1, max: 3 }),
            property_type: faker.helpers.arrayElement(['hotel', 'apartment', 'villa', 'resort', 'guesthouse', 'hostel']),
            amenities: ['wifi', 'air conditioning', 'pool'],
            image_url: null,
            is_active: true,
            rating: null,
            rating_count: 0,
        });
    }

    await knex<{}>('hotel_listings').insert(rows);
}
