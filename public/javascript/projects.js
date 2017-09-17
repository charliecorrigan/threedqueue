$(document).ready(function(){
  renderProjects();
});

renderProjects = function(){
  $.getJSON('http://localhost:8080/api/v1/projects/awaiting')
  .then(function(projects){
    projects.forEach(function(project){
      $("#projects-container").append("<p>" + project.created_at, project.email, project.name, project.preferred_color, project.id, project.customer_comments, project.file_path, project.email + "</p>")
    })
  })
}