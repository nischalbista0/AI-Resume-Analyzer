import {
  companyLoginRequest,
  companyLoginSuccess,
  companyLoginFail,
  companyRegisterRequest,
  companyRegisterSuccess,
  companyRegisterFail,
  loadCompanyRequest,
  loadCompanySuccess,
  loadCompanyFail,
  updateCompanyProfileRequest,
  updateCompanyProfileSuccess,
  updateCompanyProfileFail,
  updateCompanyLogoRequest,
  updateCompanyLogoSuccess,
  updateCompanyLogoFail,
  companyLogout,
  clearErrors,
} from "../slices/CompanySlice";
import axios from "axios";
import { toast } from "react-hot-toast";

// Company Login
export const companyLogin = (email, password) => async (dispatch) => {
  try {
    dispatch(companyLoginRequest());

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "http://localhost:3000/api/v1/company/login",
      { email, password },
      config
    );

    if (data.success) {
      localStorage.setItem("companyToken", data.token);

      // Get company profile after successful login
      const profileConfig = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
      };

      const profileData = await axios.get(
        "http://localhost:3000/api/v1/company/me",
        profileConfig
      );

      dispatch(companyLoginSuccess(profileData.data.company));
      toast.success("Login successful!");
    } else {
      dispatch(companyLoginFail(data.message || "Login failed"));
      toast.error(data.message || "Login failed");
    }
  } catch (error) {
    dispatch(companyLoginFail(error.response?.data?.message || "Login failed"));
    toast.error(error.response?.data?.message || "Login failed");
  }
};

// Company Register
export const companyRegister = (companyData) => async (dispatch) => {
  try {
    dispatch(companyRegisterRequest());

    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      "http://localhost:3000/api/v1/company/register",
      companyData,
      config
    );

    dispatch(companyRegisterSuccess(data));
    localStorage.setItem("companyToken", data.token);
    toast.success("Registration successful!");
  } catch (error) {
    dispatch(
      companyRegisterFail(
        error.response?.data?.message || "Registration failed"
      )
    );
    toast.error(error.response?.data?.message || "Registration failed");
  }
};

// Load Company
export const loadCompany = () => async (dispatch) => {
  try {
    dispatch(loadCompanyRequest());

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("companyToken")}`,
      },
    };

    const { data } = await axios.get(
      "http://localhost:3000/api/v1/company/me",
      config
    );

    dispatch(loadCompanySuccess(data));
  } catch (error) {
    dispatch(
      loadCompanyFail(
        error.response?.data?.message || "Failed to load company data"
      )
    );
  }
};

// Update Company Profile
export const updateCompanyProfile = (companyData) => async (dispatch) => {
  try {
    dispatch(updateCompanyProfileRequest());

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("companyToken")}`,
      },
    };

    const { data } = await axios.put(
      "http://localhost:3000/api/v1/company/update/profile",
      companyData,
      config
    );

    dispatch(updateCompanyProfileSuccess(data));
    toast.success("Profile updated successfully!");
  } catch (error) {
    dispatch(
      updateCompanyProfileFail(
        error.response?.data?.message || "Failed to update profile"
      )
    );
    toast.error(error.response?.data?.message || "Failed to update profile");
  }
};

// Update Company Logo
export const updateCompanyLogo = (formData) => async (dispatch) => {
  try {
    dispatch(updateCompanyLogoRequest());

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("companyToken")}`,
      },
    };

    const { data } = await axios.put(
      "http://localhost:3000/api/v1/company/update/logo",
      formData,
      config
    );

    dispatch(updateCompanyLogoSuccess(data));
    toast.success("Logo updated successfully!");
  } catch (error) {
    dispatch(
      updateCompanyLogoFail(
        error.response?.data?.message || "Failed to update logo"
      )
    );
    toast.error(error.response?.data?.message || "Failed to update logo");
  }
};

// Company Logout
export const logoutCompany = () => async (dispatch) => {
  try {
    localStorage.removeItem("companyToken");
    dispatch(companyLogout());
    toast.success("Logged out successfully!");
  } catch (error) {
    console.log(error);
  }
};

// Clear Errors
export const clearCompanyErrors = () => async (dispatch) => {
  dispatch(clearErrors());
};
