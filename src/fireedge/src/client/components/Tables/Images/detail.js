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
import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { LinearProgress } from '@mui/material'

import Tabs from 'client/components/Tabs'
import { StatusBadge } from 'client/components/Status'

import { useFetch, useSocket } from 'client/hooks'
import { useImageApi } from 'client/features/One'

import { prettyBytes } from 'client/utils'
import * as ImageModel from 'client/models/Image'
import * as Helper from 'client/models/Helper'

const ImageDetail = ({ id }) => {
  const { getImage } = useImageApi()

  const { getHooksSocket } = useSocket()
  const socket = getHooksSocket({ resource: 'image', id })

  const { data, fetchRequest, loading, error } = useFetch(getImage, socket)
  const isLoading = (!data && !error) || loading

  useEffect(() => {
    fetchRequest(id)
  }, [id])

  if (isLoading) {
    return <LinearProgress color="secondary" style={{ width: '100%' }} />
  }

  if (error) {
    return <div>{error}</div>
  }

  const {
    ID,
    NAME,
    UNAME,
    GNAME,
    REGTIME,
    SIZE,
    PERSISTENT,
    LOCK,
    DATASTORE,
    VMS,
    RUNNING_VMS,
  } = data

  const { name: stateName, color: stateColor } = ImageModel.getState(data)
  const type = ImageModel.getType(data)
  const size = +SIZE ? prettyBytes(+SIZE, 'MB') : '-'

  const usedByVms = [VMS?.ID ?? []].flat().length || 0

  const tabs = [
    {
      name: 'info',
      renderContent: (
        <div>
          <div>
            <StatusBadge
              title={stateName}
              stateColor={stateColor}
              customTransform="translate(150%, 50%)"
            />
            <span style={{ marginLeft: 20 }}>{`#${ID} - ${NAME}`}</span>
          </div>
          <div>
            <p>Owner: {UNAME}</p>
            <p>Group: {GNAME}</p>
            <p>Datastore: {DATASTORE}</p>
            <p>Persistent: {type}</p>
            <p>Size: {size}</p>
            <p>Register time: {Helper.timeToString(REGTIME)}</p>
            <p>Locked: {Helper.levelLockToString(LOCK?.LOCKED)}</p>
            <p>Persistent: {Helper.booleanToString(PERSISTENT)}</p>
            <p>Running VMS: {` ${RUNNING_VMS} / ${usedByVms}`}</p>
          </div>
        </div>
      ),
    },
  ]

  return <Tabs tabs={tabs} />
}

ImageDetail.propTypes = {
  id: PropTypes.string.isRequired,
}

export default ImageDetail
