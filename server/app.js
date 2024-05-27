import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import dnsRecordRoutes from './routes/dnsRecordRoutes.js';
import dnsTypeRoutes from './routes/dnsTypeRoutes.js';

const app = express();

app.use(bodyParser.json());
app.use(cors());
dotenv.config();

const PORT = process.env.PORT || 7000;
const URL = process.env.MONGOURL;

mongoose.connect(URL).then(() => {
    console.log("DB connected successfully");
    app.listen(PORT, () => {
        console.log(`Server is running on port: ${PORT}`);
    });
}).catch(error => console.log(error));

// Mount the route handlers with their respective base URL prefixes
app.use("/api/users", userRoutes);
app.use("/api/dnsRecords", dnsRecordRoutes);
app.use("/api/dnsTypes", dnsTypeRoutes);