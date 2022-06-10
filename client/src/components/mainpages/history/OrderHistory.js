import React, { useContext, useEffect } from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'
import { Link } from 'react-router-dom'

function OrderHistory() {
    const state = useContext(GlobalState);

    const [token] = state.token;

    const [isAdmin] = state.userApi.isAdmin;

    const [history, setHistory] = state.userApi.history;

    useEffect(() => {
        if (token) {
            const getHistory = async () => {
                if (isAdmin) {
                    try {
                        const res = await axios.get('/api/payment', {
                            headers: { Authorization: token }
                        });

                        setHistory(res.data);
                    } catch (error) {
                        alert(error.response.data.msg);
                    }
                } else {
                    try {
                        const res = await axios.get('/user/history', {
                            headers: { Authorization: token }
                        });

                        setHistory(res.data);
                    } catch (error) {
                        alert(error.response.data.msg);
                    }
                }
            }

            getHistory();
        }
    }, [token, isAdmin, setHistory])

    return (
        <div className="history-page">
            <h2>Lịch sử đặt hàng!</h2>

            <h4>
                {
                    isAdmin ? `Hệ thống có ${history.length} đơn hàng đã đặt!` : `Bạn có ${history.length} đơn hàng đã đặt!`
                }
            </h4>


            <table>
                <thead>
                    <tr>
                        <th>Mã thanh toán</th>
                        <th>Ngày thanh toán</th>
                        <th>Xem</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        history.map((item) => {
                            return (
                                <tr key={item._id}>
                                    <td>{item.paymentID}</td>
                                    <td>
                                        {
                                            item.createdAt.substring(0, 10).split('-').reverse().join('/')
                                            //new Date(item.createdAt).toLocaleDateString()
                                        }
                                    </td>
                                    <td><Link to={`/history/${item._id}`} >Chi tiết</Link> </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default OrderHistory