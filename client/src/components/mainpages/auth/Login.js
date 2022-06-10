import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Login() {
    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const onChangeInput = (event) => {
        const { name, value } = event.target;
        setUser({
            ...user,
            [name]: value
        });
    }

    const loginSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/user/login', { ...user });

            localStorage.setItem('firstLogin', true);

            window.location.href = "/";
        } catch (error) {
            alert(error.response.data.msg);
        }
    }

    return (
        <div className='login-page'>
            <form onSubmit={loginSubmit}>
                <h2>Đăng nhập</h2>
                <input type="email" name='email' placeholder='Nhập Email'
                    required value={user.email} onChange={onChangeInput} />

                <input type="password" name='password' placeholder='Nhập Mật Khẩu' autoComplete='on'
                    required value={user.password} onChange={onChangeInput} />

                <div className="row">
                    <button type='submit'>Đăng nhập</button>
                    <Link to='/register' >Đăng ký</Link>
                </div>
            </form>

        </div>
    )
}

export default Login