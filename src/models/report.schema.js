import { Schema, model, models } from 'mongoose';

const reportSchema = new Schema(
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
            nameWorker: {
                type: String,
                required: true,
            },
            emailWorker: {
                type: String,
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
    state: {
        type: String,
        required: true,
        trim: true,
    },
    },
    {
    collection: 'reports',
    timestamps: false,
    }
);

export default models.Report || model('Report', reportSchema);