import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'

import * as actions from 'client/features/One/application/actions'

export const useApplication = () => (
  useSelector(state => state.one.applications)
)

export const useApplicationApi = () => {
  const dispatch = useDispatch()

  const unwrapDispatch = useCallback(
    action => dispatch(action).then(unwrapResult)
    , [dispatch]
  )

  return {
    getApplication: id => unwrapDispatch(actions.getApplication({ id })),
    getApplications: () => unwrapDispatch(actions.getApplications())
  }
}
