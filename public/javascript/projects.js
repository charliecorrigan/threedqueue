const environment = "development"
// const environment = "production"

const baseApiUrl = {
  'production': "https://threedqueue.herokuapp.com/api/v1",
  'development': "http://localhost:8080/api/v1"
}

const assignColor = {
  0: 'blue',
  1: 'yellow',
  2: 'red',
  3: 'white',
  4: 'black',
  5: 'purple',
  6: 'orange',
  7: 'green',
}

$(document).ready(function(){
  renderProjects();
});

renderProjects = function(){
  $.getJSON(baseApiUrl[environment] + '/projects/awaiting')
  .then(function(projects){
    projects.forEach(function(project){
      $("#projects-container").append('<tr class="project-listing"><td class="listing-date">' + project.created_at.substring(0, 10) + '</td><td class="listing-name">' + project.name + '</td><td class="listing-email">' + project.email + '</td><td class="listing-color" style="background-color:' + assignColor[project.preferred_color] + ';"></td><td class="listing-file">' + project.file_path + '</td><td class="listing-comments">' + project.customer_comments + "</td></ul>")
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