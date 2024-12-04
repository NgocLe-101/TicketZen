/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
    .createTable("orders", (table) => {
      table.increments("id").primary();
      table.string("customer_name").notNullable();
      table.string("status").defaultTo("Pending"); // Pending, Confirmed, Shipped, etc.
      table.timestamp("created_at").defaultTo(knex.fn.now());
    })
    .createTable("order_details", (table) => {
      table.increments("id").primary();
      table.integer("order_id").unsigned().notNullable();
      table.foreign("order_id").references("orders.id").onDelete("CASCADE");
      table.integer("product_id").unsigned().notNullable();
      table.foreign("product_id").references("products.id").onDelete("CASCADE");
      table.integer("quantity").notNullable();
      table.float("price").notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists("order_details")
    .dropTableIfExists("orders");
};
