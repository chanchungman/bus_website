import { React, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import getBusList from '../service/api/getBusList'
import getStopList from '../service/api/getStopList'
import GetDistance from '../service/function/GetDistance'

const Home = () => {
    const [bus_list, setBusList] = useState(null)
    const [stop_list, setStopList] = useState([])
    const [location, setLocation] = useState([])
    const [map_data, setMapData] = useState()
    let time;

    /// map///





    async function createMap(position) {
        console.log('start')
        const stop_data = stop_list['data']
        let mymap;
        let my_latitude = 22.305208;
        let my_longitude = 114.188859;
        const redIcon = new L.Icon({
            iconUrl:
                "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
            shadowUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        const blueIcon = new L.Icon({
            iconUrl:
                "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
            shadowUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
        if (position['message'] != "User denied Geolocation") {
            my_latitude = position['coords']['latitude']
            my_longitude = position['coords']['longitude']

        }

        setLocation([my_latitude, my_longitude])
        ///----------------map-------------------///

        ///check map is already initialized///
        var container = L.DomUtil.get('mapid');
        if (container._leaflet_id == null) {

            mymap = new L.map("mapid");
            mymap.setView([my_latitude, my_longitude], 25);
            /*
            https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png     --style 1
            https://tile.openstreetmap.org/{z}/{x}/{y}.png  --style 2
            https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}{r}.png --style 3
            https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png --style 4
            */
            const OSMUrl = "https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png";

            L.tileLayer(OSMUrl).addTo(mymap);

            const marker = L.marker([my_latitude, my_longitude], { icon: blueIcon, title: 'location_marker' }).addTo(mymap);
            marker.bindPopup('Here').openPopup()
            setMapData([mymap])
            stop_data.map(e => {
                const min_lat = e.lat - my_latitude;
                const min_long = e.long - my_longitude;
                const meter = 0.0045;
                /////方圓500米內車站////
                if ((min_lat <= meter && min_lat >= -(meter)) && (min_long <= meter && min_long >= -(meter))) {
                    const stop = L.marker([e.lat, e.long], { icon: redIcon, myCustomId: e.stop }).on('click', function (e) {
                        getBusList(setBusList, 'bus_by_stop', null, e['sourceTarget']['options']['myCustomId']);
                        console.log(e['sourceTarget']['options']['myCustomId'])
                    }).addTo(mymap);
                    const r = GetDistance(my_latitude, my_longitude, e.lat, e.long)
                    stop.bindPopup(e.name_tc + '<br />' + r + 'm')
                }
            })
        }
        else {
            let marker = document.querySelector("img[title='location_marker']")
            let mymap = { map_data };
            
             if(marker != null)return
                marker = L.setLatLng([my_latitude, my_longitude])
        }
    }
    useEffect(() => {
        const timer = setTimeout(() => 
            (stop_list.length === 0) ?
            getStopList(setStopList)
            :
            navigator.geolocation.watchPosition(createMap,createMap)
          , 1000);
          return () => clearTimeout(timer);
        }, [stop_list,location]);

    setInterval(() => {
        if (bus_list) {
            getBusList(setBusList, 'bus_by_stop', null, bus_list.values)
        }

    }, 60000);///set bus data per 1 min
    return (
        <div>
            {location[0]}
            <br />
            {location[1]}
            <div id="mapid" style={{ height: "50vh", width: "100vw" }} />

            {bus_list ?
                <div>
                    {
                        bus_list.data.map((e, index) => {
                            time = parseInt((new Date(e.eta).getTime() - new Date().getTime()) / 1000 / 60)
                            var time_result = time + '分鐘 '
                            return index != 0 ?
                                bus_list.data[index - 1].route != e.route ?
                                    <div>
                                        <hr />
                                        {e.route} : {time >= 0 ? time_result : '尾班車已過'}  {/*到站需時*/}
                                    </div>
                                    :
                                    <div>
                                        ------{time >= 0 ? time_result : '尾班車已過'}{/*到站需時*/}
                                    </div>
                                :
                                <div>
                                    {e.route} : {time >= 0 ? time_result : '尾班車已過'} {/*到站需時*/}
                                </div>
                        })}
                </div>
                :
                (<p>no</p>)

            }

            <br />
            <Link to={{
                pathname: "/bus_website/bus_data",
            }}>
                bus
            </Link>
            <br />
            <Link to={{
                pathname: "/bus_website/stop_data",
            }}>
                stop
            </Link>
        </div>)
}

export default Home