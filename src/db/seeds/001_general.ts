import type { Knex } from 'knex';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

export async function seed(knex: Knex): Promise<void> {
    // wipe tables in safe order
    await knex('bookings').del();
    await knex('raw_bookings').del();
    await knex('hotel_listings').del();
    await knex('users').del();

    // create two users
    const password = 'password123';
    const adminPass = 'adminpass';
    const [user1] = await knex('users')
        .insert({
            username: 'user1',
            email: 'user1@example.com',
            password_hash: await bcrypt.hash(password, 10),
            role: 'user',
        })
        .returning('*');
    const [admin] = await knex('users')
        .insert({
            username: 'admin',
            email: 'admin@example.com',
            password_hash: await bcrypt.hash(adminPass, 10),
            role: 'admin',
        })
        .returning('*');

    // create a few listings
    const listings = [];
    for (let i = 0; i < 3; i++) {
        listings.push({
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
            amenities: ['wifi', 'air conditioning'],
            image_url: null,
            is_active: true,
            rating: null,
            rating_count: 0,
        });
    }
    const insertedListings = await knex('hotel_listings').insert(listings).returning('*');

    // create one booking for user1 on first listing
    const firstListing = insertedListings[0];
    await knex('bookings').insert({
        user_id: user1.id,
        listing_id: firstListing.id,
        check_in: faker.date.soon({ days: 30 }).toISOString().split('T')[0],
        check_out: faker.date.soon({ days: 40 }).toISOString().split('T')[0],
        guests: 2,
        nightly_rate: firstListing.nightly_rate,
        total_nights: 3,
        total_price: Number((firstListing.nightly_rate * 3).toFixed(2)),
        status: 'pending',
        notes: null,
    });

    // raw bookings – two entries
    const rawArr = [];
    for (let i = 0; i < 2; i++) {
        rawArr.push({
            full_name: faker.person.fullName(),
            email: faker.internet.email(),
            contact_number: faker.phone.number(),
            number_of_guests: faker.number.int({ min: 1, max: 5 }),
            check_in: faker.date.soon({ days: 10 }).toISOString().split('T')[0],
            check_out: faker.date.soon({ days: 15 }).toISOString().split('T')[0],
            payment_method: faker.helpers.arrayElement(['cash', 'upi', 'net', 'credit']),
        });
    }
    await knex('raw_bookings').insert(rawArr);
}
