import {
  newPostRequest,
  newPostSuccess,
  newPostFail,
  allJobsRequest,
  allJobsSuccess,
  allJobsFail,
  jobDetailsRequest,
  jobDetailsSuccess,
  jobDetailsFail,
  jobSaveRequest,
  jobSaveSuccess,
  jobSaveFail,
  getSavedJobsRequest,
  getSavedJobsSuccess,
  getSavedJobsFail,
} from "../slices/JobSlice";
import { toast } from "react-hot-toast";
import axios from "axios";
import { me } from "./UserActions";

export const createJobPost = (jobData) => async (dispatch) => {
  try {
    dispatch(newPostRequest());

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("companyToken")}`,
      },
    };

    const { data } = await axios.post(
      "http://localhost:3000/api/v1/company/jobs",
      jobData,
      config
    );

    dispatch(newPostSuccess(data));
    return { success: true };
  } catch (err) {
    dispatch(newPostFail(err.response?.data?.message || "Failed to post job"));
    throw err;
  }
};

export const getAllJobs = () => async (dispatch) => {
  try {
    dispatch(allJobsRequest());

    const { data } = await axios.get("http://localhost:3000/api/v1/jobs");

    dispatch(allJobsSuccess(data.Jobs));
  } catch (err) {
    dispatch(
      allJobsFail(err.response?.data?.message || "Failed to fetch jobs")
    );
  }
};

export const getSingleJob = (id) => async (dispatch) => {
  try {
    dispatch(jobDetailsRequest());

    const { data } = await axios.get(`http://localhost:3000/api/v1/job/${id}`);

    dispatch(jobDetailsSuccess(data.job));
  } catch (err) {
    dispatch(
      jobDetailsFail(
        err.response?.data?.message || "Failed to fetch job details"
      )
    );
  }
};

export const saveJob = (id) => async (dispatch) => {
  try {
    dispatch(jobSaveRequest());

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.post(
      `http://localhost:3000/api/v1/saveJob/${id}`,
      {},
      config
    );

    dispatch(jobSaveSuccess());
    dispatch(me());
    toast.success(data.message || "Job saved successfully!");
  } catch (err) {
    dispatch(jobSaveFail(err.response?.data?.message || "Failed to save job"));
    toast.error(err.response?.data?.message || "Failed to save job");
  }
};

export const getSavedJobs = () => async (dispatch) => {
  try {
    dispatch(getSavedJobsRequest());

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
    };

    const { data } = await axios.get(
      "http://localhost:3000/api/v1/savedJobs",
      config
    );

    dispatch(getSavedJobsSuccess(data));
  } catch (err) {
    dispatch(
      getSavedJobsFail(
        err.response?.data?.message || "Failed to fetch saved jobs"
      )
    );
  }
};
