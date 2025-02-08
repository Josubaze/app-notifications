import { Schema, model, models } from "mongoose";

const notificationSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    seen: {
      type: Boolean,
      required: true,
      default: false,
    },
    seenAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'notifications',
    timestamps: true,
  }
);

// Al definir el índice TTL, MongoDB eliminará automáticamente los documentos cuyo campo 'seenAt'
// tenga una antigüedad mayor a 7 días (7 * 24 * 60 * 60 = 604800 segundos)
notificationSchema.index({ seenAt: 1 }, { expireAfterSeconds: 604800 });

const Notification = models.Notification || model("Notification", notificationSchema);
export default Notification;
