import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Pricing from './pages/Pricing';
import Product from './pages/Product';
import Homepage from './pages/Homepage';
import PageNotFound from './pages/PageNotFound';
import AppLayout from './pages/AppLayout';
import Login from './pages/Login';
import CityList from './components/City/CityList';
import City from './components/City/City';
import Form from './components/Form/Form';
import { useEffect, useState } from 'react';
import CountryList from './components/Country/CountryList';

const BASE_URL = 'http://localhost:5000';

function App() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchCities = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/cities`);
        const cities = await response.json();
        setCities(cities);
        console.table(cities);
        setIsLoading(false);
      } catch (error) {
        alert(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCities();
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={<Homepage />}
        />
        <Route
          path='product'
          element={<Product />}
        />
        <Route
          path='pricing'
          element={<Pricing />}
        />
        <Route
          path='login'
          element={<Login />}
        />

        <Route
          path='app'
          element={<AppLayout />}
        >
          <Route
            index
            element={<Navigate to='cities' />}
            replace // replace the current entry in the history stack; User can now return to the homepage by clicking the back button
          />
          <Route
            path='cities'
            element={
              <CityList
                cities={cities}
                isLoading={isLoading}
              />
            }
          />
          <Route
            path='cities/:id'
            element={<City />}
          />
          <Route
            path='countries'
            element={<CountryList cities={cities} />}
          />
          <Route
            path='form'
            element={<Form />}
          />
        </Route>

        <Route
          path='*'
          element={<PageNotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
