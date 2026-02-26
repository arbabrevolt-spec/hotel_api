import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('hotel_listings', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
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
    table
      .enum('property_type', ['hotel', 'apartment', 'villa', 'resort', 'guesthouse', 'hostel'])
      .notNullable()
      .defaultTo('hotel');
    table.specificType('amenities', 'text[]').notNullable().defaultTo('{}');
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
