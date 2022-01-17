import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import * as cookie from 'cookie';
import { Logger, UseGuards } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { CommentsService } from './comments.service';
import { WsJwtGuard } from 'src/auth/ws-jwt.guard';
import { SocketType } from 'dgram';
import { OnEvent } from '@nestjs/event-emitter';

export type Comment = { message: string; idNews: number; };

@WebSocketGateway()
export class SocketCommentsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly commentsService: CommentsService) { }
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('addComment')
  async handleAddComment(client: Socket, comment: Comment) {
    const { idNews, message } = comment;
    // Извлекаем объект пользователя, который установлен в ws-jwt.guard.ts
    const userId: number = client.data.user.id;
    // Создаём комментарий
    const _comment = await this.commentsService.createComment(
      idNews,
      message,
      userId,
    );
    // Оповещаем пользователей комнаты о новом комментарии
    this.server.to(idNews.toString()).emit('newComment', _comment);
  }

  @OnEvent('comment.update')
  async handleEditComment(payload) {
    const { newsId } = payload;
    this.server.to(newsId.toString()).emit('updateComment', payload);
  }

  @OnEvent('comment.delete')
  async handleDeleteComment(payload) {
    const { newsId } = payload;
    this.server.to(newsId.toString()).emit('deleteComment', payload.id);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]): Promise<void> {
    const { newsId } = client.handshake.query;
    // После подключения пользователя к веб-сокету, подключаем его в комнату
    client.join(newsId);
    this.logger.log(`Client connected: ${client.id}`);
  }
}
