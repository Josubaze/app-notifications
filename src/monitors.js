import ExecutionOrder from './models/executionOrder.schema';
import Product from './models/product.schema';
import Notification from './models/notification.schema';
import User from './models/user.schema';
import Invoice from './models/invoice.schema';
import PurchaseOrder from './models/purchaseOrder.schema';
import Report from './models/report.schema';

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
              user: user._id,
              message,
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
        const message = `Nueva Orden de Ejecución Generada: Nº${newOrder.form.num}`;
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

  // Monitoreo de facturas
  const invoiceChangeStream = Invoice.watch();
  invoiceChangeStream.on('change', async (change) => {
    if (change.operationType === 'insert') {
      try {
        const newInvoice = change.fullDocument;
        const message = `Nueva Factura Generada: Nº${newInvoice.form.num}`;
        const administrators = await User.find({ role: "administrador" });

        for (const user of administrators) {
          await Notification.create({
            identifier: newInvoice._id,
            user: user._id,
            message,
            seen: false,
          });

          const notifications = await Notification.find({ user: user._id });
          io.to(user._id.toString()).emit('userNotifications', notifications);
        }
      } catch (error) {
        console.error('Error en el Change Stream de facturas:', error);
      }
    }
  });

  // Monitoreo de orden de compra
  const purchaseOrderChangeStream = PurchaseOrder.watch();
  purchaseOrderChangeStream.on('change', async (change) => {
    if (change.operationType === 'insert') {
      try {
        const newPurchaseOrder = change.fullDocument;
        const message = `Nueva Orden de Compra Generada: Nº${newPurchaseOrder.form.num}`;
        const administrators = await User.find({ role: "administrador" });

        for (const user of administrators) {
          await Notification.create({
            identifier: newPurchaseOrder._id,
            user: user._id,
            message,
            seen: false,
          });

          const notifications = await Notification.find({ user: user._id });
          io.to(user._id.toString()).emit('userNotifications', notifications);
        }
      } catch (error) {
        console.error('Error en el Change Stream de órdenes de compra:', error);
      }
    }
  });

  // Monitoreo de infomes
  const reportChangeStream = Report.watch();
  reportChangeStream.on('change', async (change) => {
    if (change.operationType === 'insert') {
      try {
        const newReport = change.fullDocument;
        const message = `Nuevo Informe Generado: Nº${newReport.form.num}`;
        const administrators = await User.find({ role: "administrador" });

        for (const user of administrators) {
          await Notification.create({
            identifier: newReport._id,
            user: user._id,
            message,
            seen: false,
          });

          const notifications = await Notification.find({ user: user._id });
          io.to(user._id.toString()).emit('userNotifications', notifications);
        }
      } catch (error) {
        console.error('Error en el Change Stream de infomes:', error);
      }
    }
  });
};
