import React, { useContext } from 'react'
import { GlobalState } from '../../GlobalState'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Cart from './icon/cart-shopping-solid.svg'


function Header() {
    const state = useContext(GlobalState);

    const [isLogged, setIsLogged] = state.userApi.isLogged;
    const [isAdmin, setIsAdmin] = state.userApi.isAdmin;
    const [cart] = state.userApi.cart;

    const logoutUser = async () => {
        await axios.get('/user/logout');

        localStorage.removeItem('firstLogin');

        setIsLogged(false);
        setIsAdmin(false);
        window.location.href = '/';
    }

    const adminRoute = () => {
        return (
            <>
                <li><Link to='/create_product' >Thêm sản phẩm</Link></li>
                <li><Link to='/category' >Thể loại</Link></li>
            </>
        )
    }

    const loggedRoute = () => {
        return (
            <>
                <li><Link to='/history' >{isAdmin ? 'Đơn hàng' : 'Lịch sử'}</Link></li>
                <li><Link to='/' onClick={logoutUser}>Đăng xuất</Link></li>
            </>
        )
    }

    return (
        <header>
            <div className='logo'>
                <h1>
                    <Link to='/'>
                        {isAdmin ? 'Admin' : 'Phong Store'}
                    </Link>
                </h1>
            </div>

            <ul>
                <li><Link to='/'>sản phẩm</Link></li>

                {isAdmin && adminRoute()}

                {
                    isLogged ? loggedRoute() : <li><Link to='/login'>đăng nhập/đăng ký</Link></li>
                }

            </ul>

            {
                isAdmin ? '' :
                    <div className='cart-icon' color='#ccc'>
                        <span>{cart.length}</span>
                        <Link to='/cart'>
                            <img src={Cart} alt='' width='30' />
                        </Link>
                    </div>
            }


        </header>
    )
}

export default Header