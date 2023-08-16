import mongoose from 'mongoose';

async function connectDatabase(): Promise<mongoose.Connection> {
    if (mongoose.connection.readyState >= 1) {
        return mongoose.connection;
    }

    try {
        await mongoose.connect(String(process.env.MONGO_DB_URI),{
            socketTimeoutMS: 30000,
            connectTimeoutMS: 30000,
        });
        // eslint-disable-next-line no-console
        console.log('💾  Data persistence systems in operation');
        return mongoose.connection;
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Database connection error', error);
        process.exit(1);
    }
}

export default connectDatabase;

