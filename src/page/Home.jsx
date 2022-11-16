import { React, useState, useEffect, useContext , useRef } from 'react'
import { json, Link } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import getBusList from '../service/api/getBusList'
import getStopList from '../service/api/getStopList'
import GetDistance from '../service/function/GetDistance'
import 'leaflet-rotatedmarker';

const Home = () => {
    const [onclick_stop, setOnclickStop] = useState()
    var onclick_stop_id = useRef(null)
    const [bus_list, setBusList] = useState(null)
    const [stop_list, setStopList] = useState([])
    const [location, setLocation] = useState([])
    const [marker_data, setMarkerData] = useState()
    let time;

    /// map///

    async function createMap(position) {
        const stop_data = stop_list['data']
        let mymap;
        let my_latitude = 22.305208;
        let my_longitude = 114.188859;
        let heading = 0;
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
            shadowSize: [41, 41],
        });

        if (position['message'] != "User denied Geolocation") {
            my_latitude = position['coords']['latitude']
            my_longitude = position['coords']['longitude']
            if (position['coords']['heading']) {
                heading = position['coords']['heading']
            }
        }

        setLocation([my_latitude, my_longitude, heading])
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
            setMarkerData([marker])
            marker.bindPopup('Here').openPopup()
            stop_data.map(e => {
                const min_lat = e.lat - my_latitude;
                const min_long = e.long - my_longitude;
                const meter = 0.0045;
                /////方圓500米內車站////
                if ((min_lat <= meter && min_lat >= -(meter)) && (min_long <= meter && min_long >= -(meter))) {
                    const stop = L.marker([e.lat, e.long], { icon: redIcon, myCustomId: e.stop }).on('click', function (e_stop) {
                        BusApi(e_stop['sourceTarget']['options']['myCustomId'])
                        setOnclickStop(e.name_tc)
                        //console.log(e_stop['sourceTarget']['options']['myCustomId'])
                    }).addTo(mymap);
                    const r = GetDistance(my_latitude, my_longitude, e.lat, e.long)
                    stop.bindPopup(e.name_tc + '<br />' + r + 'm')
                }
            })
        }
        else if (position['message'] != "User denied Geolocation") {
            ////update user location////
            let marker = { marker_data }
            if(marker['marker_data']){
                marker = marker['marker_data'][0]
                if (marker != null) {
                    var newLatLng = new L.LatLng(my_latitude, my_longitude);
                    marker.setLatLng(newLatLng).update();
                    marker.setRotationAngle(heading);
                }
            }
        }
    }

    function BusApi(id){
        getBusList(setBusList, 'bus_by_stop', null, id);
        onclick_stop_id.current=id

    }

    useEffect(() => {
        const timer = setTimeout(() =>
            (stop_list.length === 0) ?
                getStopList(setStopList)
                :
                navigator.geolocation.watchPosition(createMap, createMap)
            , 500);
        return () => clearTimeout(timer);
    }, [stop_list, location]);

    setInterval(() => {
        if(bus_list) {
            console.log(onclick_stop_id.current)
            BusApi(onclick_stop_id.current)
        }
    }, 60000);///set bus data per 1 min

    return (
        <div>
            <p>
            {location[0]}
            <br />
            {location[1]}
            <br />
            {location[2]}
            </p>
            <div id="mapid" style={{ height: "50vh", width: "100vw" }} />
            {bus_list ?
                <div className='bus_list'>
                    <p className='bus_list_title'>
                        {onclick_stop}
                    </p>
                    {
                        bus_list.data.map((e, index) => {
                            time = parseInt((new Date(e.eta).getTime() - new Date().getTime()) / 1000 / 60)

                            return <div>
                                    <b>
                                    {index == 0 || bus_list.data[index - 1].route != e.route ? 
                                        <div>
                                        <hr/>
                                            <div className='bus_title'>
                                                {e.route} ➪ {e.dest_tc}
                                            </div>
                                        </div> : ''}
                                    </b>
                                <div className='time_div'>
                                        <b>{
                                            time >= 0 ?
                                            <div>
                                                {time}                                           
                                                <br/>
                                                <p>mins</p>
                                            </div> : '尾班車已過'
                                        }</b>
  
                                </div> {/*到站需時*/}
                            </div>
                        })
                    }
                    <hr />
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
        </div>
    )
}

export default Home