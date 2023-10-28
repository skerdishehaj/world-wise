import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";

// ! Base URL for the API
const BASE_URL = "http://localhost:5000";

// ! Create the context
const CitiesContext = createContext();

// ! Initial state
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

// ! Reducer function to determine state changes based on dispatched actions
const reducer = (state, action) => {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case "cities/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "cities/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    default:
      throw new Error(`Unrecognized action: ${action.type}`);
  }
};

// ! Provider component that wraps your app and makes data available to any child component that calls the useCities() hook.
const CitiesProvider = ({ children }) => {
  // ! Using useReducer instead of useState because we have multiple states that are related
  const [state, dispatch] = useReducer(reducer, initialState);

  // ! Destructure the state
  const { cities, isLoading, currentCity, error } = state;

  // ! Get all cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      dispatch({ type: "loading" });
      try {
        const response = await fetch(`${BASE_URL}/cities`);
        const cities = await response.json();
        dispatch({ type: "cities/loaded", payload: cities });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: "Something went wrong getting the cities!",
        });
      }
    };
    fetchCities();
  }, []);

  // ! Get a single city
  const getCity = useCallback(
    async (id) => {
      if (+id === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        const response = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await response.json();
        dispatch({ type: "city/loaded", payload: data });
      } catch (error) {
        dispatch({
          type: "rejected",
          payload: `Something went wrong getting the city: ${id}.`,
        });
      }
    },
    [currentCity.id],
  );

  // ! Delete a city
  const deleteCity = async (id) => {
    dispatch({ type: "loading" });
    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "cities/deleted", payload: id });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: `Something went wrong deleting the city: ${id}.`,
      });
    }
  };

  // ! Create a city
  const createCity = async (newCity) => {
    dispatch({ type: "loading" });
    try {
      const response = await fetch(`${BASE_URL}/cities/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCity),
      });
      const data = await response.json();
      dispatch({ type: "cities/created", payload: data });
    } catch (error) {
      dispatch({
        type: "rejected",
        payload: `Something went wrong creating the city: ${newCity.cityName}.`,
      });
    }
  };

  // ! Return the provider component
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
};

// ! Custom hook for using the cities context
const useCities = () => {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return context;
};

export { CitiesProvider, useCities };
