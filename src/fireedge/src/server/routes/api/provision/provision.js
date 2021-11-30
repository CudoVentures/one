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
  getListResourceProvision,
  getListProvisions,
  getLogProvisions,
  deleteResource,
  deleteProvision,
  hostCommand,
  hostCommandSSH,
  createProvision,
  configureProvision,
  configureHost,
  validate,
  getProvisionDefaults,
} = require('./provision-functions')
const { GET, POST, DELETE, PUT } = httpMethod

const routes = {
  [GET]: {
    list: {
      action: getListProvisions,
      params: {
        id: { from: fromData.resource, name: 'id', front: true },
      },
    },
    cluster: {
      action: getListResourceProvision,
      params: {
        resource: { from: fromData.resource, name: 'method' },
      },
    },
    datastore: {
      action: getListResourceProvision,
      params: {
        resource: { from: fromData.resource, name: 'method' },
      },
    },
    host: {
      action: getListResourceProvision,
      params: {
        resource: { from: fromData.resource, name: 'method' },
      },
    },
    image: {
      action: getListResourceProvision,
      params: {
        resource: { from: fromData.resource, name: 'method' },
      },
    },
    network: {
      action: getListResourceProvision,
      params: {
        resource: { from: fromData.resource, name: 'method' },
      },
    },
    template: {
      action: getListResourceProvision,
      params: {
        resource: { from: fromData.resource, name: 'method' },
      },
    },
    vntemplate: {
      action: getListResourceProvision,
      params: {
        resource: { from: fromData.resource, name: 'method' },
      },
    },
    log: {
      action: getLogProvisions,
      params: {
        id: { from: fromData.resource, name: 'id', front: true },
      },
    },
    defaults: {
      action: getProvisionDefaults,
      params: {},
    },
  },
  [POST]: {
    create: {
      action: createProvision,
      params: {
        resource: { from: fromData.postBody, front: true },
      },
      websocket: true,
    },
    validate: {
      action: validate,
      params: {
        resource: { from: fromData.postBody, front: true },
      },
    },
    host: {
      poweroff: {
        action: hostCommand,
        params: {
          action: { from: fromData.resource, name: 'id' },
          id: { from: fromData.resource, name: 'id2', front: true },
        },
      },
      reboot: {
        action: hostCommand,
        params: {
          action: { from: fromData.resource, name: 'id' },
          id: { from: fromData.resource, name: 'id2', front: true },
        },
      },
      resume: {
        action: hostCommand,
        params: {
          action: { from: fromData.resource, name: 'id' },
          id: { from: fromData.resource, name: 'id2', front: true },
        },
      },
      ssh: {
        action: hostCommandSSH,
        params: {
          action: { from: fromData.resource, name: 'id' },
          id: { from: fromData.resource, name: 'id2', front: true },
          command: { from: fromData.postBody, name: 'command', front: true },
        },
      },
    },
  },
  [DELETE]: {
    delete: {
      action: deleteProvision,
      params: {
        id: { from: fromData.resource, name: 'id', front: true },
        cleanup: { from: fromData.postBody, name: 'cleanup', front: true },
      },
      websocket: true,
    },
    datastore: {
      action: deleteResource,
      params: {
        resource: { from: fromData.resource, name: 'method' },
        id: { from: fromData.resource, name: 'id', front: true },
      },
    },
    flowtemplate: {
      action: deleteResource,
      params: {
        resource: { from: fromData.resource, name: 'method' },
        id: { from: fromData.resource, name: 'id', front: true },
      },
    },
    host: {
      action: deleteResource,
      params: {
        resource: { from: fromData.resource, name: 'method' },
        id: { from: fromData.resource, name: 'id', front: true },
      },
    },
    image: {
      action: deleteResource,
      params: {
        resource: { from: fromData.resource, name: 'method' },
        id: { from: fromData.resource, name: 'id', front: true },
      },
    },
    network: {
      action: deleteResource,
      params: {
        resource: { from: fromData.resource, name: 'method' },
        id: { from: fromData.resource, name: 'id', front: true },
      },
    },
    vntemplate: {
      action: deleteResource,
      params: {
        resource: { from: fromData.resource, name: 'method' },
        id: { from: fromData.resource, name: 'id', front: true },
      },
    },
    template: {
      action: deleteResource,
      params: {
        resource: { from: fromData.resource, name: 'method' },
        id: { from: fromData.resource, name: 'id', front: true },
      },
    },
    cluster: {
      action: deleteResource,
      params: {
        resource: { from: fromData.resource, name: 'method' },
        id: { from: fromData.resource, name: 'id', front: true },
      },
    },
  },
  [PUT]: {
    configure: {
      action: configureProvision,
      params: {
        id: { from: fromData.resource, name: 'id' },
      },
      websocket: true,
    },
    host: {
      action: configureHost,
      params: {
        id: { from: fromData.resource, name: 'id' },
      },
    },
  },
}

const provisionApi = {
  routes,
}
module.exports = provisionApi
