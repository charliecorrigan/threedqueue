// const environment = "development"
const environment = "production"

const baseApiUrl = {
  'production': "https://threedqueue.herokuapp.com/api/v1",
  'development': "http://localhost:8080/api/v1"
}

const baseFileUrl = "https://www.dropbox.com/home/Apps/threedqueue?preview="

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
  // openStatus(event, 'waiting-for-approval')
});

renderProjects = function(){
  $.getJSON(baseApiUrl[environment] + '/projects/awaiting')
  .then(function(projects){
    projects.forEach(function(project){
      let comment;
      if(project.customer_comments.length > 0){
        comment = "display: inline;"
      } else {
        comment = "display: none;"
      }
      $("#projects-container").append('<tr class="project-listing"><td class="listing-date">'
                                      + project.created_at.substring(0, 10) 
                                      + '</td><td class="listing-name">' 
                                      + project.name 
                                      + '</td><td class="listing-email">' 
                                      + project.email 
                                      + `</td><td class="listing-file">
                                      <i class="fa fa-paperclip fa-2x" aria-hidden="true"></i>
                                      </td><td class="listing-color" style="background-color:`
                                      + assignColor[project.preferred_color] 
                                      + `;"></td><td class="listing-comments"><i class="fa fa-comment-o fa-2x" aria-hidden="true" style="`
                                      + comment
                                      + `"></i></td>
                                      <td class="listing-approval"><i class="fa fa-check fa-2x" aria-hidden="true" style="color: green;"></i>
                                      <i class="fa fa-ban fa-2x" aria-hidden="true" style="color: red;"></i></td></tr>`)
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