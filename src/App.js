
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './page/Home'
import Bus from './page/bus/Bus';
import BusDetails from './page/bus/BusDetails'
import Head from './components/Head';
import SearchBar from './components/SearchBar';
import BusSearch from './page/bus/BusSearch';
import Stop from './page/stop/Stop';
function App() {
  return (
    <BrowserRouter>
    <Head />
    <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="bus_website/" element={<Home />} />
        <Route path="bus_website/bus_data" element={<Bus />} />
        <Route path="bus_website/stop_data" element={<Stop />} />
        <Route path="bus_website/bus_data/results" element={<BusSearch />} />
        <Route path="bus_website/bus_data/details" element={<BusDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
