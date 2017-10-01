const baseFileUrl = "https://www.dropbox.com/home/Apps/threedqueue?preview="

function projectTableHtml(project, comment, projectColor){
  return `<tr class="approve-initials" id="approve-${project.id}-form">
            <td colspan="7">
              <form>
                <label>Initials</label>
                <input type="text" class="form-control" name="initials" id="initials" required>
                <button type="submit" value="Submit" id="approve-button"><i class="fa fa-check fa-2x" aria-hidden="true" style="color: green;"></i></button>
              </form>
            </td>
          </tr>
          <tr class="project-listing" id="approve-${project.id}-row">
          <td class="listing-date">
            ${project.created_at.substring(0, 10)}
          </td>
          <td class="listing-name">
            ${project.name}
          </td>
          <td class="listing-email">
            ${project.email}
          </td>
          <td class="listing-file">
            <a href="${baseFileUrl}${project.file_path}" id="paperclip-link" target="_blank"><i class="fa fa-paperclip fa-2x" aria-hidden="true"></i></a>
          </td>
          <td class="listing-color" style="background-color:${projectColor};">
          </td>
          <td class="listing-comments" id="comment-icon-${project.id}">
            <i class="fa fa-comment-o fa-2x" aria-hidden="true" style="${comment}"></i>
          </td>
          <td class="listing-approval" id="approve-${project.id}">
            <i class="fa fa-check fa-2x" aria-hidden="true" style="color: green;"></i>
          </td>
          <td class="listing-rejection" id="reject-${project.id}">
            <i class="fa fa-ban fa-2x" aria-hidden="true" style="color: red;"></i>
          </td>
          </tr>
          <tr id="comment-${project.id}" style="display:none;">
          <td colspan="7">${project.customer_comments}</td>
          </tr>`
}