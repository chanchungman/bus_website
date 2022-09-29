import React from 'react'
import { Link } from 'react-router-dom';
function Head() {
  return (
    <Link to={{ pathname: "/bus_website/", }}>
    <div>Bus Website</div>
    </Link>
  )
}

export default Head