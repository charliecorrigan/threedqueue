const environment = process.env.NODE_ENV || "development"
const configuration = require("../../knexfile")[environment]
const database = require('knex')(configuration)

class Project {
  constructor(){
    this.u_id                         = 0;
    this.admin_id                     = 0;
    this.customer_id                  = "";
    this.customer_name                = "";
    this.approval_status              = 0;
    this.approval_initials            = "";
    this.approval_status_change_date  = "";
    this.in_queue                     = false;
    this.preferred_color              = 0;
    this.customer_comments            = "";
    this.acknowledgement              = false;
    this.file_path                    = "";
    this.print_status                 = 0;
    this.print_status_change_date     = "";
  }

  // static findOne(id){
  //   return database.raw(`SELECT * FROM admins WHERE id=(?)`, [id])
  // }

  // static updateToken(id, token){
  //   return database.raw(`UPDATE admins SET dbToken=(?) WHERE id=(?) RETURNING *`, [token, id])
  // }

  // save(){
  //   return database.raw('INSERT INTO admins (email, password, created_at, organization, username) VALUES  (?, ?, ?, ?, ?) RETURNING *', [this.email, this.password, new Date, this.organization, this.username])
  // }
}

module.exports = Project;