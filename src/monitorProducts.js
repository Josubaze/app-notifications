import Product from './models/product.schema';
import Notification from './models/notification.schema';
import User from './models/user.schema'; // Importamos el modelo de usuario

export const monitorProducts = async () => {
  const productChangeStream = Product.watch();

  productChangeStream.on('change', async (change) => {
    if (change.operationType === 'update') {
      try {
        const updatedProduct = await Product.findById(change.documentKey._id);
        if (updatedProduct.quantity < updatedProduct.minStock) {
          const message = `El producto ${updatedProduct.name} está por debajo del stock mínimo.`;
          
          // Obtenemos todos los usuarios
          const users = await User.find();

          // Creamos una notificación para cada usuario si no existe ya una con el mismo mensaje para ese producto
          for (const user of users) {
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
                seen: false, // Asignamos false o el valor por defecto que consideres
              });
              console.log(`Notificación creada para el producto ${updatedProduct.name} para el usuario ${user.username}`);
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
