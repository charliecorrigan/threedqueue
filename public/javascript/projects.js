const environment = "development"
// const environment = "production"

const baseApiUrl = {
  'production': "https://threedqueue.herokuapp.com/api/v1",
  'development': "http://localhost:8080/api/v1"
}

$(document).ready(function(){
  renderProjects();
});

renderProjects = function(){
  $.getJSON(baseApiUrl[environment] + '/projects/awaiting')
  .then(function(projects){
    projects.forEach(function(project){
      $("#projects-container").append("<p>" + project.created_at, project.email, project.name, project.preferred_color, project.id, project.customer_comments, project.file_path, project.email + "</p>")
    })
  })
}