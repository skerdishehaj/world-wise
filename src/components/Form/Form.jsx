// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from 'react';

import styles from './Form.module.css';
import Button from '../Button';
import BackButton from '../BackButton';
import Message from '../Message';
import Spinner from '../Spinner';
import { useURLPosition } from '../../hooks/useURLPosition';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useCities } from '../../contexts/CitiesContext';
import { useNavigate } from 'react-router-dom';
const BASE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const { lat, lng } = useURLPosition();
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();

  const [cityName, setCityName] = useState('');
  const [country, setCountry] = useState('');
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [emoji, setEmoji] = useState(null);
  const [isLoadinGeocoding, setIsLoadingGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cityName || !date) {
      return;
    }
    const newTrip = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: { lat, lng },
    };
    console.log(newTrip);
    await createCity(newTrip);
    navigate('/app');
  };

  useEffect(() => {
    const fetchCity = async () => {
      if (!lat && !lng) {
        return;
      }
      try {
        setGeocodingError('');
        setIsLoadingGeocoding(true);
        const response = await fetch(
          `${BASE_URL}?latitude=${lat}&longitude=${lng}`,
        );
        const data = await response.json();
        console.table(data);
        setCityName(
          data.city || data.locality || data.principalSubdivision || '',
        );

        if (!data.countryCode) {
          throw new Error(
            'There does not seem to be a city. Click somewhere else 😉',
          );
        }

        setCountry(data.countryName || '');
        setEmoji(convertToEmoji(data.countryCode || ''));
        setIsLoadingGeocoding(false);
        setGeocodingError('');
      } catch (error) {
        setGeocodingError(error.message);
      } finally {
        setIsLoadingGeocoding(false);
      }
    };
    fetchCity();
  }, [lat, lng]);

  if (isLoadinGeocoding) {
    return <Spinner />;
  }

  if (!lat && !lng) {
    return <Message message='Start by clicking somewhere in the map' />;
  }

  if (geocodingError) {
    return <Message message={geocodingError} />;
  }

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ''}`}
      onSubmit={handleSubmit}
    >
      <div className={styles.row}>
        <label htmlFor='cityName'>City name</label>
        <input
          id='cityName'
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor='date'>When did you go to {cityName}?</label>
        <DatePicker
          id='date'
          onChange={(date) => setDate(date)}
          selected={date}
          dateFormat={'dd/MM/yyyy'}
        />
      </div>

      <div className={styles.row}>
        <label htmlFor='notes'>Notes about your trip to {cityName}</label>
        <textarea
          id='notes'
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type='primary'>Add</Button>
        <BackButton />
      </div>
    </form>
  );
}

export default Form;

