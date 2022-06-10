import express from "express";
import userCtrl from '../controllers/user.controller.js';
import auth from '../middleware/auth.js';

const router = express.Router();

export default function (app) {
    router.post('/user/register', userCtrl.register);

    router.post('/user/login', userCtrl.login);

    router.get('/user/logout', userCtrl.logout);

    router.get('/user/refresh_token', userCtrl.refreshToken);

    router.get('/user/info', auth, userCtrl.getUser);

    router.patch('/user/addcart', auth, userCtrl.addCart);

    router.get('/user/history', auth, userCtrl.history);

    return app.use('/', router);
}