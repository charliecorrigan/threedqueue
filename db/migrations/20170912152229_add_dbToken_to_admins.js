exports.up = function(knex, Promise) {
  return knex.schema.table('admins', function(t) {
      t.text('dbToken').nullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('admins', function(t) {
      t.dropColumn('dbToken');
  });
};