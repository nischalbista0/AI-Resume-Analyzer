import { createSlice } from "@reduxjs/toolkit";
import {
  GET_APPLIED_JOBS_REQUEST,
  GET_APPLIED_JOBS_SUCCESS,
  GET_APPLIED_JOBS_FAIL,
  CREATE_APPLICATION_REQUEST,
  CREATE_APPLICATION_SUCCESS,
  CREATE_APPLICATION_FAIL,
  GET_SINGLE_APPLICATION_REQUEST,
  GET_SINGLE_APPLICATION_SUCCESS,
  GET_SINGLE_APPLICATION_FAIL,
  DELETE_APPLICATION_REQUEST,
  DELETE_APPLICATION_SUCCESS,
  DELETE_APPLICATION_FAIL,
  UPDATE_APPLICATION_STATUS_REQUEST,
  UPDATE_APPLICATION_STATUS_SUCCESS,
  UPDATE_APPLICATION_STATUS_FAIL,
  CLEAR_ERRORS,
} from "../constants/ApplicationConstants";

const ApplicationSlice = createSlice({
  name: "Application",
  initialState: {
    loading: false,
    error: null,
    appliedJobs: [],
    applicationDetails: {
      applicant: { _id: "", name: "", email: "" },
      applicantResume: {
        public_id: "",
        url: "",
      },
      job: {
        _id: "",
        title: "",
        companyName: "",
      },
      status: "",
      createdAt: "",
    },
  },
  reducers: {
    createApplicationRequest: (state) => {
      state.loading = true;
    },
    createApplicationSuccess: (state) => {
      state.loading = false;
    },
    createApplicationFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    allAppliedJobsRequest: (state) => {
      state.loading = true;
    },
    allAppliedJobsSuccess: (state, action) => {
      state.loading = false;
      state.appliedJobs = action.payload;
    },
    allAppliedJobsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    applicationDetailsRequest: (state) => {
      state.loading = true;
    },
    applicationDetailsSuccess: (state, action) => {
      state.loading = false;
      state.applicationDetails = action.payload;
    },
    applicationDetailsFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteApplicationRequest: (state) => {
      state.loading = true;
    },
    deleteApplicationSuccess: (state) => {
      state.loading = false;
    },
    deleteApplicationFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateApplicationStatusRequest: (state) => {
      state.loading = true;
    },
    updateApplicationStatusSuccess: (state, action) => {
      state.loading = false;
      state.appliedJobs = state.appliedJobs.map((job) =>
        job._id === action.payload._id ? action.payload : job
      );
      state.applicationDetails =
        state.applicationDetails?._id === action.payload._id
          ? action.payload
          : state.applicationDetails;
    },
    updateApplicationStatusFail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    clearErrors: (state) => {
      state.error = null;
    },
  },
});

export const {
  createApplicationRequest,
  createApplicationSuccess,
  createApplicationFail,
  allAppliedJobsRequest,
  allAppliedJobsSuccess,
  allAppliedJobsFail,
  applicationDetailsRequest,
  applicationDetailsSuccess,
  applicationDetailsFail,
  deleteApplicationRequest,
  deleteApplicationSuccess,
  deleteApplicationFail,
  updateApplicationStatusRequest,
  updateApplicationStatusSuccess,
  updateApplicationStatusFail,
  clearErrors,
} = ApplicationSlice.actions;

export default ApplicationSlice.reducer;
