export const BASE_URL = `http://localhost:3000`;

const URL = `${BASE_URL}/api`;

export const API_ROUTES = {
    AUTH: {
        LOGIN: `${URL}/auth/login`,
        SIGNUP: `${URL}/auth/signup`,
        LOGOUT: `${URL}/auth/logout`,
        REFRESH: `${URL}/auth/refresh`
    },
    USERS: {
        ME: `${URL}/users/me`,
        BY_ID: (id) => `${URL}/users/${id}`,
    },
    BICYCLES: {
        ALL: `${URL}/bicycles`,
        BY_ID: (id) => `${URL}/bicycles/${id}`,
    },
    BICYCLE_TYPES: {
        ALL: `${URL}/bicycle-types`
    },
    STATIONS: {
        ROOT: `${URL}/stations`,
    },
    RENTALS: {
        CREATE: `${URL}/rental`,
        HISTORY: (userId) => `${URL}/rental/user/${userId}`,
        END: (id) => `${URL}/rental/${id}/end`,
    },
};
