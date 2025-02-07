import { connect, connection } from 'mongoose';
import { DATABASE_URL } from './config';

const conn = { 
    isConnected: false
};

export const connectDB = async () => {
    if (conn.isConnected) return;

    try {
        const db = await connect(DATABASE_URL, {
            dbName: 'ServiAutos',
        });
        conn.isConnected = db.connections[0].readyState;
    } catch (error) {
        throw error; // Opcionalmente, vuelve a lanzar el error para manejarlo a niveles superiores
    }
}


connection.on('connected', () => {
    console.log('✅ Mongoose connected to database');
});

connection.on('error', (err) => {
    console.log('⚠️ Mongoose connection error', err);
});


