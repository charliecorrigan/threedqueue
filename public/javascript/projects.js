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
  openStatus(event, 'waiting-for-approval')
  toggleComment();
  listenForApprove()
});

openStatus = function(event, status){
  updateTabStatus(status)
  $.getJSON(baseApiUrl[environment] + '/projects/' + status)
  .then(function(projects){
    $("#projects-container").empty();
    projects.forEach(function(project){
      const comment = commentDisplay(project.customer_comments.length)
      const projectColor = assignColor[project.preferred_color]
      $("#projects-container").append(projectTableHtml(project, comment, projectColor))
    })
  })
}

commentDisplay = function(commentLength){
  if (commentLength > 0){
    return "display: inline;"
  } else {
    return "display: none;"
  }
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

toggleComment = function(){
  $('#projects-container').on('click', '.listing-comments', function(event){
    $(`#comment-${event.currentTarget.id.split("-")[2]}`).toggle();
  })
}

updateTabStatus = function(status){
  const tablinks = $('.tablinks')
  $.each(tablinks, function (index, value) {
    currentTab = value.innerHTML.replace(/\s+/g, '-').toLowerCase()
    if (currentTab == status) {
      $(this).addClass('active')
    } else {
      $(this).removeClass('active')
    }
  });
}