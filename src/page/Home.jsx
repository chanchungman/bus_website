import { React, useState, useEffect } from 'react'
import { Link } from 'react-router-dom';


const Home = () => {
    const [latitude, setLatitude] = useState()
    const [longitude, setLongitude] = useState()
    useEffect(() => {
         navigator.geolocation.watchPosition(function (position) {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
        }
        );}, [])

    return (
        <div>
            <p>{latitude}</p>
            <p>{longitude}</p>
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