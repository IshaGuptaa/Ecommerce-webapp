import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import productRouter from './routes/product.route.js';
import categoryRouter from './routes/category.route.js';
import cartRouter from './routes/cart.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config(); // Load environment variables

console.log('MONGO_URI:', process.env.MONGO_URI); // Debugging line

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Connected to MongoDb');
}).catch((err) => {
    console.error('Failed to connect to MongoDb:', err);
});

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
app.use('/api/cart', cartRouter);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server connected to port ${PORT}!`);
});

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Invalid server error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});
