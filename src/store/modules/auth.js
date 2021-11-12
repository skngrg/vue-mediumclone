import authApi from '@/api/auth'
import { setItem } from '@/helpers/persistanceStorage'

const state = {
  isSubmitting: false,
  isLoggedIn: null,
  currentUser: null,
  validationErrors: null,
  isLoading: false
}

export const mutationTypes = {
  registerStart: '[auth] registerStart',
  registerSuccess: '[auth] registerSuccess',
  registerFailure: '[auth] registerFailure',

  loginStart: '[auth] loginStart',
  loginSuccess: '[auth] loginSuccess',
  loginFailure: '[auth] loginFailure',

  getCurrentUserStart: '[auth] getCurrentUserStart',
  getCurrentUserSuccess: '[auth] getCurrentUserSuccess',
  getCurrentUserFailure: '[auth] getCurrentUserFailure'

}

export const actionsTypes = {
  register: '[auth] register',
  login: '[auth] login',
  getCurrentUser: '[auth] getCurrentUser'
}

export const getterTypes = {
  currentUser: '[auth] currentUser',
  isLoggedIn: '[auth] isLoggedIn',
  isAnonymous: '[auth] isAnonymous',
}

function start(state) {
  state.isSubmitting = true
  state.validationErrors = null
}

function success(state, payload) {
  state.isSubmitting = false
  state.isLoggedIn = true
  state.currentUser = payload
}

function failure(state, payload) {
  state.isSubmitting = false
  state.validationErrors = payload
}

const getters = {
  [getterTypes.currentUser]: state => state.currentUser,
  [getterTypes.isLoggedIn]: state => Boolean(state.isLoggedIn),
  [getterTypes.isAnonymous]: state => state.isLoggedIn === false
}

const mutations = {
  [mutationTypes.registerStart](state) {
    start(state);
  },
  [mutationTypes.registerSuccess](state, payload) {
    success(state, payload);
  },
  [mutationTypes.registerFailure](state, payload) {
    failure(state, payload);
  },
  [mutationTypes.loginStart](state) {
    start(state);
  },
  [mutationTypes.loginSuccess](state, payload) {
    success(state, payload);
  },
  [mutationTypes.loginFailure](state, payload) {
    failure(state, payload);
  },
  [mutationTypes.getCurrentUserStart](state) {
    state.isLoading = true;
  },
  [mutationTypes.getCurrentUserSuccess](state, payload) {
    state.isLoading = false;
    state.currentUser = payload;
    state.isLoggedIn = true;
  },
  [mutationTypes.getCurrentUserFailure](state) {
    state.isLoading = false;
    state.isLoggedIn = false;
    state.currentUser = null;
  }
}

const actions = {
  [actionsTypes.register](context, credentials) {
    return new Promise(resolve => {
      context.commit(mutationTypes.registerStart)
      authApi
        .register(credentials)
        .then(response => {
          context.commit(mutationTypes.registerSuccess, response.data.user)
          setItem('accessToken', response.data.user.token)
          resolve(response.data.user)
        })
        .catch(result => {
          context.commit(mutationTypes.registerFailure, result.response.data.errors)
        })
    })
  },
  [actionsTypes.login](context, credentials) {
    return new Promise(resolve => {
      context.commit(mutationTypes.loginStart)
      authApi
          .login(credentials)
          .then(response => {
            context.commit(mutationTypes.loginSuccess, response.data.user)
            setItem('accessToken', response.data.user.token)
            resolve(response.data.user)
          })
          .catch(result => {
            context.commit(mutationTypes.loginFailure, result.response.data.errors)
          })
    })
  },
  [actionsTypes.getCurrentUser](context) {
    return new Promise(resolve => {
      context.commit(mutationTypes.getCurrentUserStart)
      authApi
          .getCurrentUser()
          .then(response => {
            context.commit(mutationTypes.getCurrentUserSuccess, response.data.user)
            resolve(response.data.user)
          })
          .catch(() => {
            context.commit(mutationTypes.getCurrentUserFailure)
          })
    })
  }
}

export default {
  state,
  actions,
  mutations,
  getters
}
