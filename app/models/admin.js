const bcrypt   = require('bcrypt-nodejs');
const environment = process.env.NODE_ENV || "development"
const configuration = require("../../knexfile")[environment]
const database = require('knex')(configuration)

class Admin {
  constructor(){
    this.u_id                 = 0;
    this.username             = "";
    this.password             = "";
    this.passwordConfirmation = "";
    this.email                = "";
    this.organization         = "";
  }

  static findOne(username){
    return database.raw(`SELECT * FROM admins WHERE username=(?)`, [username])
  }

  static updateToken(id, token){
    return database.raw(`UPDATE admins SET dbToken=(?) WHERE id=(?) RETURNING *`, [token, id])
  }

  generateHash(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  static validPassword(loginPassword, passwordOnFile){
    return bcrypt.compareSync(loginPassword, passwordOnFile);
  }

  save(){
    return database.raw('INSERT INTO admins (email, password, created_at, organization, username) VALUES  (?, ?, ?, ?, ?) RETURNING *', [this.email, this.password, new Date, this.organization, this.username])
  }
}

module.exports = Admin;