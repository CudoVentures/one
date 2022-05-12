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
/* eslint-disable jsdoc/require-jsdoc */
import { useState } from 'react'
import { Stack, Chip } from '@mui/material'

import { ClustersTable } from 'client/components/Tables'
import ClusterTabs from 'client/components/Tabs/Cluster'
import SplitPane from 'client/components/SplitPane'
import MultipleTags from 'client/components/MultipleTags'

function Clusters() {
  const [selectedRows, onSelectedRowsChange] = useState(() => [])

  return (
    <SplitPane>
      <ClustersTable onSelectedRowsChange={onSelectedRowsChange} />

      {selectedRows?.length > 0 && (
        <Stack overflow="auto">
          {selectedRows?.length === 1 ? (
            <ClusterTabs id={selectedRows[0]?.original.ID} />
          ) : (
            <Stack direction="row" flexWrap="wrap" gap={1} alignItems="center">
              <MultipleTags
                limitTags={10}
                tags={selectedRows?.map(
                  ({ original, id, toggleRowSelected }) => (
                    <Chip
                      key={id}
                      variant="text"
                      label={original?.NAME ?? id}
                      onDelete={() => toggleRowSelected(false)}
                    />
                  )
                )}
              />
            </Stack>
          )}
        </Stack>
      )}
    </SplitPane>
  )
}

export default Clusters
