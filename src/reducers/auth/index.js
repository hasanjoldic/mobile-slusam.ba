export const AUTH_LOGIN_START = "auth/LOGIN";
export const AUTH_LOGIN_SUCCESS = "auth/LOGIN_SUCCESS";
export const AUTH_LOGIN_FAIL = "auth/LOGIN_FAILED";
export const AUTH_LOGOUT = "auth/LOGOUT";

const INITIAL_STATE = {
    isLoading: false,
    isLoggedIn: false,
    jwt: "", 
    user: null,
    email: ""
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AUTH_LOGIN_START:
      return {
        ...state,
        isLoading: true
      };
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoggedIn: true,
        jwt: action.payload.jwt,
        user: action.payload.user,
        email: action.payload.email
      };
    case AUTH_LOGIN_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        email: ""
      };
    default:
      return state;
  }
};