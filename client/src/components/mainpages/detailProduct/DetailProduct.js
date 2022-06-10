import React, { useState, useContext, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'
import ProductItem from '../utils/productItem/ProductItem'

function DetailProduct() {
    const params = useParams();

    const state = useContext(GlobalState);
    const [products] = state.productsAPI.products;
    const addCart = state.userApi.addCart;
    const [detailProduct, setDetailProduct] = useState([]);

    useEffect(() => {
        if (params.id) {
            products.forEach(product => {
                if (product._id === params.id) {
                    setDetailProduct(product);
                }
            });
        }
    }, [params.id, products]);

    if (detailProduct.length === 0) return null;

    return (
        <>
            <div className='detail'>
                <img src={detailProduct.images.url} alt='' />

                <div className='box-detail'>
                    <div className='row'>
                        <h2>{detailProduct.title}</h2>
                        <h6>#id: {detailProduct.product_id}</h6>
                    </div>
                    <span>{detailProduct.price} VND</span>
                    <p>{detailProduct.description}</p>
                    <p>{detailProduct.content}</p>
                    <p>Số lượng đã bán: {detailProduct.sold}</p>

                    <Link to={`/detail/${detailProduct._id}`} className='cart' onClick={() => addCart(detailProduct)} >Mua ngay</Link>
                </div>
            </div>

            <div>
                <h2>Sản phẩm liên quan</h2>
                <div className='products'>
                    {
                        products.map((product, index) => {
                            return product.category === detailProduct.category && product !== detailProduct ?
                                <ProductItem key={product._id} product={product} /> : null;
                        })
                    }
                </div>
            </div>
        </>
    )
}

export default DetailProduct