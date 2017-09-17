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

function openStatus(evt, statusName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(statusName).style.display = "block";
  evt.currentTarget.className += " active";
}