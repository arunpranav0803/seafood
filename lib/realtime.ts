import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID ?? '',
  key: process.env.PUSHER_KEY ?? '',
  secret: process.env.PUSHER_SECRET ?? '',
  cluster: process.env.PUSHER_CLUSTER ?? 'mt1',
  useTLS: true
});

export async function publishCatalogUpdate(payload: Record<string, unknown>) {
  await pusher.trigger('catalog-today', 'catalog.update', payload);
}

export async function publishOrderUpdate(orderId: string, payload: Record<string, unknown>) {
  await pusher.trigger(`private-order-${orderId}`, 'order.update', payload);
}

export async function publishNotification(userId: string, payload: Record<string, unknown>) {
  await pusher.trigger(`private-user-${userId}`, 'notification.created', payload);
}
