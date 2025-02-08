import Product from './models/product.schema';
import Notification from './models/notification.schema';

export default (io) => {
  io.on('connection', () => {
    // Evento para emitir productos al conectarse
    const emitProducts = async () => {
      const products = await Product.find();
      io.emit('loadProducts', products);
    };
    emitProducts();

    // Evento para marcar una notificación como vista (ya explicado anteriormente)
    io.on('markNotificationAsSeen', async (notificationId) => {
      try {
        const updatedNotification = await Notification.findByIdAndUpdate(
          notificationId,
          { 
            seen: true, 
            seenAt: new Date() // Se asigna la fecha actual para iniciar el contador del TTL
          },
          { new: true }
        );
        io.emit('notificationUpdated', updatedNotification);
      } catch (error) {
        console.error('Error al actualizar la notificación:', error);
        io.emit('error', { message: 'Error al actualizar la notificación.' });
      }
    });

    // Nuevo evento para obtener las notificaciones de un usuario
    // Se espera que el cliente envíe el _id del usuario como parámetro
    io.on('getUserNotifications', async (userId) => {
      try {
        // Buscamos todas las notificaciones que correspondan a ese usuario
        const notifications = await Notification.find({ user: userId });
        // Emitimos las notificaciones al cliente
        io.emit('userNotifications', notifications);
      } catch (error) {
        console.error('Error al obtener las notificaciones:', error);
        io.emit('error', { message: 'Error al obtener las notificaciones.' });
      }
    });
  });
};
