exports.up = function(knex, Promise) {
  let createQuery = `CREATE TABLE admins(
    id SERIAL PRIMARY KEY NOT NULL,
    organization TEXT,
    email TEXT,
    username TEXT,
    password TEXT,
    created_at TIMESTAMP
  )`
  return knex.raw(createQuery)
}

exports.down = function(knex, Promise) {
  let dropQuery = `DROP TABLE admins`
  return knex.raw(dropQuery)
}
