import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import Loading from '../utils/loading/Loading'
import { useNavigate, useParams } from 'react-router-dom'

const initialState = {
    product_id: '',
    title: '',
    price: 0,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Id repellendus eum tenetur autem fugit ducimus eveniet distinctio numquam at, aspernatur a deserunt eius, quas minima maxime quasi, quia enim atque.',
    category: '',
    _id: ''
};

function CreateProduct() {
    const state = useContext(GlobalState);

    const [token] = state.token;

    const [product, setProduct] = useState(initialState);

    const [categories] = state.categoriesAPI.categories;

    const [images, setImages] = useState(false);

    const [loading, setLoading] = useState(false);

    const [isAdmin] = state.userApi.isAdmin;

    const [products] = state.productsAPI.products;

    const [callback, setCallback] = state.productsAPI.callback;

    const [onEdit, setOnEdit] = useState(false);

    const history = useNavigate();

    const params = useParams();

    useEffect(() => {
        if (params.id) {
            setOnEdit(true);
            products.forEach((item) => {
                if (item._id === params.id) {
                    setProduct(item);
                    setImages(item.images)
                }
            });
        } else {
            setOnEdit(false);
            setProduct(initialState);
            setImages(false)
        }
    }, [params.id, products])

    const handleUpload = async (event) => {
        event.preventDefault();
        try {
            if (!isAdmin) return alert("Bạn không phải là Admin!!");

            const file = event.target.files[0];

            if (!file) return alert("Tệp không tồn tại!!");

            if (file.size > 1024 * 1024) return alert("Tệp lớn hơn 1MB!!");

            if (file.type !== 'image/jpeg' && file.type !== 'image/png')
                return alert("Tệp không đúng định dạng JPG/PNG !!");

            let formData = new FormData();
            formData.append('file', file);

            setLoading(true);

            const res = await axios.post('/api/upload', formData, {
                headers: {
                    'content-type': 'multipart/form-data',
                    Authorization: token
                }
            });

            setLoading(false);

            setImages(res.data);
        } catch (error) {
            alert(error.response.data.msg);
        }
    }

    const handleDestroy = async (event) => {
        try {
            if (!isAdmin) return alert("Bạn không phải là Admin!!");

            setLoading(true);

            await axios.post('/api/destroy', { public_id: images.public_id }, {
                headers: { Authorization: token }
            });

            setLoading(false);
            setImages(false);
        } catch (error) {
            alert(error.response.data.msg);
        }
    }

    const handleChangeinput = (event) => {
        const { name, value } = event.target;

        setProduct({ ...product, [name]: value })
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (!isAdmin) return alert("Bạn không phải là Admin!!");

            if (!images) return alert("Không có ảnh được tải lên!!");

            if (!onEdit) {
                const res = await axios.post('/api/products', { ...product, images }, {
                    headers: { Authorization: token }
                });

                alert(res.data.msg);
            } else {
                const res = await axios.put(`/api/products/${product._id}`, { ...product, images }, {
                    headers: { Authorization: token }
                });

                alert(res.data.msg);
            }

            setCallback(!callback);
            setImages(false);
            setProduct(initialState);
            history('/');
        } catch (error) {
            alert(error.response.data.msg);
        }
    }

    const styleUpload = {
        display: images ? 'block' : 'none'
    }

    return (
        <div className='create_product'>
            <div className="upload">
                <input type="file" id="file_up" name='file' onChange={handleUpload} />
                {
                    loading ?
                        <div id="file_img" style={styleUpload}><Loading /></div>
                        :
                        <div id="file_img" style={styleUpload}>
                            <img src={images ? images.url : ''} alt="" />
                            <span onClick={handleDestroy}>X</span>
                        </div>
                }
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="product_id">Mã Sản Phẩm</label>
                    <input type="text" name='product_id' id='product_id' required
                        value={product.product_id} onChange={handleChangeinput} disabled={onEdit} />
                </div>

                <div className="row">
                    <label htmlFor="title">Tiêu đề</label>
                    <input type="text" name='title' id='title' required
                        value={product.title} onChange={handleChangeinput} />
                </div>

                <div className="row">
                    <label htmlFor="price">Giá tiền</label>
                    <input type="number" name='price' id='price' required
                        value={product.price} onChange={handleChangeinput} />
                </div>

                <div className="row">
                    <label htmlFor="description">Mô tả</label>
                    <textarea type="text" name='description' id='description' required
                        value={product.description} rows="5" onChange={handleChangeinput} />
                </div>

                <div className="row">
                    <label htmlFor="content">Nội dung</label>
                    <textarea type="text" name='content' id='content' required
                        value={product.content} rows="7" onChange={handleChangeinput} />

                </div>

                <div className="row">
                    <label htmlFor="categories">Thể loại: </label>
                    <select name="category" value={product.category} onChange={handleChangeinput}>
                        <option value="">Vui lòng chọn thể loại</option>
                        {
                            categories.map((item) => {
                                return (
                                    <option value={item._id} key={item._id} >
                                        {item.name}
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>

                <button type='submit'>{onEdit ? 'Cập nhật' : 'Thêm'}</button>
            </form>
        </div>
    )
}

export default CreateProduct