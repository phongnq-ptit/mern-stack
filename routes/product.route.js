import express from "express";
import auth from "../middleware/auth";
import authAdmin from "../middleware/authAdmin";
import productCtrl from "../controllers/product.controller";

const router = express.Router();

export default function (app) {
    router.get('/products', productCtrl.getProducts);

    router.post('/products', auth, authAdmin, productCtrl.createProduct);

    router.delete('/products/:id', auth, authAdmin, productCtrl.deleteProduct);

    router.put('/products/:id', auth, authAdmin, productCtrl.updateProduct);

    return app.use('/api', router);
}