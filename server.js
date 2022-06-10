import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import routes from "./routes/index.route.js";
import path from 'path';

require('dotenv').config();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({
    useTempFiles: true
}));

// Routes
routes(app);

// ket noi mongodb
const URI = process.env.MONGODB_URL;
mongoose.connect(URI, {
    autoIndex: false
}, (err) => {
    if (err) throw err;
    console.log("Ket noi MONGODB thanh cong!");
});

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server chay tren PORT : ${PORT}!`);
});
