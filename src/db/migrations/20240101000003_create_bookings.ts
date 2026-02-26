import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('bookings', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.uuid('listing_id').notNullable().references('id').inTable('hotel_listings').onDelete('CASCADE');
    table.date('check_in').notNullable();
    table.date('check_out').notNullable();
    table.integer('guests').notNullable();
    table.decimal('nightly_rate', 10, 2).notNullable(); // snapshot at booking time
    table.integer('total_nights').notNullable();
    table.decimal('total_price', 10, 2).notNullable();
    table.enum('status', ['pending', 'confirmed', 'cancelled']).notNullable().defaultTo('pending');
    table.text('notes').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('bookings');
}
