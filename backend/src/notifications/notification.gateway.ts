import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Role } from '../enums/user.enums';
import { NotificationMessage } from './notification.model';
import { NotificationType } from './dto/create-notification.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private users = new Map<number, Set<string>>();
  private roles = new Map<Role, Set<string>>();
  private departments = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    const userId = Number(client.handshake.query.userId);
    const role = client.handshake.query.role as Role;
    const department = client.handshake.query.department as string;

    if (!userId || isNaN(userId)) {
      console.warn(`❌ Client ${client.id} connected without valid userId`);
      client.disconnect();
      return;
    }

    if (!role || !Object.values(Role).includes(role)) {
      console.warn(`❌ Client ${client.id} connected without valid role`);
      client.disconnect();
      return;
    }

    if (!department) {
      console.warn(`❌ Client ${client.id} connected without department`);
      client.disconnect();
      return;
    }

    if (!this.users.has(userId)) this.users.set(userId, new Set());
    this.users.get(userId)!.add(client.id);

    if (!this.roles.has(role)) this.roles.set(role, new Set());
    this.roles.get(role)!.add(client.id);

    if (!this.departments.has(department)) this.departments.set(department, new Set());
    this.departments.get(department)!.add(client.id);

    Logger.log(`✅ Client connected: ${client.id} [userId: ${userId}, role: ${role}, department: ${department}]`);
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.users) {
      if (sockets.delete(client.id) && sockets.size === 0) {
        this.users.delete(userId);
      }
    }

    for (const sockets of this.roles.values()) {
      sockets.delete(client.id);
    }

    for (const sockets of this.departments.values()) {
      sockets.delete(client.id);
    }

    Logger.log(`❎ Client disconnected: ${client.id}`);
  }

  sendToUser(userId: number, notification: NotificationMessage) {
    const sockets = this.users.get(userId);
    sockets?.forEach((socketId) => {
      this.server.to(socketId).emit('notification', notification);
    });
  }

  sendToRole(role: Role, notification: NotificationMessage) {
    const sockets = this.roles.get(role);
    sockets?.forEach((id) => {
      this.server.to(id).emit('notification', notification);
    });
  }

  sendToDepartment(department: string, notification: NotificationMessage) {
    const sockets = this.departments.get(department);
    sockets?.forEach((id) => {
      this.server.to(id).emit('notification', notification);
    });
  }

  sendToAll(notification: NotificationMessage) {
    this.server.emit('notification', notification);
  }

  @SubscribeMessage('new-request')
  handleNewRequest(@MessageBody() data: { title: string; userId: number }) {
    const now = new Date();
    const baseNotification: NotificationMessage = {
      id: Date.now().toString(),
      title: 'Новая заявка',
      message: `Поступила новая заявка: "${data.title}"`,
      url: '/admin/requests',
      createdAt: now,
      isRead: false,
      type: NotificationType.REQUEST,
    };

    this.sendToRole(Role.admin, baseNotification);
    this.sendToRole(Role.superuser, baseNotification);

    this.sendToUser(data.userId, {
      ...baseNotification,
      title: 'Заявка создана',
      message: `Ваша заявка "${data.title}" была успешно отправлена.`,
    });

    Logger.log(`📨 Обработано событие new-request от userId=${data.userId}`);
  }

  @SubscribeMessage('ping')
  handlePing(@MessageBody() _data: any): string {
    return 'pong';
  }
}
