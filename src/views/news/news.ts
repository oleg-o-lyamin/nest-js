import { News } from '../../news/news.interface';
import { Comment } from '../../news/comments/comments.interface';

function renderNext(news: News, comments: Comment[], level = 0): string {
  let html = '';
  if (comments)
    comments.forEach((comment) => {
      html += `<div style="padding-left: ${level}px;">
        <span><img src="http://localhost:3000/${
          comment.avatar
        }" style="width:25px; height:25px;"></span>
        <span>${comment.message}</span>
        <a href="#" style="text-decoration:none;" onclick="getElementById('form-${
          news.id
        }-${comment.id}').style.display='block'">+</a>|
        <a href="#" style="text-decoration:none;" onclick="getElementById('form-${
          news.id
        }-${comment.id}-edit').style.display='block'">edit</a>|
        <a href="#" style="text-decoration:none;" onclick="getElementById('form-${
          news.id
        }-${comment.id}-delete').submit()">X</a>
        <form style='display: none;' method='POST' action='/news/${
          news.id
        }/delete/${comment.id}' id='form-${news.id}-${
        comment.id
      }-delete'></form>
        <form style='display: none;' method='POST' action='/news/${
          news.id
        }/new/${comment.id}' id='form-${news.id}-${
        comment.id
      }' enctype='multipart/form-data'>
          <div>Text: <input type="text" name="content" /></div>
          <div>File: <input type="file" name="avatar" /></div>
          <div><input type="submit" /></div>
        </form>
        <form style='display: none;' method='POST' action='/news/${
          news.id
        }/edit/${comment.id}' id='form-${news.id}-${comment.id}-edit'>
          <input type="text" name="content" value="${
            comment.message
          }" /><input type="submit" />
        </form>
      </div>${renderNext(news, comment.replies, level + 20)}`;
    });

  return html;
}

export function renderNews(news: News): string {
  let commentSection = '';
  if (news.comments) {
    commentSection += renderNext(news, news.comments);
  } else commentSection = `<div>Нет комментариев</div>`;

  commentSection += `<a href="#" style="text-decoration:none;" onclick="getElementById('form-${news.id}').style.display='block'">+</a>
  <form style='display: none;' method='POST' action='/news/${news.id}' id='form-${news.id}' enctype='multipart/form-data'>
    <div>Text: <input type="text" name="content" /></div>
    <div>File: <input type="file" name="avatar" /></div>
    <div><input type="submit" /></div>
  </form>`;

  return `
    <h1>${news.title}</h1>
    
    <div>
      ${news.cover ? `<img src="${news.cover}" alt="...">` : ''}
      <div class="card-body">
        <h5 class="card-title">${news.title}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${news.author}</h6>
        <p class="card-text">${news.description}</p>
        <h5>Комментарии</h5>
        ${commentSection}
      </div>
    </div>
`;
}
