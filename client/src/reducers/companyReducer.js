import {
  COMPANY_LOGIN_REQUEST,
  COMPANY_LOGIN_SUCCESS,
  COMPANY_LOGIN_FAIL,
  COMPANY_LOGOUT,
  COMPANY_REGISTER_REQUEST,
  COMPANY_REGISTER_SUCCESS,
  COMPANY_REGISTER_FAIL,
  COMPANY_LOAD_REQUEST,
  COMPANY_LOAD_SUCCESS,
  COMPANY_LOAD_FAIL,
  COMPANY_UPDATE_PROFILE_REQUEST,
  COMPANY_UPDATE_PROFILE_SUCCESS,
  COMPANY_UPDATE_PROFILE_FAIL,
  COMPANY_UPDATE_LOGO_REQUEST,
  COMPANY_UPDATE_LOGO_SUCCESS,
  COMPANY_UPDATE_LOGO_FAIL,
  CLEAR_ERRORS,
} from "../constants/CompanyConstants";

export const companyReducer = (state = { company: {} }, action) => {
  switch (action.type) {
    case COMPANY_LOGIN_REQUEST:
    case COMPANY_REGISTER_REQUEST:
    case COMPANY_LOAD_REQUEST:
    case COMPANY_UPDATE_PROFILE_REQUEST:
    case COMPANY_UPDATE_LOGO_REQUEST:
      return {
        loading: true,
        isCompany: false,
      };

    case COMPANY_LOGIN_SUCCESS:
    case COMPANY_REGISTER_SUCCESS:
    case COMPANY_LOAD_SUCCESS:
    case COMPANY_UPDATE_PROFILE_SUCCESS:
    case COMPANY_UPDATE_LOGO_SUCCESS:
      return {
        ...state,
        loading: false,
        isCompany: true,
        company: action.payload,
      };

    case COMPANY_LOGIN_FAIL:
    case COMPANY_REGISTER_FAIL:
    case COMPANY_LOAD_FAIL:
    case COMPANY_UPDATE_PROFILE_FAIL:
    case COMPANY_UPDATE_LOGO_FAIL:
      return {
        loading: false,
        isCompany: false,
        company: null,
        error: action.payload,
      };

    case COMPANY_LOGOUT:
      return {
        loading: false,
        isCompany: false,
        company: null,
      };

    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};
