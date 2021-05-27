import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'

import * as actions from 'client/features/One/applicationTemplate/actions'

export const useApplicationTemplate = () => (
  useSelector(state => state.one.applicationsTemplates)
)

export const useApplicationTemplateApi = () => {
  const dispatch = useDispatch()

  const unwrapDispatch = useCallback(
    action => dispatch(action).then(unwrapResult)
    , [dispatch]
  )

  return {
    getApplicationTemplate: id => unwrapDispatch(actions.getApplicationTemplate({ id })),
    getApplicationsTemplates: () => unwrapDispatch(actions.getApplicationsTemplates()),
    createApplicationTemplate: data => unwrapDispatch(actions.createApplicationTemplate({ data })),

    updateApplicationTemplate: (id, data) =>
      unwrapDispatch(actions.updateApplicationTemplate({ id, data })),

    instantiateApplicationTemplate: (id, data) =>
      unwrapDispatch(actions.instantiateApplicationTemplate({ id, data }))
  }
}
