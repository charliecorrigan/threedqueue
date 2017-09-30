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
        newProject.file_path        = projectDetails.file_path;
        console.log(newProject)
        newProject.save()
      } else {
        console.log("This customer is new. In the else statement.")
        var newCustomer            = new Customer();
        newCustomer.email          = projectDetails.email;
        database.raw('INSERT INTO customers (email, created_at) VALUES  (?, ?) RETURNING *', [newCustomer.email, new Date])
        .then(data =>{
          console.log("The following should be the new customer:")
          console.log(data)
          var newProject              = new Project();
          newProject.admin_id         = admin.id;
          newProject.customer_id      = data.rows[0].id;
          newProject.customer_name    = projectDetails.name;
          newProject.preferred_color  = assignColor[projectDetails['preferred-color']];
          newProject.comments         = projectDetails.comments;
          newProject.file_path        = projectDetails.file_path;
        console.log(newProject)
          newProject.save()
        })
        }
    })
  }

  save(){
    database.raw('INSERT INTO projects (admin_id, customer_id, name, preferred_color, customer_comments, approval_status, file_path, created_at) VALUES  (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *', [this.admin_id, this.customer_id, this.customer_name, this.preferred_color, this.comments, this.approval_status, this.file_path, new Date]).then(data =>{
      console.log("In the save project function.")
      console.log("The following should be the new project:")
      console.log(data)
      return data.rows[0]
    })
  }

  static all(admin, status){
    console.log(admin)
    console.log(admin.id)
    console.log(status)
    console.log(assignApprovaStatus[status])
    return database.raw(`SELECT projects.created_at,
                                projects.name,
                                projects.preferred_color,
                                projects.id,
                                projects.customer_comments,
                                projects.file_path,
                                customers.email
                        FROM projects
                        INNER JOIN customers
                        ON projects.customer_id = customers.id
                        WHERE projects.admin_id = (?) and projects.approval_status = (?)`,
                        [admin.id, assignApprovaStatus[status]]
                      )
  }

  static findCustomer(email){
    console.log("Here in the find customer function.")
    return database.raw(`SELECT * FROM customers WHERE email=(?)`, [email])
  }

  static updateStatus(id, approvalInitials, status){
    console.log("We're in update status function. Id is...")
    console.log(id)
    console.log("ApprovalInitials are...")
    console.log(approvalInitials)
    console.log("Status is...")
    console.log(status)
    const projectId = parseInt(id)
    const approvalStatus = parseInt(status)
    console.log("We just declared some variables. ProjectId should be an int...")
    console.log(projectId)
    console.log("And approval status should also be an int now...")
    console.log(approvalStatus)
    return database.raw(`UPDATE projects
                        SET approval_status=(?),
                            approval_initials=(?)
                        WHERE id=(?)
                        RETURNING *`,
                      [approvalStatus, approvalInitials, projectId])
  }
}

module.exports = Project;