import { Update, Ctx, Start, Help, Command, On } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { DatabaseService } from '../database/database.service';
import { Role } from '../enums/user.enums';
import { TelegramService } from './telegram.service';

@Update()
export class TelegramUpdate {
  constructor(
    private readonly db: DatabaseService,
    private readonly telegramService: TelegramService
  ) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    await ctx.reply(
      '👋 Добро пожаловать в помощник ИТ-отдела!\n\nИспользуйте /help для просмотра доступных команд.'
    );
  }

  @Help()
  async onHelp(@Ctx() ctx: Context) {
    await ctx.reply(
      '📌 Доступные команды:\n' +
      '/start - Начать работу\n' +
      '/help - Список команд\n' +
      '/link ВАШ_КОД - Привязать Telegram к аккаунту\n' +
      '/myrequests - Показать ваши заявки\n' +
      '/new ТЕКСТ - Создать новую заявку\n' +
      '/status ID - Проверить статус заявки\n' +
      '/cancel ID - Отменить заявку (если она NEW)\n' +
      '/admin - Админ-панель (для админов)\n' +
      '/broadcast ТЕКСТ - Рассылка всем пользователям (только для админов)'
    );
  }

  @Command('admin')
  async onAdmin(@Ctx() ctx: Context) {
    const telegramId = ctx.from?.id;
    if (!telegramId) return ctx.reply('❗ Telegram ID не определён.');

    const isAdmin = await this.checkUserRole(telegramId, [Role.admin, Role.superuser]);
    if (!isAdmin) return ctx.reply('⛔️ Команда доступна только администраторам.');

    return ctx.reply('🛠 Админ-панель доступна.\n\n/droadcast ТЕКСТ — рассылка всем');
  }

  @Command('broadcast')
  async onBroadcast(@Ctx() ctx: Context) {
    const telegramId = ctx.from?.id;
    const msg = ctx.message as any;
    const args = msg?.text?.split(' ').slice(1);
    const text = args?.join(' ');

    if (!telegramId || !text) return ctx.reply('📢 Использование: /broadcast ТЕКСТ');

    const isAdmin = await this.checkUserRole(telegramId, [Role.admin, Role.superuser]);
    if (!isAdmin) return ctx.reply('⛔️ Только администраторы могут делать рассылки.');

    await this.telegramService.broadcastToAll(`📢 <b>Объявление</b>\n\n${text}`);
    return ctx.reply('✅ Рассылка выполнена.');
  }

  @Command('link')
  async link(@Ctx() ctx: Context) {
    const msg = ctx.message as any;
    const args = msg?.text?.split(' ');
    const telegramId = ctx.from?.id;

    if (!telegramId || args.length < 2) {
      return ctx.reply('🔗 Использование: /link ВАШ_КОД');
    }

    const linkToken = args[1];

    const user = await this.db.user.findFirst({
      where: { snils: linkToken },
    });

    if (!user) {
      return ctx.reply('❗ Код не найден. Проверьте правильность.');
    }

    await this.db.user.update({
      where: { id: user.id },
      data: { telegramUserId: BigInt(telegramId) },
    });

    return ctx.reply(`✅ Аккаунт ${user.lastName} ${user.firstName} привязан к Telegram.`);
  }

  @Command('myrequests')
  async myRequests(@Ctx() ctx: Context) {
    const telegramId = ctx.from?.id;
    if (!telegramId) return ctx.reply('❗ Telegram ID не определён.');

    const user = await this.db.user.findUnique({
      where: { telegramUserId: BigInt(telegramId) },
      include: {
        requests: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });

    if (!user) return ctx.reply('🚫 Ваш Telegram не привязан. Используйте /link КОД.');

    if (user.requests.length === 0) {
      return ctx.reply('📭 У вас нет заявок.');
    }

    const response = user.requests
      .map(r => `📝 *${r.title}*\n📌 Статус: ${r.status}\n📅 ${r.createdAt.toLocaleString()}`)
      .join('\n\n');

    return ctx.replyWithMarkdown(response);
  }

  @Command('new')
  async newRequest(@Ctx() ctx: Context) {
    const telegramId = ctx.from?.id;
    const msg = ctx.message as any;
    const args = msg?.text?.split(' ').slice(1);
    const content = args?.join(' ');

    if (!telegramId || !content) {
      return ctx.reply('📝 Использование: /new Текст вашей заявки');
    }

    const user = await this.db.user.findUnique({
      where: { telegramUserId: BigInt(telegramId) },
    });

    if (!user) {
      return ctx.reply('🚫 Ваш Telegram не привязан. Используйте /link КОД.');
    }

    const request = await this.db.request.create({
      data: {
        title: content.slice(0, 100),
        content,
        userId: user.id,
        source: 'TELEGRAM',
      },
    });

    return ctx.reply(`✅ Заявка #${request.id} создана!`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📄 Статус заявки', callback_data: `status_${request.id}` }],
          [{ text: '❌ Отменить заявку', callback_data: `cancel_${request.id}` }],
        ],
      },
    });
  }

  @Command('status')
  async status(@Ctx() ctx: Context) {
    const msg = ctx.message as any;
    const args = msg?.text?.split(' ');
    const id = Number(args?.[1]);
    const telegramId = ctx.from?.id;

    if (!telegramId || !id || isNaN(id)) {
      return ctx.reply('ℹ️ Использование: /status НОМЕР_ЗАЯВКИ');
    }

    const request = await this.db.request.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!request || BigInt(request.user.telegramUserId || 0) !== BigInt(telegramId)) {
      return ctx.reply('🚫 Заявка не найдена или не ваша.');
    }

    return ctx.reply(
      `📝 Заявка #${request.id}\n` +
      `📌 Статус: ${request.status}\n` +
      `📅 Создана: ${request.createdAt.toLocaleString()}`
    );
  }

  @Command('cancel')
  async cancel(@Ctx() ctx: Context) {
    const msg = ctx.message as any;
    const args = msg?.text?.split(' ');
    const id = Number(args?.[1]);
    const telegramId = ctx.from?.id;

    if (!telegramId || !id || isNaN(id)) {
      return ctx.reply('❗ Использование: /cancel НОМЕР_ЗАЯВКИ');
    }

    const request = await this.db.request.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!request || BigInt(request.user.telegramUserId || 0) !== BigInt(telegramId)) {
      return ctx.reply('🚫 Заявка не найдена или не ваша.');
    }

    if (request.status !== 'NEW') {
      return ctx.reply('❗ Заявку можно отменить только в статусе NEW.');
    }

    await this.db.request.update({
      where: { id },
      data: { status: 'REJECTED' },
    });

    return ctx.reply(`✅ Заявка #${request.id} отменена.`);
  }

  @On('callback_query')
  async handleCallback(@Ctx() ctx: Context) {
    const cb = ctx.callbackQuery as any;
    const data = cb?.data;
    const telegramId = ctx.from?.id;

    if (!data || !telegramId) return;

    const [action, idStr] = data.split('_');
    const requestId = Number(idStr);

    const request = await this.db.request.findUnique({
      where: { id: requestId },
      include: { user: true },
    });

    if (!request || BigInt(request.user.telegramUserId || 0) !== BigInt(telegramId)) {
      return ctx.reply('🚫 Недостаточно прав.');
    }

    if (action === 'status') {
      return ctx.reply(
        `📄 Заявка #${request.id}\n` +
        `Статус: ${request.status}\n` +
        `Создана: ${request.createdAt.toLocaleString()}`
      );
    }

    if (action === 'cancel') {
      if (request.status !== 'NEW') {
        return ctx.reply('❗ Заявку можно отменить только в статусе NEW.');
      }

      await this.db.request.update({
        where: { id: request.id },
        data: { status: 'REJECTED' },
      });

      return ctx.reply(`✅ Заявка #${request.id} отменена.`);
    }
  }

  /** 🔐 Проверка роли пользователя */
  private async checkUserRole(telegramId: number, roles: Role[]): Promise<boolean> {
    const user = await this.db.user.findFirst({
      where: {
        telegramUserId: BigInt(telegramId),
        role: { in: roles },
      },
    });

    return !!user;
  }
}
