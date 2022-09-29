import { React, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom';
import getBusList from '../../service/getBusList'
import getStopList from '../../service/getStopList'

function BusDetails() {
    const [bus_list, setBusList] = useState();
    const [stop_list, setStopList] = useState();
    const [urlParams] = useSearchParams();
    let big;
    ///////////// Call Api////////////
    useEffect(() => {
        getBusList(setBusList, 'bus', urlParams)
        getStopList(setStopList, urlParams)
    }, [])

    if (!bus_list || !stop_list) return
    return (

        <div>更新時間: {bus_list.generated_timestamp}
            {Object.values(bus_list.data).map((e, index) => {
                return (
                    <div key={index}>
                        <Link to={{
                            pathname: "/bus_website/bus_data/details",
                            search: '?route=' + e['route'] + '&bound=' + e['bound'],
                            state: { fromDashboard: true }
                        }}>
                            <div>
                                 {e['route']} 
                                <br/>{
                                      big = (stop_list.data).map((stop) => {
                                         if(e['stop'] == stop['stop'])return stop['name_tc']

                                    })
                                    
                                }
                            </div>
                        </Link>
                        <hr />
                    </div>
                )
            }
            )}</div>

    )
}

export default BusDetails