exports.up = function(knex, Promise) {
  let createQuery = `CREATE TABLE customers(
    id SERIAL PRIMARY KEY NOT NULL,
    email TEXT,
    created_at TIMESTAMP
  )`
  return knex.raw(createQuery)
}

exports.down = function(knex, Promise) {
  let dropQuery = `DROP TABLE customers`
  return knex.raw(dropQuery)
}