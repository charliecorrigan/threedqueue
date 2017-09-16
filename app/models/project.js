const environment = process.env.NODE_ENV || "development"
const configuration = require("../../knexfile")[environment]
const database = require('knex')(configuration)
const Customer = require('./customer')

const assignColor = {
  'blue': 0,
  'yellow': 1,
  'red': 2,
  'white': 3,
  'black': 4,
  'purple': 5,
  'orange': 6,
  'green': 7,
}

const assignApprovaStatus = {
  'awaiting_approval': 0,
  'approved': 1,
  'rejected': 2,
}

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


  static createNewProject(admin, projectDetails, done){
    this.findCustomer(projectDetails.email).then(data =>{
      if (data.rowCount > 0) {
        var newProject              = new Project();
        newProject.admin_id         = admin.id;
        newProject.customer_id      = data.rows[0].id;
        newProject.customer_name    = projectDetails.name;
        newProject.preferred_color  = assignColor[projectDetails['preferred-color']];
        newProject.comments         = projectDetails.comments;
        console.log(newProject)
        newProject.save()
      } else {
        var newCustomer            = new Customer();
        newCustomer.email          = projectDetails.email;
        database.raw('INSERT INTO customers (email, created_at) VALUES  (?, ?) RETURNING *', [newCustomer.email, new Date])
        .then(data =>{
          var newProject              = new Project();
          newProject.admin_id         = admin.id;
          newProject.customer_id      = data.rows[0].id;
          newProject.customer_name    = projectDetails.name;
          newProject.preferred_color  = assignColor[projectDetails['preferred-color']];
          newProject.comments         = projectDetails.comments;
          console.log(newProject)
          newProject.save()
        })
        }
    })
  }

  save(){
    database.raw('INSERT INTO projects (admin_id, customer_id, name, preferred_color, customer_comments, approval_status, created_at) VALUES  (?, ?, ?, ?, ?, ?, ?) RETURNING *', [this.admin_id, this.customer_id, this.customer_name, this.preferred_color, this.comments, this.approval_status, new Date]).then(data =>{
      return data.rows[0]
    })
  }

  static saveCustomer(newCustomer){

  }

  static findCustomer(email){
    console.log("Here in the find customer function.")
    return database.raw(`SELECT * FROM customers WHERE email=(?)`, [email])
  }

  // static findOne(id){
  //   return database.raw(`SELECT * FROM admins WHERE id=(?)`, [id])
  // }

  // static updateToken(id, token){
  //   return database.raw(`UPDATE admins SET dbToken=(?) WHERE id=(?) RETURNING *`, [token, id])
  // }

}

module.exports = Project;