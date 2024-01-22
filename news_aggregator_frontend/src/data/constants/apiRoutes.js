const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AUTH = "auth";
const LOGIN = "login";
const SIGN_UP = "signUp";
const PREFERENCES = "userPreference";
const GET_ALL_PREFERENCES = "getPreferencesData";
const ARTICLE = "article";

export const USER_LOGIN = `${API_BASE_URL}/${AUTH}/${LOGIN}`;
export const USER_SIGN_UP = `${API_BASE_URL}/${AUTH}/${SIGN_UP}`;
export const USER_PREFERENCES = `${API_BASE_URL}/${PREFERENCES}`;
export const ALL_PREFERENCES = `${API_BASE_URL}/${GET_ALL_PREFERENCES}`;
export const ALL_ARTICLES = `${API_BASE_URL}/${ARTICLE}`;
