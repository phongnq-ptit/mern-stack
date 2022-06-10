import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js';
import Payment from '../models/payment.model.js'

const userCtrl = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const user = await User.findOne({
                email: email
            });

            if (user)
                return res.status(400).json({ msg: 'Email đã tồn tại!' });

            if (password.length < 6)
                return res.status(400).json({ msg: 'Mật khẩu phải có độ dài lớn hơn 6!' });

            // ma hoa mat khau
            const passwordHash = await bcrypt.hash(password, 10);

            const newUser = new User({
                name,
                email,
                password: passwordHash
            });

            await newUser.save();

            // tao jwt
            const accesstoken = createAccessToken({ id: newUser._id });
            const refreshtoken = createRefreshToken({ id: newUser._id });

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 //7d
            });

            return res.json(accesstoken);

        } catch (error) {
            return res.status(500).json({ msg: error.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({
                email: email
            });

            if (!user) return res.status(404).json({ msg: 'Email không tồn tại!' });

            const isMatch = await bcrypt.compare(
                password, // mat khau client gui den
                user.password // mat khau vua lay ra trong csdl
            );

            if (!isMatch) return res.status(404).json({ msg: 'Mật khẩu không chính xác!' });

            // neu dang nhap thanh cong, tao accessToken va refreshToken
            const accesstoken = createAccessToken({ id: user._id });
            const refreshtoken = createRefreshToken({ id: user._id });

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7 * 24 * 60 * 60 * 1000 //7d
            });

            return res.json(accesstoken);

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {
                path: '/user/refresh_token'
            });

            return res.json({ msg: 'Đăng xuất' });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;

            if (!rf_token) return res.status(400).json({ msg: 'Vui lòng đăng nhập hoặc đăng ký!' });

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: 'Vui lòng đăng nhập hoặc đăng ký!' });

                const accesstoken = createAccessToken({ id: user.id });

                res.json({ accesstoken });
            });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');

            if (!user) return res.status(400).json({ msg: 'Người dùng không tồn tại!!' });

            return res.json(user);

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    addCart: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(400).json({ msg: 'Người dùng không tồn tại!' });
            }

            await User.findOneAndUpdate(
                { _id: req.user.id },
                { cart: req.body.cart }
            );

            return res.json({ msg: 'Thêm vào giỏ hàng thành công!' });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    history: async (req, res) => {
        try {
            const history = await Payment.find({
                user_id: req.user.id
            });

            return res.json(history);

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }
}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '11m' });
}

const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

export default userCtrl;