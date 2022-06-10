import express from "express";
import auth from "../middleware/auth.js";
import authAdmin from "../middleware/authAdmin.js";
import productCtrl from "../controllers/product.controller.js";

const router = express.Router();

export default function (app) {
    router.get('/products', productCtrl.getProducts);

    router.post('/products', auth, authAdmin, productCtrl.createProduct);

    router.delete('/products/:id', auth, authAdmin, productCtrl.deleteProduct);

    router.put('/products/:id', auth, authAdmin, productCtrl.updateProduct);

    return app.use('/api', router);
}