import { Schema, model, models } from 'mongoose';

const creditNoteSchema = new Schema(
  {
    form: {
      type: {
        num: {
          type: Number,
          required: true,
          unique: true,
        },
        numInvoice: {
            type: Number,
            required: true,
          },
        dateCreation: {
          type: Date,
          required: true,
          default: Date.now,
        },
        currency: {
          type: String,
          required: true,
        },
        exchangeRate: {
          type: Number,
          required: true,
        },
      },
      required: true,
    },
    company: {
      type: {
        _id: String,
        id_card: String,
        name: String,
        address: String,
        email: String,
        phone: String,
      },
      required: true,
    },
    customer: {
      type: {
        _id: String,
        id_card: String,
        name: String,
        email: String,
        phone: String,
        address: String,
      },
      required: true,
    },
    services: [
      {
        _id: String,
        name: String,
        serviceQuantity: Number,
        servicePrice: Number,
        products: [
          {
            product: {
              _id: String,
              name: String,
              category: String,
              price: Number,
            },
            quantity: Number,
          },
        ],
        totalPrice: Number,
      },
    ],
    description: {
      type: String,
      required: true,
      trim: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    ivaPercentage: {
      type: Number,
      required: true,
    },
    igtfPercentage: {
      type: Number,
      required: true,
    },
    calculatedIva: {
      type: Number,
      required: true,
    },
    calculatedIgtf: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    totalWithIgft: {
      type: Number,
      required: true,
    },
  },
  {
    collection: 'creditNotes',
    timestamps: false,
  }
);

export default models.CreditNote || model('CreditNote', creditNoteSchema);