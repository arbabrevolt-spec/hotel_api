import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('bookings', (table) => {
    table.increments('id').primary();
    table.integer('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.integer('listing_id').notNullable().references('id').inTable('hotel_listings').onDelete('CASCADE');
    table.date('check_in').notNullable();
    table.date('check_out').notNullable();
    table.integer('guests').notNullable();
    table.decimal('nightly_rate', 10, 2).notNullable();
    table.integer('total_nights').notNullable();
    table.decimal('total_price', 10, 2).notNullable();
    table.string('status').notNullable().defaultTo('pending')
      .checkIn(['pending', 'confirmed', 'cancelled']);
    table.text('notes').nullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('bookings');
}
