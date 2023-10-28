import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();
const initialState = {
  user: null,
  isAuthenticated: false,
};
const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};
const auth = Object.freeze({
  LOGIN: "login",
  LOGOUT: "logout",
});

const reducer = (state, action) => {
  switch (action.type) {
    case auth.LOGIN:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case auth.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    default:
      throw new Error(`Unrecognized action: ${action.type}`);
  }
};

const AuthProvider = ({ children }) => {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState,
  );

  const login = (email, password) => {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({
        type: auth.LOGIN,
        payload: FAKE_USER,
      });
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const logout = () => {
    if (isAuthenticated) {
      dispatch({
        type: auth.LOGOUT,
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
