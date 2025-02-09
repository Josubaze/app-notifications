import Notification from './models/notification.schema';

export default (io) => {
  io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);


    socket.on('join', async (userId) => {
      socket.join(userId);
      console.log(`Socket ${socket.id} se unió a la sala ${userId}`);
    
      try {
        // Obtener las notificaciones del usuario inmediatamente después de unirse
        const notifications = await Notification.find({ user: userId });
        socket.emit('userNotifications', notifications);
      } catch (error) {
        console.error('Error al obtener las notificaciones iniciales:', error);
        socket.emit('error', { message: 'Error al obtener las notificaciones iniciales.' });
      }
    });
    

    // Evento para marcar una notificación como vista
    socket.on('markNotificationAsSeen', async (notificationId, userId) => {
      try {
        await Notification.findByIdAndUpdate(
          notificationId,
          { seen: true, seenAt: new Date() },
          { new: true }
        );
        // Tras actualizar la notificación, se obtienen todas las notificaciones actualizadas del usuario
        const notifications = await Notification.find({ user: userId });
        // Emite el evento a la sala del usuario, de forma que todos sus clientes conectados reciban la actualización
        io.to(userId).emit('userNotifications', notifications);
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
