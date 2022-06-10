import React, { useContext } from 'react'
import { GlobalState } from '../../../GlobalState'

function Filters() {
    const state = useContext(GlobalState);

    const [categories] = state.categoriesAPI.categories;

    const [category, setCategory] = state.productsAPI.category;

    const [sort, setSort] = state.productsAPI.sort;

    const [search, setSearch] = state.productsAPI.search;

    const handleCategory = (event) => {
        setCategory(event.target.value);
        setSearch('');
    }

    const handleSearch = (event) => {
        setSearch(event.target.value.toLowerCase());
    }

    const handleSort = (event) => {
        setSort(event.target.value);
    }

    return (
        <div className='filter_menu'>
            <div className="row">
                <span>Lọc: </span>
                <select name='category' value={category} onChange={handleCategory}>
                    <option value=''>Tất cả thể loại</option>
                    {
                        categories.map((item) => {
                            return (
                                <option value={'category=' + item._id} key={item._id}>
                                    {item.name}
                                </option>
                            )
                        })
                    }
                </select>
            </div>

            <input type="text" value={search} placeholder='Tìm kiếm sản phẩm ...'
                onChange={handleSearch} />

            <div className="row">
                <span>Sắp xếp theo: </span>
                <select value={sort} onChange={handleSort}>
                    <option value=''>Mới nhất</option>
                    <option value='sort=oldest'>Cũ nhất</option>
                    <option value='sort=-sold'>Mua nhiều nhất</option>
                    <option value='sort=-price'>Giá cao - thấp</option>
                    <option value='sort=price'>Giá thấp - cao</option>
                </select>
            </div>
        </div>
    )
}

export default Filters