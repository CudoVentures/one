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

const atob = require('atob')
const { socket: socketZeroMQ } = require('zeromq')
const { messageTerminal } = require('server/utils/general')
const { xml2json } = require('server/utils/opennebula')
const {
  middlewareValidateAuthWebsocket,
  middlewareValidateResourceForHookConnection,
  getResourceDataForRequest,
  getDataZone,
  getQueryData,
} = require('server/utils/server')

/**
 * Route of websocket HOOKS.
 *
 * @param {object} app - express app
 * @param {string} type - type WS
 */
const main = (app = {}, type = '') => {
  try {
    app
      .use(middlewareValidateAuthWebsocket)
      .use(middlewareValidateResourceForHookConnection)
      .on('connection', (server = {}) => {
        const { id, resource } = getResourceDataForRequest(server)
        const { zone: queryZone } = getQueryData(server)
        const zone = queryZone && queryZone !== 'undefined' ? queryZone : '0'
        const dataZone = getDataZone(zone)
        if (dataZone && dataZone.zeromq) {
          const zeromqSock = socketZeroMQ('sub')
          zeromqSock.connect(dataZone.zeromq)
          zeromqSock.subscribe(`EVENT ${resource.toUpperCase()} ${id}/`) // state
          server.on('disconnect', function () {
            zeromqSock.close()
          })
          zeromqSock.on('message', (...args) => {
            const mssgs = []
            Array.prototype.slice.call(args).forEach((arg) => {
              mssgs.push(arg.toString())
            })
            if (mssgs[0] && mssgs[1]) {
              xml2json(atob(mssgs[1]), (error, result) => {
                if (error) {
                  const configErrorParser = {
                    color: 'red',
                    error,
                    message: 'Error parser: %s',
                  }
                  messageTerminal(configErrorParser)
                } else {
                  server.emit(type, {
                    command: mssgs[0],
                    data: result,
                  })
                }
              })
            }
          })
        }
      })
  } catch (error) {
    const configErrorHooks = {
      color: 'red',
      error,
      message: '%s',
    }
    messageTerminal(configErrorHooks)
  }
}

module.exports = {
  main,
}
