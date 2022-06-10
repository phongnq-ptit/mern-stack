import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { GlobalState } from '../../../../GlobalState'

function BtnRender({ product, deleteProduct }) {

    const state = useContext(GlobalState)
    const [isAdmin] = state.userApi.isAdmin
    const addCart = state.userApi.addCart
    return (

        <div className='row-btn'>
            {
                isAdmin ?
                    <>
                        <Link id='btn-buy' to='#!' onClick={() => deleteProduct(product._id, product.images.public_id)}>
                            Xóa
                        </Link>
                        <Link id='btn-view' to={`/edit_product/${product._id}`}>
                            Sửa
                        </Link>
                    </>
                    :
                    <>
                        <Link id='btn-buy' to='#!' onClick={() => addCart(product)} >
                            Mua
                        </Link>
                        <Link id='btn-view' to={`/detail/${product._id}`}>
                            chi tiết
                        </Link>
                    </>
            }

        </div>

    )
}

export default BtnRender