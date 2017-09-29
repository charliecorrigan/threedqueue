$(document).ready(function(){
  $('.index-card').on('mouseover', function(){
    $(this).children('.index-card-title').hide();
    $(this).children('.index-card-description').css('display', 'flex');
  })
  $('.index-card').on('mouseout', function(){
    $(this).children('.index-card-title').show();
    $(this).children('.index-card-description').hide();
  })
  $('.index-card').on('click', function(){
    $('.more-details-container').children().hide()
    $('.more-details-container').children(`#content-${this.id}`).show()
  })
});