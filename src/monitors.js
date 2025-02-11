import ExecutionOrder from './models/executionOrder.schema';
import Product from './models/product.schema';
import Notification from './models/notification.schema';
import User from './models/user.schema';
import Invoice from './models/invoice.schema';
import PurchaseOrder from './models/purchaseOrder.schema';
import Report from './models/report.schema';
import CreditNote from './models/creditNote.schema';

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
    try {
      if (change.operationType === 'insert') {
        // Caso para cuando se inserta una nueva orden de ejecución
        const newOrder = change.fullDocument;
        const message = `Nueva Orden de Ejecución Generada: Nº${newOrder.form.num}`;
        const leaders = await User.find({ role: "lider" });

        for (const user of leaders) {
          const existingNotification = await Notification.findOne({
            identifier: newOrder._id,
            user: user._id,
            message,
          });

          if (!existingNotification) {
            await Notification.create({
              identifier: newOrder._id,
              user: user._id,
              message,
              seen: false,
            });

            const notifications = await Notification.find({ user: user._id });
            io.to(user._id.toString()).emit('userNotifications', notifications);
          }
        }
      } else if (change.operationType === 'update') {
        // Caso para cuando se actualiza una orden de ejecución
        const updatedOrder = await ExecutionOrder.findById(change.documentKey._id);

        if (updatedOrder.state === 'Finalizado') {
          const message = `La Orden de Ejecución Nº${updatedOrder.form.num} ha sido finalizada.`;
          const users = await User.find();

          for (const user of users) {
            // Verificar si la notificación ya existe
            const existingNotification = await Notification.findOne({
              identifier: updatedOrder._id,
              user: user._id,
              message,
            });

            if (!existingNotification) {
              // Comprobar si la orden de ejecución fue creada hace más de 6 días
              const orderCreationDate = new Date(updatedOrder.form.dateCreation);
              const currentDate = new Date();
              const differenceInDays = Math.floor((currentDate - orderCreationDate) / (1000 * 3600 * 24));

              if (differenceInDays <= 6) {
                // Solo crear la notificación si la orden fue creada hace menos de 6 días
                await Notification.create({
                  identifier: updatedOrder._id,
                  user: user._id,
                  message,
                  seen: false,
                });

                const notifications = await Notification.find({ user: user._id });
                io.to(user._id.toString()).emit('userNotifications', notifications);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error en el Change Stream de órdenes de ejecución:', error);
    }
  });


  // Monitoreo de facturas
  const invoiceChangeStream = Invoice.watch();
  invoiceChangeStream.on('change', async (change) => {
    try {
      if (change.operationType === 'insert') {
        // Caso para cuando se inserta una nueva factura
        const newInvoice = change.fullDocument;
        const message = `Nueva Factura Generada: Nº${newInvoice.form.num}`;
        const administrators = await User.find({ role: "administrador" });

        for (const user of administrators) {
          const existingNotification = await Notification.findOne({
            identifier: newInvoice._id,
            user: user._id,
            message,
          });

          if (!existingNotification) {
            await Notification.create({
              identifier: newInvoice._id,
              user: user._id,
              message,
              seen: false,
            });

            const notifications = await Notification.find({ user: user._id });
            io.to(user._id.toString()).emit('userNotifications', notifications);
          }
        }
      } else if (change.operationType === 'update') {
        // Caso para cuando se actualiza una factura
        const updatedInvoice = await Invoice.findById(change.documentKey._id);

        if (updatedInvoice.state === 'Pagada') {
          const message = `La factura Nº${updatedInvoice.form.num} ha sido pagada.`;
          const administrators = await User.find({ role: "administrador" });

          for (const user of administrators) {
            // Verificar si la notificación ya existe
            const existingNotification = await Notification.findOne({
              identifier: updatedInvoice._id,
              user: user._id,
              message,
            });

            if (!existingNotification) {
              // Comprobar si la factura fue creada hace más de 6 días
              const invoiceCreationDate = new Date(updatedInvoice.form.dateCreation);
              const currentDate = new Date();
              const differenceInDays = Math.floor((currentDate - invoiceCreationDate) / (1000 * 3600 * 24));

              if (differenceInDays <= 6) {
                // Solo crear la notificación si la factura fue creada hace menos de 6 días
                await Notification.create({
                  identifier: updatedInvoice._id,
                  user: user._id,
                  message,
                  seen: false,
                });

                const notifications = await Notification.find({ user: user._id });
                io.to(user._id.toString()).emit('userNotifications', notifications);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error en el Change Stream de facturas:', error);
    }
  });



  // Monitoreo de orden de compra
  const purchaseOrderChangeStream = PurchaseOrder.watch();
  purchaseOrderChangeStream.on('change', async (change) => {
    try {
      if (change.operationType === 'insert') {
        // Caso para cuando se inserta una nueva orden de compra
        const newPurchaseOrder = change.fullDocument;
        const message = `Nueva Orden de Compra Generada: Nº${newPurchaseOrder.form.num}`;
        const administrators = await User.find({ role: "administrador" });

        for (const user of administrators) {
          const existingNotification = await Notification.findOne({
            identifier: newPurchaseOrder._id,
            user: user._id,
            message,
          });

          if (!existingNotification) {
            await Notification.create({
              identifier: newPurchaseOrder._id,
              user: user._id,
              message,
              seen: false,
            });

            const notifications = await Notification.find({ user: user._id });
            io.to(user._id.toString()).emit('userNotifications', notifications);
          }
        }
      } else if (change.operationType === 'update') {
        // Caso para cuando se actualiza una orden de compra
        const updatedPurchaseOrder = await PurchaseOrder.findById(change.documentKey._id);

        if (updatedPurchaseOrder.state === 'Recibido') {
          const message = `La Orden de Compra Nº${updatedPurchaseOrder.form.num} ha sido recibida.`;
          const users = await User.find();

          for (const user of users) {
            // Verificar si la notificación ya existe
            const existingNotification = await Notification.findOne({
              identifier: updatedPurchaseOrder._id,
              user: user._id,
              message,
            });

            if (!existingNotification) {
              // Comprobar si la orden de compra fue creada hace más de 6 días
              const purchaseOrderCreationDate = new Date(updatedPurchaseOrder.form.dateCreation);
              const currentDate = new Date();
              const differenceInDays = Math.floor((currentDate - purchaseOrderCreationDate) / (1000 * 3600 * 24));

              if (differenceInDays <= 6) {
                // Solo crear la notificación si la orden de compra fue creada hace menos de 6 días
                await Notification.create({
                  identifier: updatedPurchaseOrder._id,
                  user: user._id,
                  message,
                  seen: false,
                });

                const notifications = await Notification.find({ user: user._id });
                io.to(user._id.toString()).emit('userNotifications', notifications);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error en el Change Stream de órdenes de compra:', error);
    }
  });




  // Monitoreo de informes
  const reportChangeStream = Report.watch();
  reportChangeStream.on('change', async (change) => {
    try {
      if (change.operationType === 'insert') {
        // Caso para cuando se inserta un nuevo informe
        const newReport = change.fullDocument;
        const message = `Nuevo Informe Generado: Nº${newReport.form.num}`;
        const users = await User.find(); // Enviar notificaciones a todos los usuarios

        for (const user of users) {
          // Verificar si la notificación ya existe
          const existingNotification = await Notification.findOne({
            identifier: newReport._id,
            user: user._id,
            message,
          });

          if (!existingNotification) {
            await Notification.create({
              identifier: newReport._id,
              user: user._id,
              message,
              seen: false,
            });

            const notifications = await Notification.find({ user: user._id });
            io.to(user._id.toString()).emit('userNotifications', notifications);
          }
        }
      } else if (change.operationType === 'update') {
        // Caso para cuando se actualiza un informe
        const updatedReport = await Report.findById(change.documentKey._id);

        if (updatedReport.state === 'Presupuestado') {
          const message = `El informe Nº${updatedReport.form.num} ha sido presupuestado.`;
          const users = await User.find(); // Enviar notificaciones a todos los usuarios

          for (const user of users) {
            // Verificar si la notificación ya existe
            const existingNotification = await Notification.findOne({
              identifier: updatedReport._id,
              user: user._id,
              message,
            });

            if (!existingNotification) {
              // Comprobar si el informe fue creado hace más de 6 días
              const reportCreationDate = new Date(updatedReport.form.dateCreation);
              const currentDate = new Date();
              const differenceInDays = Math.floor((currentDate - reportCreationDate) / (1000 * 3600 * 24));

              if (differenceInDays <= 6) {
                // Solo crear la notificación si el informe fue creado hace menos de 6 días
                await Notification.create({
                  identifier: updatedReport._id,
                  user: user._id,
                  message,
                  seen: false,
                });

                const notifications = await Notification.find({ user: user._id });
                io.to(user._id.toString()).emit('userNotifications', notifications);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error en el Change Stream de informes:', error);
    }
  });




  // Monitoreo de notas de credito
  const creditNoteChangeStream = CreditNote.watch();
  creditNoteChangeStream.on('change', async (change) => {
    if (change.operationType === 'insert') {
      try {
        const newCreditNote = change.fullDocument;
        const message = `Nueva Nota de Crédito Generada: Nº${newCreditNote.form.num}`;
        const administrators = await User.find({ role: "administrador" });

        for (const user of administrators) {
          await Notification.create({
            identifier: newCreditNote._id,
            user: user._id,
            message,
            seen: false,
          });

          const notifications = await Notification.find({ user: user._id });
          io.to(user._id.toString()).emit('userNotifications', notifications);
        }
      } catch (error) {
        console.error('Error en el Change Stream de notas de crédito:', error);
      }
    }
  });
};
