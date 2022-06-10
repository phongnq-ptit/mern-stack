import express from 'express';
import cloudinary from 'cloudinary';
import fs from 'fs';
import auth from '../middleware/auth';
import authAdmin from '../middleware/authAdmin';

require('dotenv').config();

const router = express.Router();

// upload anh tren cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// sau khi upload se sinh ra mot file trong folder tmp
// luc nay can xoa no di
const removeTmp = (path) => {
    fs.unlink(path, (err) => {
        if (err) throw err;
    });
}

export default function (app) {
    router.post('/upload', auth, authAdmin, (req, res) => {
        try {
            if (!req.files || Object.keys(req.files) === 0)
                return res.status(400).json({ msg: 'Khong co file nao duoc tai len!' });

            const file = req.files.file;
            /**
             * 1024 * 1024 = 1Mb
             */
            if (file.size > 1024 * 1024) {
                removeTmp(file.tempFilePath);

                return res.status(400).json({ msg: 'Anh co dung luong lon hon 1Mb!' });
            }

            if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
                removeTmp(file.tempFilePath);

                return res.status(400).json({ msg: 'Anh can dung dinh dang jpeg hoac png!' });
            }

            cloudinary.v2.uploader.upload(
                file.tempFilePath,
                { folder: "test" },
                async (err, result) => {
                    if (err) throw err;

                    removeTmp(file.tempFilePath);

                    res.json({
                        public_id: result.public_id,
                        url: result.secure_url
                    });
                });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    });

    router.post('/destroy', auth, authAdmin, (req, res) => {
        try {
            const { public_id } = req.body;

            if (!public_id) return res.status(400).json({ msg: 'Khong co file nao duoc chon!' });

            cloudinary.v2.uploader.destroy(
                public_id,
                async (err, result) => {
                    if (err) throw err;

                    res.json({ msg: 'Xoa anh thanh cong!' });
                }
            );

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    });

    app.use('/api', router);
};