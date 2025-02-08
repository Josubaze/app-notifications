import Notification from './models/notification.schema';
import mongoose from "mongoose";

export default (io) => {
  io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);

    // Evento para marcar una notificación como vista
    socket.on('markNotificationAsSeen', async (notificationId) => {
      try {
        const updatedNotification = await Notification.findByIdAndUpdate(
          notificationId,
          { seen: true, seenAt: new Date() },
          { new: true }
        );
        socket.emit('notificationUpdated', updatedNotification);
      } catch (error) {
        console.error('Error al actualizar la notificación:', error);
        socket.emit('error', { message: 'Error al actualizar la notificación.' });
      }
    });

    // Evento para obtener las notificaciones de un usuario
    socket.on('getUserNotifications', async (userId) => {
      try {
        const notifications = await Notification.find({ user: userId });
    
        socket.emit('userNotifications', notifications);
      } catch (error) {
        console.error('Error al obtener las notificaciones:', error);
        socket.emit('error', { message: 'Error al obtener las notificaciones.' });
      }
    });


    // Evento de desconexión
    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${socket.id}`);
    });
  });
};
