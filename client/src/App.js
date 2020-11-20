import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import { listLogEntries, deleteLogEntry } from './API';
import LogEntryForm from './LogEntryForm';

const App = () => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');
  const [isDeleteClicked, setIsDeleteClicked] = useState(false);
  const [logEntries, setLogEntries] = useState([]);
  const [showPopup, setShowPopup] = useState({});
  const [showUpdate, setShowUpdate] = useState({});
  const [addEntryLocation, setAddEntryLocation] = useState(null);
  const [viewport, setViewport] = useState({
    width: '100vw',
    height: '100vh',
    latitude: 37.6,
    longitude: -95.6,
    zoom: 4,
  });

  const getEntries = async () => {
    const logEntries = await listLogEntries();
    setLogEntries(logEntries);
  };

  const showAddMarkerPopup = (event) => {
    const [longitude, latitude] = event.lngLat;
    setAddEntryLocation({
      latitude,
      longitude,
    });
  };

  const handleMarkerClick = (id) => {
    setShowPopup({ [id]: true });
    setError('');
  };

  const handleDelete = async (id, apiKey) => {
    if (isDeleteClicked) {
      try {
        await deleteLogEntry(id, apiKey);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
      await getEntries();
      setApiKey('');
      setIsDeleteClicked(false);
    } else setIsDeleteClicked(true);
  };

  const handleUpdate = (id) => {
    setShowPopup({});
    setShowUpdate({ [id]: true });
  };

  const handlePopupClose = () => {
    setShowPopup({});
    setShowUpdate({});
    setIsDeleteClicked(false);
  };

  useEffect(() => {
    getEntries();
  }, []);

  return (
    <ReactMapGL
      {...viewport}
      mapStyle='mapbox://styles/kadirgund/ckhlhfyka0amv19pqz4vymeos'
      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
      onViewportChange={(nextViewport) => setViewport(nextViewport)}
      onDblClick={showAddMarkerPopup}
    >
      {logEntries.map((entry) => (
        <React.Fragment key={`fragment-${entry._id}`}>
          <Marker
            key={`marker-${entry._id}`}
            latitude={entry.latitude}
            longitude={entry.longitude}
            // offsetLeft={-12}
            // offsetTop={-24}
          >
            <div onClick={() => handleMarkerClick(entry._id)}>
              <img
                style={{
                  height: `${6 * viewport.zoom}px`,
                  width: `${6 * viewport.zoom}px`,
                }}
                src='https://i.imgur.com/y0G5YTX.png'
                alt='marker'
                className='marker'
              />
            </div>
          </Marker>
          {showPopup[entry._id] && (
            <Popup
              key={`popup-${entry._id}`}
              latitude={entry.latitude}
              longitude={entry.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => handlePopupClose()}
              anchor='top'
            >
              <div className='popup'>
                {error && <h3 className='error'>{error}</h3>}
                <h3>{entry.title}</h3>
                <p>{entry.comments}</p>
                <p>
                  Visited on {new Date(entry.visitDate).toLocaleDateString()}
                </p>
                {entry.image && <img src={entry.image} alt='entry-title' />}

                {!isDeleteClicked && (
                  <button onClick={() => handleUpdate(entry._id)}>
                    Update Log
                  </button>
                )}
                {isDeleteClicked && (
                  <div>
                    <label htmlFor='apiKey'>Enter API Key to Delete Log:</label>
                    <input
                      type='password'
                      name='apiKey'
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                  </div>
                )}
                <button onClick={() => handleDelete(entry._id, apiKey)}>
                  Delete Log
                </button>
              </div>
            </Popup>
          )}
          {showUpdate[entry._id] && (
            <Popup
              latitude={entry.latitude}
              longitude={entry.longitude}
              closeButton={true}
              closeOnClick={false}
              dynamicPosition={true}
              onClose={() => handlePopupClose()}
              anchor='top'
            >
              <div className='popup'>
                <LogEntryForm
                  onClose={() => {
                    setShowUpdate({});
                    getEntries();
                  }}
                  latitude={entry.latitude}
                  longitude={entry.longitude}
                  title={entry.title}
                  comments={entry.comments}
                  image={entry.image}
                  description={entry.description}
                  isUpdateForm={true}
                  id={entry._id}
                />
              </div>
            </Popup>
          )}
        </React.Fragment>
      ))}
      {addEntryLocation && (
        <>
          <Marker
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
          >
            <div>
              <img
                style={{
                  height: `${6 * viewport.zoom}px`,
                  width: `${6 * viewport.zoom}px`,
                }}
                src='https://i.imgur.com/y0G5YTX.png'
                alt='marker'
                className='marker'
              />
            </div>
          </Marker>
          <Popup
            latitude={addEntryLocation.latitude}
            longitude={addEntryLocation.longitude}
            closeButton={true}
            closeOnClick={false}
            dynamicPosition={true}
            onClose={() => setAddEntryLocation(null)}
            anchor='top'
          >
            <div className='popup'>
              <LogEntryForm
                onClose={() => {
                  setAddEntryLocation(null);
                  getEntries();
                }}
                latitude={addEntryLocation.latitude}
                longitude={addEntryLocation.longitude}
              />
            </div>
          </Popup>
        </>
      )}
    </ReactMapGL>
  );
};

export default App;
