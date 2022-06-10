import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

function Register() {
    const [user, setUser] = useState({
        name: '',
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

    const registerSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post('/user/register', { ...user });

            localStorage.setItem('firstLogin', true);

            window.location.href = "/";
        } catch (error) {
            alert(error.response.data.msg);
        }
    }

    return (
        <div className='login-page'>
            <form onSubmit={registerSubmit}>
                <h2>Đăng ký</h2>

                <input type="text" name='name' placeholder='Nhập Tên'
                    required value={user.name} onChange={onChangeInput} />

                <input type="email" name='email' placeholder='Nhập Email'
                    required value={user.email} onChange={onChangeInput} />

                <input type="password" name='password' placeholder='Nhập Mật Khẩu' autoComplete='on'
                    required value={user.password} onChange={onChangeInput} />

                <div className="row">
                    <button type='submit'>Đăng ký</button>
                    <Link to='/login' >Đăng nhập</Link>
                </div>
            </form>

        </div>
    )
}

export default Register