import Product from "../models/product.model";

// bo loc, sap xep, phan trang
class APIfeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filtering() {
        const queryObj = { ...this.queryString }; //queryString = req.query

        const excludedFields = ['page', 'sort', 'limit'];
        excludedFields.forEach(el => delete (queryObj[el]));

        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match);

        this.query.find(JSON.parse(queryStr));

        return this;
    }

    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 12;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

const productCtrl = {
    getProducts: async (req, res) => {
        try {
            const features = new APIfeatures(Product.find(), req.query)
                .filtering()
                .sorting()
                .paginating()

            const products = await features.query;

            res.json({
                status: 'Thành công!!',
                result: products.length,
                products: products
            });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    createProduct: async (req, res) => {
        try {
            const { product_id, title, price, description, content, images, category } = req.body;
            if (!images) return res.status(400).json({ msg: "Không có ảnh nào được tải lên!!" });

            const product = await Product.findOne({ product_id });
            if (product)
                return res.status(400).json({ msg: "Sản phẩm đã tồn tại!!" });

            const newProduct = new Product({
                product_id, title: title.toLowerCase(), price, description, content, images, category
            });

            await newProduct.save()
            res.json({ msg: "Thêm sản phẩm mới thành công!" });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            await Product.findByIdAndDelete(req.params.id)
            res.json({ msg: "Xóa sản phẩm thành công!" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { title, price, description, content, images, category } = req.body;
            if (!images) return res.status(400).json({ msg: "Không có ảnh nào được tải lên!!" });

            await Product.findOneAndUpdate({ _id: req.params.id }, {
                title: title.toLowerCase(), price, description, content, images, category
            })

            res.json({ msg: "Cập nhật sản phẩm thành công!!" });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    }
};

export default productCtrl;