import { React, useRef } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
const SearchBar = () => {
    const navigate = useNavigate();

    const searchRef = useRef(null);
    const location = useLocation();
    const handleSubmit = (event) => {
        event.preventDefault();
        //switch(searchParams)
        // 👇️ redirect to /results

        location.pathname.includes('bus_data') ?
            navigate('/bus_website/bus_data/results?search_query=' + searchRef.current.value)
            :
            location.pathname.includes('stop_data') ?
            navigate('/bus_website/stop_data/results?search_query=' + searchRef.current.value)
                :
                searchRef.current.value = '';

        searchRef.current.value = '';
    };

    return (
        <div className='text-center'>
            <form onSubmit={handleSubmit}>
                <input type='text' ref={searchRef} />
                <input type="submit" value="Search" />
            </form>
        </div>
    )
}

export default SearchBar;