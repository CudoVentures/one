/* ------------------------------------------------------------------------- *
 * Copyright 2002-2022, OpenNebula Project, OpenNebula Systems               *
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
import makeStyles from '@mui/styles/makeStyles'

export default makeStyles(({ palette, typography, breakpoints }) => ({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
  },
  toolbar: {
    ...typography.body1,
    marginBottom: 16,
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    alignItems: 'start',
    gap: '1em',
    '& > .summary': {
      // global sort and selected rows
      gridRow: '2',
      gridColumn: '1 / -1',
      display: 'grid',
      gridTemplateColumns: 'minmax(auto, 300px) 1fr',
      gap: '0.8em',
      [breakpoints.down('md')]: {
        gridTemplateColumns: '1fr',
      },
    },
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'end',
    gap: '1em',
  },
  loading: {
    transition: '200ms',
  },
  table: {
    display: 'grid',
    gridTemplateColumns: 'minmax(auto, 300px) 1fr',
    gap: '0.8em',
    overflow: 'auto',
    [breakpoints.down('md')]: {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
  body: {
    overflow: 'auto',
    display: 'grid',
    gap: '1em',
    gridTemplateColumns: 'minmax(0, 1fr)',
    gridAutoRows: 'max-content',
    '& > [role=row]': {
      padding: '0.8em',
      cursor: 'pointer',
      color: palette.text.primary,
      backgroundColor: palette.background.paper,
      fontWeight: typography.fontWeightRegular,
      fontSize: '1em',
      border: `1px solid ${palette.divider}`,
      borderRadius: '0.5em',
      display: 'flex',
      gap: '1em',
      '&:hover': {
        backgroundColor: palette.action.hover,
      },
      '&.selected': {
        border: `2px solid ${palette.secondary.main}`,
      },
    },
  },
  noDataMessage: {
    ...typography.h6,
    color: palette.text.hint,
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.8em',
    padding: '1em',
  },
}))
