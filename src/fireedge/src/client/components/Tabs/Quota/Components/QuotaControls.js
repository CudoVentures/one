/* ------------------------------------------------------------------------- *
 * Copyright 2002-2023, OpenNebula Project, OpenNebula Systems               *
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
import { memo, useMemo, useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  useTheme,
} from '@mui/material'

import {
  useGetUserQuery,
  useUpdateUserQuotaMutation,
} from 'client/features/OneApi/user'

import {
  useGetGroupQuery,
  useUpdateGroupQuotaMutation,
} from 'client/features/OneApi/group'

import { useGeneralApi } from 'client/features/General'
import { T } from 'client/constants'
import {
  validateResourceId,
  validateValue,
  useQuotaControlReducer,
  getConcatenatedValues,
  getExistingValue,
  quotaIdentifiers,
  handleApplyGlobalQuotas,
} from 'client/components/Tabs/Quota/Components/helpers/scripts'

import {
  HybridInputField,
  ResourceIDAutocomplete,
} from 'client/components/Tabs/Quota/Components/helpers/subcomponents'

/**
 * QuotaControls Component
 *
 * @param {object} props - Props for the component
 * @param {Array} props.quotaTypes - Available quota types
 * @param {string} props.userId - User ID
 * @param {string} props.selectedType - Selected quota type
 * @param {Function} props.setSelectedType - Function to set selected quota type
 * @param {Array} props.existingResourceIDs - Existing resource IDs
 * @param {object} props.clickedElement - Clicked element data.
 * @param {object} props.nameMaps - Resource name mappings.
 */
