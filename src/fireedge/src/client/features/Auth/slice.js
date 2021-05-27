import { createSlice } from '@reduxjs/toolkit'

import { login, getUser, logout, changeFilter, changeGroup } from 'client/features/Auth/actions'
import { JWT_NAME, FILTER_POOL, DEFAULT_SCHEME, DEFAULT_LANGUAGE } from 'client/constants'
import { isBackend } from 'client/utils'

const initial = () => ({
  jwt: !isBackend()
    ? window.localStorage.getItem(JWT_NAME) ??
      window.sessionStorage.getItem(JWT_NAME) ??
      null
    : null,
  user: null,
  error: null,
  filterPool: FILTER_POOL.ALL_RESOURCES,
  settings: {
    scheme: DEFAULT_SCHEME,
    lang: DEFAULT_LANGUAGE,
    disableAnimations: 'NO'
  },
  isLoginInProgress: false,
  isLoading: false
})

const { actions, reducer } = createSlice({
  name: 'auth',
  initialState: initial(),
  extraReducers: builder => {
    builder
      .addCase(
        logout,
        (_, { error }) => ({ ...initial(), error })
      )
      .addMatcher(
        ({ type }) => {
          return [
            changeFilter.type,
            login.fulfilled.type,
            getUser.fulfilled.type,
            changeGroup.fulfilled.type
          ].includes(type)
        },
        (state, { payload }) => ({ ...state, ...payload })
      )
      .addMatcher(
        ({ type }) => type.startsWith('auth/') && type.endsWith('/pending'),
        state => ({ ...state, isLoading: true, error: null })
      )
      .addMatcher(
        ({ type }) => type.startsWith('auth/') && type.endsWith('/fulfilled'),
        state => ({ ...state, isLoading: false })
      )
      .addMatcher(
        ({ type }) => type.startsWith('auth/') && type.endsWith('/rejected'),
        (state, { payload }) => ({
          ...state,
          ...payload,
          isLoginInProgress: false,
          isLoading: false,
          jwt: null
        })
      )
  }
})

export { actions, reducer }
