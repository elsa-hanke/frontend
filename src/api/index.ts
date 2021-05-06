import axios from 'axios'
import { storeRouteAndRedirectToLogin } from '@/utils/local-storage'

export const ELSA_API_LOCATION =
  process.env.NODE_ENV === 'production'
    ? `${window.location.protocol}//api.${window.location.hostname}${
        window.location.port ? ':' + window.location.port : ''
      }`
    : ''
axios.defaults.baseURL = `${ELSA_API_LOCATION}/api/`
axios.defaults.withCredentials = true
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response.status === 401) {
      storeRouteAndRedirectToLogin()
      window.location.href = `${ELSA_API_LOCATION}/oauth2/authorization/oidc`
    }
    return Promise.reject({ ...error })
  }
)
