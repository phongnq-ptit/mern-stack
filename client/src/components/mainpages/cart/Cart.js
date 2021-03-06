import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios';
import { GlobalState } from '../../../GlobalState'
import PaypalButton from './PaypalButton'

function Cart() {
    const state = useContext(GlobalState);

    const [token] = state.token;

    const [cart, setCart] = state.userApi.cart;

    const [total, setTotal] = useState(0);


    useEffect(() => {
        const getTotal = () => {
            const total = cart.reduce((prev, item) => {
                return prev + (item.price * item.quantity);
            }, 0);

            setTotal(total);
        }

        getTotal();
    }, [cart]);

    const addToCart = async (cart) => {
        await axios.patch('/user/addcart', { cart }, {
            headers: { Authorization: token }
        });
    }

    const increment = (id) => {
        cart.forEach((item) => {
            if (item._id === id) {
                item.quantity += 1;
            }
        });

        setCart([...cart]);
        addToCart(cart);
    }

    const decrement = (id) => {
        cart.forEach((item) => {
            if (item._id === id && item.quantity > 1) {
                item.quantity -= 1;
            }
        });

        setCart([...cart]);
        addToCart(cart)
    }

    const removeProduct = (id) => {
        if (window.confirm("Bạn chắc muốn xóa sản phẩm này khỏi giỏ hàng chứ!!!")) {
            cart.forEach((item, index) => {
                if (item._id === id) {
                    cart.splice(index, 1);
                }
            });

            setCart([...cart]);
            addToCart(cart);
        }
    }

    const tranSuccess = async (payment) => {

        const { paymentID, address } = payment;

        await axios.post('/api/payment', { cart, paymentID, address }, {
            headers: { Authorization: token }
        });

        setCart([]);
        addToCart([]);

        alert(`Bạn đã đặt thành công đơn hàng ${paymentID}`);

    }

    if (cart.length === 0)
        return (
            <h3 style={{ textAlign: "center", fontSize: "4rem" }}>Giỏ Hàng Trống!</h3>
        )

    return (
        <div>
            {
                cart.map((product) => {
                    return (
                        <div className='detail cart' key={product._id}>
                            <img src={product.images.url} alt='' />

                            <div className='box-detail'>
                                <h2>{product.title}</h2>
                                <span>{product.price * product.quantity} VND</span>
                                <p>{product.description}</p>
                                <p>{product.content}</p>

                                <div className="amount">
                                    <button onClick={() => decrement(product._id)}> - </button>
                                    <span>{product.quantity}</span>
                                    <button onClick={() => increment(product._id)}> + </button>
                                </div>

                                <div className="delete" onClick={() => removeProduct(product._id)}>X</div>
                            </div>
                        </div>
                    )
                })
            }

            <div className="total">
                <h2>Tổng số tiền: {total} VND</h2>
                <PaypalButton
                    total={total}
                    tranSuccess={tranSuccess}
                />
            </div>
        </div>
    )
}

export default Cart