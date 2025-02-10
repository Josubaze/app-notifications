import ExecutionOrder from './models/executionOrder.schema';
import Product from './models/product.schema';
import Notification from './models/notification.schema';
import User from './models/user.schema';

export const monitors = async (io) => {
  console.log('Monitores de cambios activados.');

  // Monitoreo de productos
  const productChangeStream = Product.watch();
  productChangeStream.on('change', async (change) => {
    if (change.operationType === 'update') {
      try {
        const updatedProduct = await Product.findById(change.documentKey._id);
        if (updatedProduct.quantity < updatedProduct.minStock) {
          const message = `El producto ${updatedProduct.name} está por debajo del stock mínimo.`;
          const users = await User.find();

          for (const user of users) {
            const existingNotification = await Notification.findOne({
              identifier: updatedProduct._id,
            });

            if (!existingNotification) {
              await Notification.create({
                identifier: updatedProduct._id,
                user: user._id,
                message,
                seen: false,
              });

              const notifications = await Notification.find({ user: user._id });
              io.to(user._id.toString()).emit('userNotifications', notifications);
            }
          }
        }
      } catch (error) {
        console.error('Error en el Change Stream de productos:', error);
      }
    }
  });

  // Monitoreo de órdenes de ejecución
  const executionOrderChangeStream = ExecutionOrder.watch();
  executionOrderChangeStream.on('change', async (change) => {
    if (change.operationType === 'insert') {
      try {
        const newOrder = change.fullDocument;
        const message = `Nueva Orden de Ejecución creada: Nº${newOrder.form.num}`;
        const leaders = await User.find({ role: "lider" });

        for (const user of leaders) {
          await Notification.create({
            identifier: newOrder._id,
            user: user._id,
            message,
            seen: false,
          });

          const notifications = await Notification.find({ user: user._id });
          io.to(user._id.toString()).emit('userNotifications', notifications);
        }
      } catch (error) {
        console.error('Error en el Change Stream de órdenes de ejecución:', error);
      }
    }
  });
};
