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

const {
  httpMethod,
  from: fromData,
} = require('server/utils/constants/defaults')
const {
  service,
  serviceDelete,
  serviceAddAction,
  serviceAddScale,
  serviceAddRoleAction,
  serviceAddSchedAction,
  serviceUpdateSchedAction,
  serviceDeleteSchedAction,
} = require('server/routes/api/oneflow/service/functions')
const { GET, POST, DELETE, PUT } = httpMethod

const routes = {
  [GET]: {
    null: {
      action: service,
      params: {
        id: { from: fromData.resource, name: 'method' },
      },
    },
  },
  [POST]: {
    action: {
      action: serviceAddAction,
      params: {
        id: { from: fromData.resource, name: 'id' },
        action: { from: fromData.postBody },
      },
    },
    scale: {
      action: serviceAddScale,
      params: {
        id: { from: fromData.resource, name: 'id' },
        action: { from: fromData.postBody },
      },
    },
    role_action: {
      action: serviceAddRoleAction,
      params: {
        id: { from: fromData.resource, name: 'id' },
        role: { from: fromData.resource, name: 'id2' },
        action: { from: fromData.postBody },
      },
    },
    sched_action: {
      action: serviceAddSchedAction,
      params: {
        id: { from: fromData.resource, name: 'id' },
        sched_action: { from: fromData.postBody, name: 'sched_action' },
      },
    },
  },
  [PUT]: {
    sched_action: {
      action: serviceUpdateSchedAction,
      params: {
        id: { from: fromData.resource, name: 'id' },
        id_sched: { from: fromData.resource, name: 'id2' },
        sched_action: { from: fromData.postBody, name: 'sched_action' },
      },
    },
  },
  [DELETE]: {
    null: {
      action: serviceDelete,
      params: { id: { from: fromData.resource, name: 'method' } },
    },
    sched_action: {
      action: serviceDeleteSchedAction,
      params: {
        id: { from: fromData.resource, name: 'method' },
        id_sched: { from: fromData.resource, name: 'id' },
      },
    },
  },
}

const serviceApi = {
  routes,
}

module.exports = serviceApi
