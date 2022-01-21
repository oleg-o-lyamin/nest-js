('use strict');

const e = React.createElement;

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      message: '',
    };

    this.getUser().then((data) => {
      this.userId = data.id;
      this.userRole = data.role;
    });

    // Парсим URL, извлекаем id новости
    this.idNews = parseInt(window.location.href.split('/').reverse()[0]);
    // Указываем адрес сокет сервера
    this.socket = io('', {
      query: {
        // Устанавливаем id новости, он потребуется серверу для назначения комнаты пользователю
        newsId: this.idNews,
      },
    });
  }

  componentDidMount() {
    // Вызываем метод получения всех комментариев
    this.getAllComments();
    this.socket.emit('create', this.idNews.toString());
    this.socket.on('newComment', (message) => {
      const comments = this.state.comments;
      comments.push(message);
      this.setState(comments);
    });
    this.socket.on('updateComment', (comment) => {
      this.state.comments.map((c, i) => {
        if (c.id == comment.commentId) {
          this.state.comments[i].message = comment.message;
          this.setState(this.state.comments);
        }
      });
    });
    this.socket.on('deleteComment', (id) => {
      const comments = this.state.comments.filter((c) => c.id != id);
      this.setState({ comments });
    });
  }

  onChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  getAllComments = async () => {
    const response = await fetch(`/news/api/all/${this.idNews}/comments`, {
      method: 'GET',
    });

    if (response.ok) {
      const comments = await response.json();
      this.setState({ comments });
    }
  };

  getUser = async () => {
    const response = await fetch(`/users/api/user`, {
      method: 'GET',
    });

    if (response.ok) {
      return await response.json();
    }

    return { id: -1, role: 'none' };
  };

  sendMessage = () => {
    // Отправляем на сервер событие добавления комментария
    this.socket.emit('addComment', {
      idNews: this.idNews,
      message: this.state.message,
    });
  };

  render() {
    return (
      <div>
        <div class="row g-2">
          <div class="col-sm-10">
            <input
              type="text"
              class="form-control"
              id="message"
              name="message"
              placeholder="Текст комментария..."
              value={this.state.message}
              onChange={this.onChange}
            ></input>
          </div>
          <div class="col-auto">
            <button class="btn btn-primary mb-3" onClick={this.sendMessage}>
              Отправить
            </button>
          </div>
        </div>

        {this.state.comments.map((comment, index) => {
          let buttons;
          if (this.userId == comment.user.id || this.userRole == 'admin') {
            buttons = (
              <div>
                <a href={'/comments/edit/' + comment.id}>
                  <small>Редактировать</small>
                </a>
                <span class="m-1 text-muted">&#183;</span>
                <form
                  method="POST"
                  action={'/comments/delete/' + comment.id}
                  style={{ display: 'inline' }}
                >
                  <button
                    type="submit"
                    class="btn btn-link"
                    role="link"
                    style={{
                      outline: 'none !important',
                      padding: '0',
                      border: '0',
                      verticalAlign: 'baseline',
                    }}
                  >
                    <small>Удалить</small>
                  </button>
                </form>
              </div>
            );
          }

          return (
            <div style={{ paddingBottom: 20 + 'px' }} class="d-flex">
              <img
                class="rounded-circle m-1"
                alt="avatar"
                src={comment.user.avatar}
                width="20"
                height="20"
              ></img>
              <div>
                <div>
                  <small class="text-muted">{comment.user.firstName}</small>
                  <span class="m-1 text-muted">&#183;</span>
                  <small class="text-muted">{comment.createdAt}</small>
                </div>
                <div>{comment.message}</div>
                {buttons}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

const domContainer = document.querySelector('#app');
ReactDOM.render(e(Comments), domContainer);
