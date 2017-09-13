exports.up = function(knex, Promise) {
  return knex.schema.table('admins', function(t) {
      t.text('dbtoken').nullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('admins', function(t) {
      t.dropColumn('dbtoken');
  });
};