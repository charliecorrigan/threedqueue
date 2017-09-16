const environment = process.env.NODE_ENV || "development"
const configuration = require("../../knexfile")[environment]
const database = require('knex')(configuration)

class Customer {
  constructor(){
    this.u_id   = 0;
    this.email  = "";
  }



  save(){
    return database.raw('INSERT INTO customers (email, created_at) VALUES  (?, ?) RETURNING *', [this.email, new Date])
  }
}

module.exports = Customer;