import { React, useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import "leaflet/dist/leaflet.css";
import Leaflet from "leaflet";
import getStopList from '../service/getStopList'

const Home = () => {

    const [stop_list, setStopList] = useState([])
    const [location, setLocation] = useState([])

    /// map///
    async function createMap(stop_list) {
        navigator.geolocation.watchPosition(function (position) {
            const my_latitude = position.coords.latitude;
            const my_longitude = position.coords.longitude;
            setLocation([my_latitude,my_longitude])
            ///----------------map-------------------///
            const mymap = Leaflet.map("mapid").setView([my_latitude, my_longitude], 25);
            const OSMUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

            Leaflet.tileLayer(OSMUrl).addTo(mymap);
            
            const redIcon = new Leaflet.Icon({
                iconUrl:
                    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
                shadowUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            const blueIcon = new Leaflet.Icon({
                iconUrl:
                    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
                shadowUrl:
                    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });
            console.log(typeof blueIcon);
            const marker = Leaflet.marker([my_latitude, my_longitude], { icon: blueIcon }).addTo(
                mymap
            );

            marker.bindPopup('Here').openPopup();
            stop_list.map(e => {
                const min_lat = e.lat - my_latitude;
                const min_long = e.long - my_longitude;
                const meter = 0.0045;

                /////方圓500米內車站////
                if ((min_lat <= meter && min_lat >= -(meter)) && (min_long <= meter && min_long >= -(meter))) {
                    const stop = Leaflet.marker([e.lat, e.long], { icon: redIcon }).addTo(
                        mymap
                    );
                    stop.bindPopup(e.name_tc)
                }
            })
        });
    }

    useEffect(() => {
        (stop_list.length === 0) ?
            getStopList(setStopList)
            :
            createMap(stop_list['data'])
    }, [stop_list,location])

    return (
        <div>
            {location[0]}
            <br />
            {location[1]}
            <div id="mapid" style={{ height: "50vh", width: "50vw" }} />
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