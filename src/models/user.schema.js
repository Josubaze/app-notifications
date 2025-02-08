
import { Schema, model, models } from 'mongoose'

const userSchema = new Schema ({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    secret_question: {
        type: String,
        required: true,
        trim: true
    },
    secret_answer: {
        type: String,
        required: true,
        trim: true
    }
    ,
    image: {
        type: String,
        trim: true
    }
    },
    {
        collection: 'users',
        timestamps: true
    })

export default models.User || model('User', userSchema )
