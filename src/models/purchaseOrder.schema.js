import { Schema, model, models } from 'mongoose';

const purchaseOrderSchema = new Schema(
    {
    form: {
        type: {
            num: {
                type: Number,
                required: true,
                unique: true,
            },
            dateCreation: {
                type: Date,
                required: true,
                default: Date.now,
            },
            dateUpdate: {
                type: Date,
                default: null,
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
    provider: {
        type: {
            _id: String,
            id_card: String,
            name: String,
            contactName: String,
            email: String,
            phone: String,
            address: String,
        },
        required: true,
    },

    products: [
        {
            _id: String,
            name: String,
            description: String,
            vehicleType: String,
            category: String,
            quantity: Number,
            price: Number,
        },
    ],
    description: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
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
    collection: 'purchaseOrders',
    timestamps: false,
  }
);

export default models.PurchaseOrder || model('PurchaseOrder', purchaseOrderSchema);