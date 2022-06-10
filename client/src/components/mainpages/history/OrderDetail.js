import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { GlobalState } from '../../../GlobalState'


function OrderDetail() {

    const state = useContext(GlobalState);

    const [history] = state.userApi.history;

    const [orderDetail, setOrderDetail] = useState([]);

    const params = useParams();

    useEffect(() => {
        if (params.id) {
            history.forEach((item) => {
                if (item._id === params.id) {
                    setOrderDetail(item);
                }
            })
        }
    }, [params.id, history]);

    if (orderDetail.length === 0) return null;

    return (
        <div className='history-page'>
            <h2>Thông tin đơn hàng {orderDetail.paymentID}</h2>

            <table>
                <thead>
                    <tr>
                        <th>Tên </th>
                        <th>Địa chỉ</th>
                        <th>Mã bưu điện</th>
                        <th>Mã Quốc gia</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{orderDetail.address.recipient_name}</td>
                        <td>{orderDetail.address.line1 + " - " + orderDetail.address.city}</td>
                        <td>{orderDetail.address.postal_code}</td>
                        <td>{orderDetail.address.country_code}</td>
                    </tr>
                </tbody>
            </table>

            <table style={{ margin: "30px 0px" }}>
                <thead>
                    <tr>
                        <th></th>
                        <th>Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orderDetail.cart.map((item) => {
                            return (
                                <tr key={item._id}>
                                    <td><img src={item.images.url} alt="" /></td>
                                    <td>{item.title}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price * item.quantity}</td>
                                </tr>
                            )
                        })
                    }

                </tbody>
            </table>
        </div>
    )
}

export default OrderDetail