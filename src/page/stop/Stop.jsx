import { React, useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import getStopList from '../../service/getStopList'


const Stop = () => {

    const [stop_list, setStopList] = useState()
    ///////////// Call Api////////////
    useEffect(() => {
        getStopList(setStopList);
    }, [])

    if (!stop_list) return

    return (
        <div>
            <br />
            更新時間: {stop_list.generated_timestamp}
            {stop_list.data.map((e, index) => {
                return (
                    <div key={index}>
                        <Link to={{
                            pathname: "/bus_website/stop_details",
                            search: '?route=' + e['route'] + '&bound=' + e['bound'],
                            state: { fromDashboard: true }
                        }}>
                            <div>
                                {index}: {e['name_tc']}
                            </div>
                        </Link>
                        <hr />
                    </div>
                )
            }
            )}</div>

    )
}

export default Stop