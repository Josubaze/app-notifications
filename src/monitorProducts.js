import Notification from './models/notification.schema';
import User from './models/user.schema'; // Asumo que tienes un modelo para los usuarios

export const monitorProducts = async (io) => {
  const productChangeStream = Product.watch();

  productChangeStream.on('change', async (change) => {
    if (change.operationType === 'update') {
      try {
        const updatedProduct = await Product.findById(change.documentKey._id);
        if (updatedProduct.quantity < updatedProduct.minStock) {
          const message = `El producto ${updatedProduct.name} está por debajo del stock mínimo.`;

          // Obtenemos todos los usuarios
          const users = await User.find();

          // Para cada usuario...
          for (const user of users) {
            // Verificamos si ya existe la notificación
            const existingNotification = await Notification.findOne({
              product: updatedProduct._id,
              user: user._id,
              message: message
            });

            if (!existingNotification) {
              await Notification.create({
                product: updatedProduct._id,
                user: user._id,
                message,
                seen: false,
              });
              console.log(`Notificación creada para el producto ${updatedProduct.name} para el usuario ${user.username}`);

              // Obtenemos las notificaciones actualizadas para este usuario
              const notifications = await Notification.find({ user: user._id });
              
              // Emitimos el evento solo a la sala de este usuario
              io.to(user._id.toString()).emit("userNotifications", notifications);
            } else {
              console.log(`Ya existe una notificación para el producto ${updatedProduct.name} para el usuario ${user.username}`);
            }
          }
        }
      } catch (error) {
        console.error('Error en el Change Stream de productos:', error);
      }
    }
  });
};
