var bcrypt   = require('bcrypt-nodejs');

class Admin {
  constructor(){
    this.u_id                 = 0;
    this.username             = "";
    this.password             = "";
    this.passwordConfirmation = "";
    this.email                = "";
    this.organization         = "";
  }

  generateHash(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  }

  validPassword(password){
    return bcrypt.compareSync(password, this.password);
  }
}

module.exports = Admin;