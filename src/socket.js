import Notification from './models/notification.schema';

export default (io) => {
  io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id}`);


    // Escucha para unir al usuario a su sala
    socket.on('join', (userId) => {
      socket.join(userId);
      console.log(`Socket ${socket.id} se unió a la sala ${userId}`);
    });

    // Evento para marcar una notificación como vista
    socket.on('markNotificationAsSeen', async (data) => {
      // Se espera que 'data' contenga el 'notificationId' y el 'userId'
      const { _id, user } = data;
      try {
        await Notification.findByIdAndUpdate(
          _id,
          { seen: true, seenAt: new Date() },
          { new: true }
        );
        // Tras actualizar la notificación, se obtienen todas las notificaciones actualizadas del usuario
        const notifications = await Notification.find({ user: user });
        // Emite el evento a la sala del usuario, de forma que todos sus clientes conectados reciban la actualización
        io.to(user).emit('userNotifications', notifications);
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
