const environment = "development"
// const environment = "production"

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
  toggleComment();
  listenForApprove()
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
      $("#projects-container").append(`<tr class="approve-initials" id="approve-${project.id}-form">
                                        <td colspan="7">
                                          <form>
                                            <label>Initials</label>
                                            <input type="text" class="form-control" name="initials" id="initials" required>
                                            <button type="submit" value="Submit" id="approve-button"><i class="fa fa-check fa-2x" aria-hidden="true" style="color: green;"></i></button>
                                          </form>
                                        </td>
                                      </tr>
                                      <tr class="project-listing" id="approve-${project.id}-row"><td class="listing-date">`
                                      + project.created_at.substring(0, 10) 
                                      + '</td><td class="listing-name">' 
                                      + project.name 
                                      + '</td><td class="listing-email">' 
                                      + project.email 
                                      + `</td><td class="listing-file"><a href="`
                                      + baseFileUrl + project.file_path
                                      + `" id="paperclip-link" target="_blank"><i class="fa fa-paperclip fa-2x" aria-hidden="true"></i></a>
                                      </td><td class="listing-color" style="background-color:`
                                      + assignColor[project.preferred_color] 
                                      + `;"></td><td class="listing-comments" id="comment-icon-${project.id}"><i class="fa fa-comment-o fa-2x" aria-hidden="true" style="`
                                      + comment
                                      + `"></i></td>
                                      <td class="listing-approval" id="approve-${project.id}"><i class="fa fa-check fa-2x" aria-hidden="true" style="color: green;"></i>
                                      <i class="fa fa-ban fa-2x" aria-hidden="true" style="color: red;"></i></td></tr>
                                      <tr id="comment-${project.id}" style="display:none;"><td colspan="7">${project.customer_comments}</td></tr>`)
    })
  })
}

listenForApprove = function(){
  $("#projects-container").on('click', '.listing-approval', function(){
    $(`#${this.id}-form`).show();
    $(`#${this.id}-row`).hide();
    $("#projects-container").on('click', '#approve-button', function(){
      event.preventDefault();
      $(`#${event.target.closest('.approve-initials').id.split('-form')[0]}-form`).hide();
      const id = event.target.closest('.approve-initials').id.split('-')[1];
      const initials = this.previousElementSibling.value;
      const params = {approval_initials: initials, approval: 1, id: id};
      $.ajax({
        type: "PUT",
        url: baseApiUrl[environment] + '/projects/' + id,
        data: params
      }).then(function(result){
        console.log("I think it posted, yo.")
      }).catch(function(error){
        console.log(error);
      });
    })
  })
}

handleError = function(error) {
  console.error(error);
};

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

function toggleComment(){
  $('#projects-container').on('click', '.listing-comments', function(event){
    $(`#comment-${event.currentTarget.id.split("-")[2]}`).toggle();
  })
}
