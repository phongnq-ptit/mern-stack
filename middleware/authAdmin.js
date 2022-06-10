import User from '../models/user.model.js';

const authAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({
            _id: req.user.id
        });

        /**
         * role = 0 : client
         * role != 0: admin
         */
        if (user.role === 0) return res.status(400).json({ msg: 'Quyền truy cập Admin bị từ chối!' });

        next();

    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

export default authAdmin;