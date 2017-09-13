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

  static findById(){
    console.log("In FindById")
  }

  static findOne(email){
    return database.raw(`SELECT * FROM admins WHERE email=(?)`, [email])
  }

  static updateToken(id, token){
    let tokenHash = bcrypt.hashSync(token, bcrypt.genSaltSync(8), null)
    return database.raw(`UPDATE admins SET dbToken=(?) WHERE id=(?) RETURNING *`, [tokenHash, id])
  }

  generateHash(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  static validPassword(loginPassword, passwordOnFile){
    return bcrypt.compareSync(loginPassword, passwordOnFile);
  }

  save(){
    console.log("In the save function, checking this...")
    console.log(this.email)
    console.log(this.password)
    return database.raw('INSERT INTO admins (email, password, created_at) VALUES  (?, ?, ?) RETURNING *', [this.email, this.password, new Date])
  }
}

module.exports = Admin;