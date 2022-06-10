import React, { useContext, useState } from 'react'
import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem';
import Loading from '../utils/loading/Loading';
import Filters from './Filters';
import LoadMore from './LoadMore';
import axios from 'axios'


function Products() {
    const state = useContext(GlobalState);

    const [products, setProducts] = state.productsAPI.products;

    const [isAdmin] = state.userApi.isAdmin;

    const [token] = state.token;

    const [callback, setCallback] = state.productsAPI.callback;

    const [loading, setLoading] = useState(false);

    const [isCheck, setIsCheck] = useState(false);

    const deleteProduct = async (id, public_id) => {
        try {
            if (window.confirm("Bạn chắc muốn xóa sản phẩm này chứ??")) {

                setLoading(true);

                const destroyImg = await axios.post('/api/destroy', { public_id: public_id }, {
                    headers: { Authorization: token }
                });

                const deleteProduct = await axios.delete(`/api/products/${id}`, {
                    headers: { Authorization: token }
                });

                alert(destroyImg.data.msg + " VÀ " + deleteProduct.data.msg);

                setCallback(!callback);
                setLoading(false);
            }
        } catch (error) {
            alert(error.response.data.msg);
        }
    }

    const handleCheck = (id) => {
        products.forEach((item) => {
            if (item._id === id) {
                item.checked = !item.checked;
            }
        });

        setProducts([...products]);
    }

    const checkAll = () => {
        products.forEach((item) => {
            item.checked = !isCheck;
        });

        setProducts([...products]);
        setIsCheck(!isCheck);
    }

    const deleteAll = () => {
        products.forEach((item) => {
            if (item.checked) {
                deleteProduct(item._id, item.images.public_id);
            }
        });
    }

    if (loading) return (<div><Loading /></div>);

    return (
        <>
            <Filters />
            {
                isAdmin &&
                <div className="delete-all">
                    <span>Chọn tất cả</span>
                    <input type="checkbox" checked={isCheck} onChange={checkAll} />
                    <button onClick={deleteAll}>Xóa tất cả</button>
                </div>
            }
            <div className='products'>
                {
                    products.map((product) => {
                        return <ProductItem key={product._id} product={product}
                            isAdmin={isAdmin} deleteProduct={deleteProduct} handleCheck={handleCheck} />
                    })
                }
            </div>

            <LoadMore />

            {products.length === 0 && <Loading />}
        </>
    )
}

export default Products