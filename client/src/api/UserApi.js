import { useState, useEffect } from 'react'
import axios from 'axios';

function UserApi(token) {
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [cart, setCart] = useState([]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (token) {
            const getUser = async () => {
                try {
                    const res = await axios.get('/user/info', {
                        headers: { Authorization: token }
                    });

                    setIsLogged(true);
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);

                    setCart(res.data.cart);

                } catch (error) {
                    alert(error.response.data.msg);
                }
            }

            getUser();
        }
    }, [token]);



    const addCart = async (product) => {
        if (!isLogged)
            return alert("Cần đăng nhập để sử dụng tính năng!");

        const check = cart.some(item => {
            return item._id === product._id
        })

        if (!check) {
            setCart([...cart, { ...product, quantity: 1 }]);

            await axios.patch('/user/addcart', { cart: [...cart, { ...product, quantity: 1 }] }, {
                headers: { Authorization: token }
            });

        } else {
            alert("Sản phẩm này đã có trong giỏ hàng!");
        }
    }

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart: [cart, setCart],
        addCart: addCart,
        history: [history, setHistory]
    }
}

export default UserApi