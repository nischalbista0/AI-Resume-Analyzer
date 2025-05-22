import { createSlice } from "@reduxjs/toolkit";

const CompanySlice = createSlice({
  name: "company",
  initialState: {
    loading: false,
    error: null,
    isCompany: false,
    company: {
      _id: "",
      name: "",
      email: "",
      phone: "",
      website: "",
      location: "",
      description: "",
      logo: "",
      postedJobs: [],
      applications: [],
      createdAt: "",
    },
  },
  reducers: {
    companyLoginRequest: (state) => {
      state.loading = true;
    },
    companyLoginSuccess: (state, action) => {
      state.loading = false;
      state.isCompany = true;
      state.company = action.payload;
    },
    companyLoginFail: (state, action) => {
      state.loading = false;
      state.isCompany = false;
      state.error = action.payload;
    },

    companyRegisterRequest: (state) => {
      state.loading = true;
    },
    companyRegisterSuccess: (state, action) => {
      state.loading = false;
      state.isCompany = true;
      state.company = action.payload;
    },
    companyRegisterFail: (state, action) => {
      state.loading = false;
      state.isCompany = false;
      state.error = action.payload;
    },

    loadCompanyRequest: (state) => {
      state.loading = true;
    },
    loadCompanySuccess: (state, action) => {
      state.loading = false;
      state.isCompany = true;
      state.company = action.payload;
    },
    loadCompanyFail: (state, action) => {
      state.loading = false;
      state.isCompany = false;
      state.error = action.payload;
    },

    updateCompanyProfileRequest: (state) => {
      state.loading = true;
    },
    updateCompanyProfileSuccess: (state, action) => {
      state.loading = false;
      state.company = action.payload;
    },
    updateCompanyProfileFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateCompanyLogoRequest: (state) => {
      state.loading = true;
    },
    updateCompanyLogoSuccess: (state, action) => {
      state.loading = false;
      state.company = action.payload;
    },
    updateCompanyLogoFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    companyLogout: (state) => {
      state.isCompany = false;
      state.company = {
        _id: "",
        name: "",
        email: "",
        phone: "",
        website: "",
        location: "",
        description: "",
        logo: "",
        postedJobs: [],
        applications: [],
        createdAt: "",
      };
    },

    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const {
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
} = CompanySlice.actions;

export default CompanySlice.reducer;
