import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('hotel_listings', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.string('location').notNullable();
    table.string('country').notNullable();
    table.string('city').notNullable();
    table.string('address').notNullable();
    table.decimal('nightly_rate', 10, 2).notNullable();
    table.integer('max_guests').notNullable();
    table.integer('bedrooms').notNullable();
    table.integer('bathrooms').notNullable();
    table.string('property_type').notNullable().defaultTo('hotel')
      .checkIn(['hotel', 'apartment', 'villa', 'resort', 'guesthouse', 'hostel']);
    table.text('amenities').notNullable().defaultTo('[]'); // JSON array string
    table.string('image_url').nullable();
    table.boolean('is_active').notNullable().defaultTo(true);
    table.float('rating').nullable();
    table.integer('rating_count').notNullable().defaultTo(0);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('hotel_listings');
}
