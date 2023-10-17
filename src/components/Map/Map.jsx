import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Map.module.css';
function Map() {
  const navigate = useNavigate();
  const [searchParams, serSearchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  console.log(lat, lng);
  return (
    <div
      className={styles.mapContainer}
      onClick={() => {
        navigate('form');
      }}
    >
      Map: {lat},{lng}
      <button
        onClick={() => {
          serSearchParams({ lat: 10, lng: 20 });
        }}
      >
        Change pos
      </button>
    </div>
  );
}

export default Map;
