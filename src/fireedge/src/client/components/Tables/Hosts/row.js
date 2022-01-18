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
import PropTypes from 'prop-types'

import { Server, ModernTv } from 'iconoir-react'
import { Typography } from '@mui/material'

import {
  StatusCircle,
  LinearProgressWithLabel,
  StatusChip,
} from 'client/components/Status'
import { rowStyles } from 'client/components/Tables/styles'
import { Tr } from 'client/components/HOC'

import * as HostModel from 'client/models/Host'
import { T } from 'client/constants'

const Row = ({ original, value, ...props }) => {
  const classes = rowStyles()
  const {
    ID,
    NAME,
    IM_MAD,
    VM_MAD,
    RUNNING_VMS,
    TOTAL_VMS,
    CLUSTER,
    TEMPLATE,
  } = value

  const { percentCpuUsed, percentCpuLabel, percentMemUsed, percentMemLabel } =
    HostModel.getAllocatedInfo(value)

  const { color: stateColor, name: stateName } = HostModel.getState(original)

  const labels = [...new Set([IM_MAD, VM_MAD])]

  return (
    <div {...props} data-cy={`host-${ID}`}>
      <div>
        <StatusCircle color={stateColor} tooltip={stateName} />
      </div>
      <div className={classes.main}>
        <div className={classes.title}>
          <Typography noWrap component="span">
            {TEMPLATE?.NAME ?? NAME}
          </Typography>
          <span className={classes.labels}>
            {labels.map((label) => (
              <StatusChip key={label} text={label} />
            ))}
          </span>
        </div>
        <div className={classes.caption}>
          <span>{`#${ID}`}</span>
          <span title={`Cluster: ${CLUSTER}`}>
            <Server />
            <span>{` ${CLUSTER}`}</span>
          </span>
          <span title={`Running VMs: ${RUNNING_VMS} / ${TOTAL_VMS}`}>
            <ModernTv />
            <span>{` ${RUNNING_VMS} / ${TOTAL_VMS}`}</span>
          </span>
        </div>
      </div>
      <div className={classes.secondary}>
        <LinearProgressWithLabel
          value={percentCpuUsed}
          label={percentCpuLabel}
          title={`${Tr(T.AllocatedCpu)}`}
        />
        <LinearProgressWithLabel
          value={percentMemUsed}
          label={percentMemLabel}
          title={`${Tr(T.AllocatedMemory)}`}
        />
      </div>
    </div>
  )
}

Row.propTypes = {
  original: PropTypes.object,
  value: PropTypes.object,
  isSelected: PropTypes.bool,
  handleClick: PropTypes.func,
}

export default Row
