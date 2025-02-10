import { Schema, model, models } from "mongoose";

const notificationSchema = new Schema(
  {
    identifier: { 
      type: String,
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


notificationSchema.index({ seenAt: 1 }, { expireAfterSeconds: 604800 });

const Notification = models.Notification || model("Notification", notificationSchema);
export default Notification;
