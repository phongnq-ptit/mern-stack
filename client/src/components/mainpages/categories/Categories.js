import React, { useContext, useState } from 'react'
import axios from 'axios'
import { GlobalState } from '../../../GlobalState'

function Categories() {

    const state = useContext(GlobalState);

    const [token] = state.token;

    const [categories, setCategories] = state.categoriesAPI.categories;

    const [callback, setCallback] = state.categoriesAPI.callback;

    const [category, setCategory] = useState('');

    const [onEdit, setOnEdit] = useState(false);

    const [id, setID] = useState('');

    const createCategory = async (event) => {
        event.preventDefault();
        try {
            if (onEdit) {
                const res = await axios.put(`/api/category/${id}`, { name: category }, {
                    headers: { Authorization: token }
                });

                alert(res.data.msg);
            } else {
                const res = await axios.post('/api/category', { name: category }, {
                    headers: { Authorization: token }
                });

                alert(res.data.msg);
            }

            setOnEdit(false);
            setCategory('');
            setCallback(!callback);
        } catch (error) {
            alert(error.response.data.msg);
        }
    }

    const editCategory = async (id, name) => {
        setID(id);
        setCategory(name);
        setOnEdit(true);
    }

    const deleteCategory = async (id) => {
        try {
            if (window.confirm("Bạn có chắc muốn xóa thể loại này không??")) {
                const res = await axios.delete(`/api/category/${id}`, {
                    headers: { Authorization: token }
                });

                alert(res.data.msg);
                setCallback(!callback);
            }
        } catch (error) {
            alert(error.response.data.msg);
        }
    }

    return (
        <div className='categories'>
            <form onSubmit={createCategory}>
                <label htmlFor="category">Thể Loại</label>
                <input type="text" name='category' value={category} required
                    onChange={(event) => { return setCategory(event.target.value) }} />

                <button type="submit">{onEdit ? 'Cập nhật' : 'Thêm'}</button>
            </form>

            <div className="col">
                {
                    categories.map((item) => {
                        return (
                            <div className="row" key={item._id}>
                                <p>{item.name}</p>
                                <div>
                                    <button onClick={() => editCategory(item._id, item.name)}>Sửa</button>
                                    <button onClick={() => deleteCategory(item._id)}>Xóa</button>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Categories