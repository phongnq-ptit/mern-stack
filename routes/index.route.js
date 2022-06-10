import userRoute from "./user.route.js";
import categoryRoute from './category.route.js'
import uploadRoute from './upload.route.js';
import productRoute from './product.route.js';
import paymentRoute from './payment.route.js';

export default function (app) {
    userRoute(app);
    categoryRoute(app);
    uploadRoute(app);
    productRoute(app);
    paymentRoute(app);
}