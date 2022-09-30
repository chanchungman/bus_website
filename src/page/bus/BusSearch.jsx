import { React, useState, useEffect } from 'react'
import { Link,useSearchParams } from 'react-router-dom';
import getBusList from '../../service/api/getBusList'


const BusSearch = () => {

    const [bus_list, setBusList] = useState()
    const [searchParams] = useSearchParams();

    ///////////// Call Api////////////

    useEffect(() => {
         getBusList(setBusList, 'get_all',searchParams);

    }, [searchParams])



    if (!bus_list) return 


    return (
        <div>
            <br />
            更新時間: {bus_list.generated_timestamp}
            {bus_list.data.map((e, index) => {
                return (
                    <div key={index}>
                        <Link to={{
                            pathname: "/bus_website/bus_data/details",
                            search: '?route=' + e['route'] + '&bound=' + e['bound'],
                            state: { fromDashboard: true }
                        }}>
                            <div>
                                {index}: {e['route']} {e['orig_tc']} ={'>'} {e['dest_tc']}
                            </div>
                        </Link>
                        <hr />
                    </div>
                )
            }
            )}</div>

    )
}

export default BusSearch