import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/FakeAuthContext';
import { CitiesProvider } from './contexts/CitiesContext';
import { Suspense, lazy } from 'react';
import ProtectedRoute from './pages/ProtectedRoute';

import SpinnerFullPage from './components/SpinnerFullPage';
import CityList from './components/City/CityList';
import City from './components/City/City';
import Form from './components/Form/Form';
import CountryList from './components/Country/CountryList';

// * This way the bundle size would be larger, cuz all files would be loaded at once
// import Product from './pages/Product/Product';
// import Pricing from './pages/Pricing';
// import Homepage from './pages/Homepage/Homepage';
// import Login from './pages/Login/Login';
// import AppLayout from './pages/AppLayout/AppLayout';
// import PageNotFound from './pages/PageNotFound';

// * Suspense is a concurrent React feature that lets your components "wait" for something before they can render.
// * Here we uses lazy loading and suspense for the pages so the bundle size would be smaller as it would be divided into smaller chunks and the pages would be loaded only when needed

const Product = lazy(() => import('./pages/Product/Product'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Homepage = lazy(() => import('./pages/Homepage/Homepage'));
const Login = lazy(() => import('./pages/Login/Login'));
const AppLayout = lazy(() => import('./pages/AppLayout/AppLayout'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
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
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route
                  index
                  element={
                    <Navigate
                      replace
                      to='cities'
                    />
                  }
                  // !replace the current entry in the history stack with the new one;
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
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}

export default App;
