import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import { listLogEntries } from './API';

const App = () => {
	const [logEntries, setLogEntries] = useState([])
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.6,
    longitude: -95.6,
		zoom: 4,
	});
	
	useEffect(() => {
		(async () => {
			const logEntries = await listLogEntries();
			setLogEntries(logEntries);
		})();
	}, [])

  return (
    <ReactMapGL
			{...viewport}
			mapStyle="mapbox://styles/kadirgund/ckhlhfyka0amv19pqz4vymeos"
			mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={nextViewport => setViewport(nextViewport)}
    >
			{
				logEntries.map(entry => (
					<Marker 
						key={entry._id}
						latitude={entry.latitude}
						longitude={entry.longitude} 
						offsetLeft={-12} 
						offsetTop={-24}>
						<img src="https://i.imgur.com/y0G5YTX.png" className="marker"/>      	
					</Marker>
				))
			}
		</ReactMapGL>
  );
}

export default App;
