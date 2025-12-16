export const BASE_URL = `http://localhost:3000`;

const URL = `${BASE_URL}/api`;

export const API_ROUTES = {
    AUTH: {
        BASE: `${URL}/auth`,
        LOGIN: `${URL}/auth/login`,
        SIGNUP: `${URL}/auth/signup`,
        LOGOUT: `${URL}/auth/logout`,
        REFRESH: `${URL}/auth/refresh`
    },
    USERS: {
        ME: `${URL}/user/me`,
        BY_ID: (id) => `${URL}/user/${id}`,
        UPDATE: (id) => `${URL}/user/${id}`,
        SET_IMAGE: (id) => `${URL}/user/${id}/image`,
    },
    BICYCLES: {
        ALL: `${URL}/bicycles`,
        BY_ID: (id) => `${URL}/bicycles/${id}`,
    },
    BICYCLE_MODELS: {
        ALL: `${URL}/bicycle-model`,
        BY_ID: (id) => `${URL}/bicycle-model/${id}`,
    },

    BICYCLE_TYPES: {
        ALL: `${URL}/bicycle-types`
    },
    STATIONS: {
        ROOT: `${URL}/station`,
        BICYCLE_STATIONS: (id) => `${URL}/station/bicycle-model/${id}`,
    },
    RENTALS: {
        CREATE: `${URL}/rental`,
        HISTORY: (userId) => `${URL}/rental/user/${userId}`,
        FINISH: (id) => `${URL}/rental/${id}/finish`,
        CANCEL: (id) => `${URL}/rental/${id}/cancel`,
    },
};
