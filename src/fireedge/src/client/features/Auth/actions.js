/* ------------------------------------------------------------------------- *
 * Copyright 2002-2021, OpenNebula Project, OpenNebula Systems               *
 *                                                                           *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may   *
 * not use this file except in compliance with the License. You may obtain   *
 * a copy of the License at                                                  *
 *                                                                           *
 * http://www.apache.org/licenses/LICENSE-2.0                                *
 *                                                                           *
 * Unless required by applicable law or agreed to in writing, software       *
 * distributed under the License is distributed on an "AS IS" BASIS,         *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 * See the License for the specific language governing permissions and       *
 * limitations under the License.                                            *
 * ------------------------------------------------------------------------- */
/* eslint-disable jsdoc/require-jsdoc */
import { createAction, createAsyncThunk } from '@reduxjs/toolkit'

import { authService } from 'client/features/Auth/services'
import { dismissSnackbar } from 'client/features/General/actions'
import apiUser from 'client/features/OneApi/user'

import { httpCodes } from 'server/utils/constants'
import { removeStoreData, storage } from 'client/utils'
import { FILTER_POOL, JWT_NAME, ONEADMIN_ID, T } from 'client/constants'

export const login = createAsyncThunk(
  'auth/login',
  async ({ remember, ...user }, { rejectWithValue, dispatch }) => {
    try {
      const response = await authService.login({ ...user, remember })
      const { id, token } = response
      const isOneAdmin = id === ONEADMIN_ID

      if (token) {
        storage(JWT_NAME, token, remember)
        dispatch(dismissSnackbar({ dismissAll: true }))
      }

      return {
        jwt: token,
        user: { ID: id },
        isOneAdmin,
        isLoginInProgress: !!token && !isOneAdmin,
      }
    } catch (error) {
      const { message, data, statusText } = error

      return rejectWithValue({ error: message ?? data?.message ?? statusText })
    }
  }
)

export const getUser = createAsyncThunk(
  'auth/user',
  async (_, { dispatch, getState }) => {
    try {
      const { auth = {} } = getState()

      const user = await authService.getUser()
      const isOneAdmin = user?.ID === ONEADMIN_ID
      const userSettings = user?.TEMPLATE?.FIREEDGE ?? {}

      // Merge user settings with the existing one
      const settings = {
        ...auth?.settings,
        ...Object.entries(userSettings).reduce(
          (res, [key, value]) => ({
            ...res,
            [String(key).toLowerCase()]: value,
          }),
          {}
        ),
      }

      return { user, settings, isOneAdmin }
    } catch (error) {
      console.log({ error })
      dispatch(logout(T.SessionExpired))
    }
  },
  {
    condition: (_, { getState }) => {
      const { isLoading } = getState().auth

      return !isLoading
    },
  }
)

export const logout = createAction('logout', (errorMessage) => {
  removeStoreData([JWT_NAME])

  return { error: errorMessage }
})

export const changeFilter = createAction(
  'auth/change-filter',
  (filterPool) => ({ payload: { filterPool, isLoginInProgress: false } })
)

export const changeGroup = createAsyncThunk(
  'auth/change-group',
  async ({ group }, { getState, dispatch, rejectWithValue }) => {
    try {
      if (group === FILTER_POOL.ALL_RESOURCES) {
        dispatch(changeFilter(FILTER_POOL.ALL_RESOURCES))
      } else {
        const { user } = getState().auth

        const data = { id: user?.ID, group }
        dispatch(apiUser.endpoints.changeGroup.initiate(data)).reset()

        dispatch(changeFilter(FILTER_POOL.PRIMARY_GROUP_RESOURCES))

        return {
          user: {
            ...user,
            GID: group,
          },
        }
      }
    } catch (error) {
      const { message, data, status, statusText } = error

      status === httpCodes.unauthorized.id && dispatch(logout(T.SessionExpired))

      return rejectWithValue({ error: message ?? data?.message ?? statusText })
    }
  }
)

export const changeView = createAction('auth/change-view', (view) => ({
  payload: { view },
}))