export const QuotaControls = memo(
  ({
    quotaTypes,
    userId,
    selectedType,
    setSelectedType,
    existingData,
    clickedElement,
    nameMaps,
    groups,
  }) => {
    const [state, actions] = useQuotaControlReducer()

    const [popoverAnchorEl, setPopoverAnchorEl] = useState(null)
    const [touchedFields, setTouchedFields] = useState({})
    const { enqueueError, enqueueSuccess } = useGeneralApi()

    const [updateQuota] = groups
      ? useUpdateGroupQuotaMutation()
      : useUpdateUserQuotaMutation()

    const { palette } = useTheme()

    useEffect(() => {
      if (!clickedElement) return

      if (selectedType === 'VM' && actions.setSelectedIdentifier) {
        if (clickedElement.name && state.selectedIdentifier !== undefined) {
          actions.setSelectedIdentifier(clickedElement.name)
        }

        return
      }

      if (actions.setGlobalIds && Array.isArray(state.globalIds)) {
        const { ID } = clickedElement
        const isElementSelected = state.globalIds.includes(ID)
        actions.setGlobalIds(
          isElementSelected
            ? state.globalIds.filter((id) => id !== ID)
            : [...state.globalIds, ID]
        )
      }
    }, [clickedElement])

    useMemo(() => {
      actions.setSelectedIdentifier('')
    }, [selectedType])

    useEffect(() => {
      actions.setGlobalIds([])
      actions.setGlobalValue('')
      actions.setMarkForDeletion([])
    }, [selectedType])

    const getNewValues = useCallback(() => {
      let newValues
      if (selectedType === 'VM') {
        const identifier = state.selectedIdentifier
        newValues = {
          [identifier]: getExistingValue(
            null,
            identifier,
            selectedType,
            existingData
          ),
        }
      } else {
        newValues = existingData.reduce((acc, item) => {
          const identifier = state.selectedIdentifier
          acc[item.ID] = item[identifier] || ''

          return acc
        }, {})
      }

      return newValues
    }, [existingData, selectedType, state.selectedIdentifier])

    useEffect(() => {
      const newValues = getNewValues()
      actions.setValues(newValues)
      if (state.globalIds.length === 1 || selectedType === 'VM') {
        // const existingValue = getExistingValue(
        //   selectedType === 'VM' ? null : state.globalIds[0],
        //   state.selectedIdentifier
        // )
        actions.setGlobalValue(newValues?.[state?.selectedIdentifier])
      }
    }, [getNewValues, state.globalIds, selectedType, state.selectedIdentifier])

    useEffect(() => {
      const isApplyEnabledForVM =
        selectedType === 'VM' && validateValue(state.globalValue)
      const isApplyEnabledForOthers =
        state.isValid &&
        selectedType &&
        state.selectedIdentifier.length > 0 &&
        (state.globalIds.length > 0 || selectedType === 'VM') &&
        validateValue(state.globalValue)
      const isApplyValid =
        selectedType === 'VM' ? isApplyEnabledForVM : isApplyEnabledForOthers
      actions.setIsApplyDisabled(!isApplyValid)
    }, [
      state.isValid,
      selectedType,
      state.selectedIdentifier,
      state.globalValue,
      state.globalIds.length,
    ])

    useEffect(() => {
      const allValuesAreValid = state.globalIds.every((id) =>
        validateValue(state.values[id] || '')
      )

      actions.setIsValid(allValuesAreValid)
    }, [state.globalIds, state.values])

    useEffect(() => {
      if (state.globalIds.length === 1) {
        const singleGlobalId = state.globalIds[0]
        const singleGlobalValue = state.values[singleGlobalId] || ''
        actions.setGlobalValue(singleGlobalValue)
      }
    }, [state.globalIds, state.values])

    const existingTemplate = groups
      ? useGetGroupQuery({ id: userId })
      : useGetUserQuery({ id: userId })

    const filteredResourceIDs = useMemo(
      () =>
        existingData
          ?.map(({ ID }) => ID)
          ?.filter((id) => !state.globalIds.includes(id)),
      [existingData, state.globalIds]
    )

    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          overflow: 'auto',
        }}
      >
        <Grid
          container
          spacing={2}
          direction="column"
          sx={{ flex: 1, overflow: 'auto' }}
        >
          <Grid item>
            <FormControl
              fullWidth
              variant="outlined"
              data-cy="qc-type-selector"
            >
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedType || ''}
                onChange={(e) => setSelectedType(e.target.value)}
                label="Type"
                inputProps={{ 'data-cy': 'qc-type-selector-input' }}
              >
                {quotaTypes.map((type) => (
                  <MenuItem
                    key={type.type}
                    value={type.type}
                    data-cy={`qc-type-selector-${type.type.toLowerCase()}`}
                  >
                    {type.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <ResourceIDAutocomplete
              selectedType={selectedType}
              state={state}
              actions={actions}
              validateResourceId={validateResourceId}
              filteredResourceIDs={filteredResourceIDs}
              palette={palette}
              nameMaps={nameMaps}
            />
          </Grid>

          <Grid item>
            <FormControl
              fullWidth
              variant="outlined"
              style={{ height: 'auto', maxHeight: '100px', overflow: 'auto' }}
              data-cy="qc-identifier-selector"
            >
              <InputLabel>Identifier</InputLabel>
              <Select
                value={state.selectedIdentifier || ''}
                inputProps={{ 'data-cy': 'qc-identifier-selector-input' }}
                onChange={(e) => actions.setSelectedIdentifier(e.target.value)}
                label="Identifiers"
              >
                {quotaIdentifiers[selectedType]?.map(({ id, displayName }) => (
                  <MenuItem
                    key={id}
                    value={id}
                    data-cy={`qc-identifier-selector-${displayName
                      .toLowerCase()
                      .split(' ')
                      .join('')}`}
                    style={{
                      opacity: state.selectedIdentifier === id ? 1 : 0.5,
                    }}
                  >
                    {displayName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <HybridInputField
              selectedType={selectedType}
              state={state}
              actions={actions}
              validateValue={validateValue}
              getConcatenatedValues={getConcatenatedValues}
              setPopoverAnchorEl={setPopoverAnchorEl}
              popoverAnchorEl={popoverAnchorEl}
              palette={palette}
              touchedFields={touchedFields}
              setTouchedFields={setTouchedFields}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() =>
                handleApplyGlobalQuotas(
                  state,
                  existingTemplate,
                  selectedType,
                  actions,
                  userId,
                  updateQuota,
                  enqueueError,
                  enqueueSuccess,
                  nameMaps
                )
              }
              disabled={state.isApplyDisabled}
              size={'large'}
              data-cy={'qc-apply-button'}
            >
              {T.Apply}
            </Button>
          </Grid>
          <Grid item sx={{ mt: 2 }}>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              sx={{ opacity: 0.7 }}
            >
              <strong>How to use Quota Controls:</strong>
              <ul>
                <li>Select the quota type from the dropdown.</li>
                <Box
                  component="li"
                  sx={{
                    textDecoration: 'underline',
                    fontWeight: 'bold',
                  }}
                  title="enter Resource IDs over which this quota will apply"
                >
                  (Optional) Individual Resource Quotas .
                </Box>

                <Box
                  component="li"
                  sx={{
                    textDecoration: 'underline',
                    fontWeight: 'bold',
                  }}
                  title="this further qualifies the quota type to a more specific attribute"
                >
                  Select identifiers for the quota.
                </Box>

                <li>Enter the value for the selected quota.</li>
                <li>Click Apply to set the quotas.</li>
              </ul>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    )
  }
)

QuotaControls.displayName = 'QuotaControls'

QuotaControls.propTypes = {
  quotaTypes: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  userId: PropTypes.string.isRequired,
  selectedType: PropTypes.string,
  setSelectedType: PropTypes.func,
  existingData: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  clickedElement: PropTypes.object,
  nameMaps: PropTypes.object,
  groups: PropTypes.bool,
}

QuotaControls.defaultProps = {
  existingData: [],
}
