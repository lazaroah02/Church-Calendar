export const BASE_URL = process.env.NODE_ENV === "development" ? 'http://192.168.1.202:8000' : 'https://laresurreccioncalendar.pythonanywhere.com';

export const EVENTS_URL = `${BASE_URL}/api/events`
export const CHURCH_GROUPS_URL = `${BASE_URL}/api/church-groups/`

//authentication endpoints
export const LOGIN_URL = `${BASE_URL}/api/auth/login/`
export const REGISTER_URL = `${BASE_URL}/api/auth/register/`
export const LOGOUT_URL = `${BASE_URL}/api/auth/logout/`
export const USER_PROFILE_URL = `${BASE_URL}/api/auth/user/`
export const CHANGE_PASSWORD_URL = `${BASE_URL}/api/auth/password/change/`

//management endpoints
export const MANAGE_EVENTS_URL = `${BASE_URL}/api/events/manage/`
export const MANAGE_RESERVATIONS_URL = `${BASE_URL}/api/reservations/manage/`
export const MANAGE_USERS_URL = `${BASE_URL}/api/users/manage/`
export const MANAGE_GROUPS_URL = `${BASE_URL}/api/church-groups/manage/`

//notifications endpoints
export const USER_NOTIFICATION_TOKEN_URL = `${BASE_URL}/api/notification/user-devices-notification-info/`
export const NOTIFY_ABOUT_EVENT_URL = `${BASE_URL}/api/notification/send-notification-about-event/`

export const VERSIONS_FILE_URL = "https://laresurreccioncalendar.pythonanywhere.com/static/versions.json"