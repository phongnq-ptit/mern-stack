import Payment from '../models/payment.model.js';
import User from '../models/user.model.js';
import Product from '../models/product.model.js';


const paymentCtrl = {
    getPayments: async (req, res) => {
        try {
            const payments = await Payment.find();

            res.json(payments);
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    createPayment: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('name email');

            if (!user) return res.status(400).json({ msg: "Người dùng không tồn tại!." });

            const { cart, paymentID, address } = req.body;

            const { _id, name, email } = user;

            const newPayment = new Payment({
                user_id: _id, name, email, cart, paymentID, address
            });

            cart.filter(item => {
                return sold(item._id, item.quantity, item.sold)
            });

            await newPayment.save();

            res.json({ msg: "Thanh toán thành công!", newPayment });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
}

const sold = async (id, quantity, oldSold) => {
    await Product.findOneAndUpdate({ _id: id }, {
        sold: quantity + oldSold
    });
}

export default paymentCtrl;