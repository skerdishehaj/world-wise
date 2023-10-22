import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Pricing from './pages/Pricing';
import Product from './pages/Product/Product';
import Homepage from './pages/Homepage/Homepage';
import PageNotFound from './pages/PageNotFound';
import AppLayout from './pages/AppLayout/AppLayout';
import Login from './pages/Login/Login';
import CityList from './components/City/CityList';
import City from './components/City/City';
import Form from './components/Form/Form';
import CountryList from './components/Country/CountryList';
import { AuthProvider } from './contexts/FakeAuthContext';
import { CitiesProvider } from './contexts/CitiesContext';

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
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
                replace // !replace the current entry in the history stack with the new one;
                // ! User can now return to the homepage by clicking the back button
              />
              <Route
                path='cities'
                element={<CityList />}
              />
              <Route
                path='cities/:id'
                element={<City />}
              />
              <Route
                path='countries'
                element={<CountryList />}
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
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
