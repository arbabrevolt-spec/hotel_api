import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('raw_bookings', (table) => {
        table.increments('id').primary();
        table.string('full_name').notNullable();
        table.string('email').notNullable();
        table.string('contact_number').notNullable();
        table.integer('number_of_guests').notNullable();
        table.date('check_in').notNullable();
        table.date('check_out').notNullable();
        table.string('payment_method').notNullable()
            .checkIn(['cash', 'upi', 'net', 'credit']);
        table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
        table.timestamp('updated_at').notNullable().defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('raw_bookings');
}
