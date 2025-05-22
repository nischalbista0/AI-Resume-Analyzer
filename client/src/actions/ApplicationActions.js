import axios from "axios";
import {
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
  clearErrors as clearApplicationErrors,
} from "../slices/ApplicationSlice";

import { me } from "../actions/UserActions";
import toast from "react-hot-toast";

import {
  CREATE_APPLICATION_REQUEST,
  CREATE_APPLICATION_SUCCESS,
  CREATE_APPLICATION_FAIL,
  GET_APPLIED_JOBS_REQUEST,
  GET_APPLIED_JOBS_SUCCESS,
  GET_APPLIED_JOBS_FAIL,
  GET_SINGLE_APPLICATION_REQUEST,
  GET_SINGLE_APPLICATION_SUCCESS,
  GET_SINGLE_APPLICATION_FAIL,
  DELETE_APPLICATION_REQUEST,
  DELETE_APPLICATION_SUCCESS,
  DELETE_APPLICATION_FAIL,
  CLEAR_ERRORS,
} from "../constants/ApplicationConstants";

export const createApplication = (id) => async (dispatch) => {
  try {
    dispatch(createApplicationRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.post(
      `http://localhost:3000/api/v1/createApplication/${id}`,
      {},
      config
    );

    dispatch(createApplicationSuccess());
    dispatch(me());
    return data;
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || "Failed to submit application";
    dispatch(createApplicationFail(errorMessage));
    dispatch(me());
    throw errorMessage;
  }
};

export const getAppliedJob = () => async (dispatch) => {
  try {
    dispatch(allAppliedJobsRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.get(
      "http://localhost:3000/api/v1/getAllApplication",
      config
    );

    dispatch(allAppliedJobsSuccess(data.allApplications));
  } catch (err) {
    dispatch(allAppliedJobsFail());
  }
};

export const getSingleApplication = (id) => async (dispatch) => {
  try {
    dispatch(applicationDetailsRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.get(
      `http://localhost:3000/api/v1/singleApplication/${id}`,
      config
    );

    dispatch(applicationDetailsSuccess(data.application));
  } catch (err) {
    dispatch(applicationDetailsFail());
  }
};

export const deleteApplication = (id) => async (dispatch) => {
  try {
    dispatch(deleteApplicationRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.delete(
      `http://localhost:3000/api/v1/deleteApplication/${id}`,
      config
    );

    dispatch(deleteApplicationSuccess());
    dispatch(getAppliedJob());
    dispatch(me());

    toast.success("Application Deleted Successfully!");
  } catch (err) {
    dispatch(
      deleteApplicationFail(
        err.response?.data?.message || "Failed to delete application"
      )
    );
    toast.error(err.response?.data?.message || "Failed to delete application");
  }
};

export const updateApplicationStatus = (id, status) => async (dispatch) => {
  try {
    dispatch(updateApplicationStatusRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("companyToken")}`,
      },
    };

    const { data } = await axios.put(
      `http://localhost:3000/api/v1/company/updateApplicationStatus/${id}`,
      { status },
      config
    );

    dispatch(updateApplicationStatusSuccess(data.application));
    return data;
  } catch (error) {
    dispatch(updateApplicationStatusFail(error.response?.data?.message));
    return Promise.reject(error.response?.data?.message);
  }
};

export const clearApplicationErrorsAction = () => async (dispatch) => {
  dispatch(clearApplicationErrors());
};

export const getCompanyApplications = () => async (dispatch) => {
  try {
    dispatch(allAppliedJobsRequest());

    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("companyToken")}`,
      },
    };

    const { data } = await axios.get(
      "http://localhost:3000/api/v1/company/applications",
      config
    );

    dispatch(allAppliedJobsSuccess(data.applications));
  } catch (err) {
    dispatch(
      allAppliedJobsFail(
        err.response?.data?.message || "Failed to fetch applications"
      )
    );
    toast.error(err.response?.data?.message || "Failed to fetch applications");
  }
};

// Get applications for a specific job
export const getJobApplications = (jobId) => async (dispatch) => {
  try {
    dispatch({ type: "GET_JOB_APPLICATIONS_REQUEST" });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("companyToken")}`,
      },
    };

    const { data } = await axios.get(
      `http://localhost:3000/api/v1/company/jobs/${jobId}/applications`,
      config
    );

    dispatch({
      type: "GET_JOB_APPLICATIONS_SUCCESS",
      payload: data.applications,
    });
  } catch (error) {
    dispatch({
      type: "GET_JOB_APPLICATIONS_FAIL",
      payload: error.response?.data?.message || "Failed to fetch applications",
    });
  }
};
