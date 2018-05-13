export const SET_NAV = "nav/SET_NAV";
export const SET_CMS_NAV = "nav/SET_CMS_NAV";

const INITIAL_STATE = {
  nav: "App",
  cmsNav: "CmsArtists"
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_NAV:
      return {
        ...state,
        nav: action.payload.nav
      };
    case SET_CMS_NAV:
      return {
        ...state,
        cmsNav: action.payload.cmsNav
      };
    default:
      return state;
  }
};