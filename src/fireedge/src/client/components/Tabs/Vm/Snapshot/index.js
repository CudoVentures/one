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
import { useContext, useMemo } from 'react'
import PropTypes from 'prop-types'

import { useVmApi } from 'client/features/One'
import { TabContext } from 'client/components/Tabs/TabProvider'

import SnapshotList from 'client/components/Tabs/Vm/Snapshot/List'
import ButtonToTriggerForm from 'client/components/Forms/ButtonToTriggerForm'
import { CreateSnapshotForm } from 'client/components/Forms/Vm'

import {
  getSnapshotList,
  getHypervisor,
  isAvailableAction,
} from 'client/models/VirtualMachine'
import { getActionsAvailable } from 'client/models/Helper'
import { T, VM_ACTIONS } from 'client/constants'

const VmSnapshotTab = ({ tabProps: { actions } = {} }) => {
  const { createSnapshot } = useVmApi()

  const { data: vm = {} } = useContext(TabContext)

  const [snapshots, actionsAvailable] = useMemo(() => {
    const hypervisor = getHypervisor(vm)
    const actionsByHypervisor = getActionsAvailable(actions, hypervisor)
    const actionsByState = actionsByHypervisor.filter(
      (action) => !isAvailableAction(action)(vm)
    )

    return [getSnapshotList(vm), actionsByState]
  }, [vm])

  const handleSnapshotCreate = async (formData = {}) => {
    await createSnapshot(vm.ID, formData)
  }

  return (
    <>
      {actionsAvailable?.includes?.(VM_ACTIONS.SNAPSHOT_CREATE) && (
        <ButtonToTriggerForm
          buttonProps={{
            color: 'secondary',
            'data-cy': 'snapshot-create',
            label: T.TakeSnapshot,
            variant: 'outlined',
          }}
          options={[
            {
              dialogProps: { title: T.TakeSnapshot },
              form: () => CreateSnapshotForm(),
              onSubmit: handleSnapshotCreate,
            },
          ]}
        />
      )}

      <SnapshotList actions={actionsAvailable} snapshots={snapshots} />
    </>
  )
}

VmSnapshotTab.propTypes = {
  tabProps: PropTypes.object,
}

VmSnapshotTab.displayName = 'VmSnapshotTab'

export default VmSnapshotTab
