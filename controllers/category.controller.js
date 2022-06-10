import Category from '../models/category.model.js';
import Product from '../models/product.model.js';

const categoryCtrl = {
    getAllCategory: async (req, res) => {
        try {
            const categories = await Category.find();

            return res.json(categories);
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    createCategory: async (req, res) => {
        try {
            // if user.role === 1 -> la Admin
            // them, sua, xoa la chuc nang cua Admin
            const { name } = req.body;

            const category = await Category.findOne({
                name: name
            });

            if (category) return res.status(400).json({ msg: 'Thể loại đã tồn tại' });

            const newCategory = new Category({ name });

            await newCategory.save();

            return res.json({ msg: 'Thêm thể loại mới thành công!' });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const products = await Product.findOne({ category: req.params.id });

            if (products) return res.status(400).json({
                msg: "Vui lòng xóa các sản phẩm cùng thể loại trước!!"
            });

            await Category.findByIdAndDelete(req.params.id);

            res.json({ msg: "Xóa thể loại thành công!!" });

        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    },
    updateCategory: async (req, res) => {
        try {
            const { name } = req.body;
            await Category.findOneAndUpdate({ _id: req.params.id }, { name }, { new: true });

            res.json({ msg: "Cập nhật thể loại thành công!" });
        } catch (error) {
            return res.status(500).json({ msg: error.message });
        }
    }
}

export default categoryCtrl;