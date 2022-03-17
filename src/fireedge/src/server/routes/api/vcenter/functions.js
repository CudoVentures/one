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
const btoa = require('btoa')
const https = require('https')
// eslint-disable-next-line node/no-deprecated-api
const { parse } = require('url')

const { request: axios } = require('axios')

const { defaults, httpCodes } = require('server/utils/constants')
const {
  httpResponse,
  executeCommand,
  executeCommandAsync,
  publish,
  getSunstoneAuth,
} = require('server/utils/server')
const {
  consoleParseToString,
  consoleParseToJSON,
} = require('server/utils/opennebula')
const { createTokenServerAdmin } = require('server/routes/api/auth/utils')
const { Actions: ActionHost } = require('server/utils/constants/commands/host')
const { Actions: ActionVM } = require('server/utils/constants/commands/vm')
const {
  resourceFromData,
  resources,
  params: commandParams,
} = require('server/routes/api/vcenter/command-flags')
const { getSunstoneConfig } = require('server/utils/yml')
const {
  httpMethod,
  defaultEmptyFunction,
  defaultCommandVcenter,
  defaultRegexpStartJSON,
  defaultRegexpEndJSON,
  defaultRegexpSplitLine,
} = defaults
const { POST } = httpMethod
const { ok, internalServerError, badRequest, accepted } = httpCodes
const { LIST, IMPORT } = resourceFromData
const appConfig = getSunstoneConfig()
const prependCommand = appConfig.vcenter_prepend_command || ''
const regexExclude = [
  /^Connecting to.*/i,
  /^Exploring vCenter.*/i,
  // eslint-disable-next-line no-control-regex
  /^\u001b\[.*?m\u001b\[.*?m# vCenter.*/i,
]
const regexHeader = /^IMID,.*/i
const regexGetVcenterId = /-(?<id>.*)_/s

const validObjects = Object.values(resources)

/**
 * Show a list with unimported vCenter objects excluding all filters.
 *
 * @param {object} res - http response
 * @param {Function} next - express stepper
 * @param {object} params - params of http request
 */
const list = (res = {}, next = defaultEmptyFunction, params = {}) => {
  const { vobject, host, datastore } = params

  const vobjectLowercase = vobject && `${vobject}`.toLowerCase()
  if (!(vobjectLowercase && host && validObjects.includes(vobjectLowercase))) {
    res.locals.httpCode = badRequest
    next()

    return
  }

  let paramsCommand = [
    'list',
    '-o',
    `${vobjectLowercase}`,
    '-h',
    `${host}`,
    '--csv',
  ]

  if (vobjectLowercase === resources.IMAGES && datastore) {
    const newParameters = ['-d', datastore]
    paramsCommand = [...paramsCommand, ...newParameters]
  }

  const executedCommand = executeCommand(
    defaultCommandVcenter,
    paramsCommand,
    prependCommand
  )

  const response = executedCommand.success ? ok : internalServerError
  let message = ''
  if (executedCommand.data) {
    message = consoleParseToJSON(
      consoleParseToString(executedCommand.data, regexExclude),
      regexHeader
    )
  }

  res.locals.httpCode = httpResponse(response, message)
  next()
}

/**
 * Show a list with unimported vCenter objects excluding all filters.
 *
 * @param {object} res - http response
 * @param {Function} next - express stepper
 * @param {object} params - params of http request
 */
const listAll = (res = {}, next = defaultEmptyFunction, params = {}) => {
  const { vobject, host, datastore } = params

  const vobjectLowercase = vobject && `${vobject}`.toLowerCase()
  if (!(vobjectLowercase && host && validObjects.includes(vobjectLowercase))) {
    res.locals.httpCode = badRequest
    next()

    return
  }

  let paramsCommand = [
    'list_all',
    '-o',
    `${vobjectLowercase}`,
    '-h',
    `${host}`,
    '--csv',
  ]

  if (vobjectLowercase === resources.IMAGES && datastore) {
    const newParameters = ['-d', datastore]
    paramsCommand = [...paramsCommand, ...newParameters]
  }
  const executedCommand = executeCommand(
    defaultCommandVcenter,
    paramsCommand,
    prependCommand
  )

  const response = executedCommand.success ? ok : internalServerError
  let message = ''
  if (executedCommand.data) {
    message = consoleParseToJSON(
      consoleParseToString(executedCommand.data, regexExclude),
      regexHeader
    )
  }
  res.locals.httpCode = httpResponse(response, message)
  next()
}

/**
 * Clear extraconfig tags from a vCenter VM, useful when a VM has been launched by OpenNebula and needs to be reimported.
 *
 * @param {object} res - http response
 * @param {Function} next - express stepper
 * @param {object} params - params of http request
 */
const cleartags = (res = {}, next = defaultEmptyFunction, params = {}) => {
  const { id } = params
  if (!Number.isInteger(parseInt(id))) {
    res.locals.httpCode = badRequest
    next()

    return
  }

  const paramsCommand = ['cleartags', id]
  const executedCommand = executeCommand(
    defaultCommandVcenter,
    paramsCommand,
    prependCommand
  )
  const response = executedCommand.success ? ok : internalServerError
  let message = ''
  if (executedCommand.data) {
    message = consoleParseToString(executedCommand.data, regexExclude)
  }
  res.locals.httpCode = httpResponse(response, message)
  next()
}

/**
 * Import vCenter cluster as Opennebula host.
 *
 * @param {object} res - http response
 * @param {Function} next - express stepper
 * @param {object} params - params of http request
 */
const importHost = (res = {}, next = defaultEmptyFunction, params = {}) => {
  /**
   * PENDING IMPORT 1 HOST
   */
  const { vcenter, user, pass } = params

  if (!(vcenter && user && pass)) {
    res.locals.httpCode = badRequest
    next()

    return
  }

  const vcenterLowercase = vcenter && `${vcenter}`.toLowerCase()

  const paramsCommand = [
    'hosts',
    '--vcenter',
    vcenterLowercase,
    '--vuser',
    `${user}`,
    '--vpass',
    `${pass}`,
    '--use-defaults',
  ]

  const executedCommand = executeCommand(
    defaultCommandVcenter,
    paramsCommand,
    prependCommand
  )

  const response = executedCommand.success ? ok : internalServerError
  let message = ''
  if (executedCommand.data) {
    message = consoleParseToString(executedCommand.data, regexExclude)
  }
  res.locals.httpCode = httpResponse(response, message)
  next()
}

/**
 * Import the desired vCenter object.
 *
 * @param {object} res - http response
 * @param {Function} next - express stepper
 * @param {object} params - params of http request
 * @param {object} userData - user Data
 * @param {'template'|'images'|'datastores'|'networks'} type - type resource
 */
const importVobject = (
  res = {},
  next = defaultEmptyFunction,
  params = {},
  userData = {},
  type
) => {
  const httpReturn = (httpCode) => {
    res.locals.httpCode = httpCode
    next()
  }

  !(type && validObjects.includes(type)) && httpReturn(badRequest)

  const paramsForCommand = commandParams[type]

  let flagsImport = []
  paramsForCommand
    .filter((flag) => flag.for && flag.for.includes(IMPORT))
    .forEach(({ param, flag }) => {
      if (params[param]) {
        flagsImport = [...flagsImport, flag, params[param]]
      }
    })

  const publisher = (line = '') => {
    publish(defaultCommandVcenter, {
      resource: type,
      data: line,
    })
  }

  let pendingMessages = ''
  const emit = (message) => {
    if (message && typeof message.toString === 'function') {
      message
        .toString()
        .split(defaultRegexpSplitLine)
        .forEach((line) => {
          if (line) {
            if (
              (defaultRegexpStartJSON.test(line) &&
                defaultRegexpEndJSON.test(line)) ||
              (!defaultRegexpStartJSON.test(line) &&
                !defaultRegexpEndJSON.test(line) &&
                pendingMessages.length === 0)
            ) {
              publisher(line)
            } else if (
              (defaultRegexpStartJSON.test(line) &&
                !defaultRegexpEndJSON.test(line)) ||
              (!defaultRegexpStartJSON.test(line) &&
                !defaultRegexpEndJSON.test(line) &&
                pendingMessages.length > 0)
            ) {
              pendingMessages += line
            } else {
              publisher(pendingMessages + line)
              pendingMessages = ''
            }
          }
        })
    }
  }

  const executeImport = (ref) => {
    executeCommandAsync(
      defaultCommandVcenter,
      ['import_defaults', ref, '-o', type, ...flagsImport],
      prependCommand,
      {
        err: (message) => emit(message),
        out: (message) => emit(message),
        close: defaultEmptyFunction,
      }
    )
  }

  const { id } = params
  if (id) {
    id.split(',').forEach((ref) => {
      executeImport(ref)
    })
    httpReturn(accepted)

    return
  }

  let flagsList = []
  paramsForCommand
    .filter((flag) => flag.for && flag.for.includes(LIST))
    .forEach(({ param, flag }) => {
      if (params[param]) {
        flagsList = [...flagsList, flag, params[param]]
      }
    })

  const iterateListAll = (message) => {
    if (message && typeof message.toString === 'function') {
      const messageString = message.toString()
      const listData = consoleParseToJSON(
        consoleParseToString(messageString, regexExclude),
        regexHeader
      )

      if (listData.length) {
        listData.forEach(({ REF }) => {
          if (!REF) {
            return
          }
          executeImport(REF)
        })
      } else {
        publisher(messageString)
      }
    }
  }

  executeCommandAsync(
    defaultCommandVcenter,
    ['list_all', '-o', type, '--csv', ...flagsList],
    prependCommand,
    {
      err: iterateListAll,
      out: iterateListAll,
      close: defaultEmptyFunction,
    }
  )

  httpReturn(accepted)
}

/**
 * Axios request.
 *
 * @param {object} params - Axios params
 * @param {Function} callback - Success Axios callback
 * @param {Function} error - Error Axios callback
 */
const request = (
  params = {},
  callback = defaultEmptyFunction,
  error = defaultEmptyFunction
) => {
  const defaultsProperties = {
    method: POST,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
    validateStatus: (status) => status,
  }
  axios({
    ...defaultsProperties,
    ...params,
  })
    .then((response) => {
      if (response && response.statusText) {
        if (response.status >= 200 && response.status < 400) {
          if (response.data) {
            return response.data
          }
        }
        throw Error(response.data)
      } else if (response.data) {
        throw Error(response.data)
      }
    })
    .then((data) => {
      callback(data)
    })
    .catch((e) => {
      error(e)
    })
}

/**
 * Get system config.
 *
 * @param {object} res - http response
 * @param {Function} next - express stepper
 * @param {object} params - params of http request
 * @param {object} userData - user of http request
 * @param {function(string, string): Function} oneConnection - One Connection
 */
const getToken = (
  res = {},
  next = defaultEmptyFunction,
  params = {},
  userData = {},
  oneConnection = defaultEmptyFunction
) => {
  const { username, key, iv } = getSunstoneAuth()
  const { id } = params
  const responser = (code = badRequest, data = '') => {
    res.locals.httpCode = httpResponse(code, data, '')
    next()
  }

  if (!(username && key && iv) || !Number.isInteger(parseInt(id, 10))) {
    responser()

    return
  }

  const tokenWithServerAdmin = createTokenServerAdmin({
    serverAdmin: username,
    username,
    key,
    iv,
  })
  if (!tokenWithServerAdmin.token) {
    responser()

    return
  }

  const connect = oneConnection(
    `${username}:${username}`,
    tokenWithServerAdmin.token
  )

  connect(ActionVM.VM_INFO, [parseInt(id, 10), true], (err, vminfo) => {
    if (
      !(
        vminfo &&
        vminfo.VM &&
        vminfo.VM.DEPLOY_ID &&
        vminfo.VM.HISTORY_RECORDS &&
        vminfo.VM.HISTORY_RECORDS.HISTORY
      ) ||
      err
    ) {
      responser(internalServerError)
    }

    const history = vminfo.VM.HISTORY_RECORDS.HISTORY
    const arrayHistory = Array.isArray(history) ? history : [history]

    const hostID = parseInt(
      arrayHistory.reduce(
        (max, record) => (record.SEQ > max.SEQ ? record : max),
        arrayHistory[0]
      ).HID,
      10
    )

    const vmid = vminfo.VM.DEPLOY_ID.match(regexGetVcenterId).groups.id

    connect(ActionHost.HOST_INFO, [hostID, true], (err, hostinfo) => {
      if (
        !(
          hostinfo &&
          hostinfo.HOST &&
          hostinfo.HOST.TEMPLATE &&
          hostinfo.HOST.TEMPLATE.VCENTER_HOST &&
          hostinfo.HOST.TEMPLATE.VCENTER_USER &&
          hostinfo.HOST.TEMPLATE.VCENTER_PASSWORD
        ) ||
        err
      ) {
        responser(internalServerError)

        return
      }

      const { VCENTER_HOST, VCENTER_USER, VCENTER_PASSWORD } =
        hostinfo.HOST.TEMPLATE

      const responseInternalServer = () => {
        responser(internalServerError)
      }

      const genToken = (data) => {
        request(
          {
            url: `https://${VCENTER_HOST}/api/vcenter/vm/vm-${vmid}/console/tickets`,
            headers: {
              'Content-Type': 'application/json',
              'vmware-api-session-id': data,
            },
            data: JSON.stringify({ type: 'WEBMKS' }),
          },
          (success) => {
            const { ticket } = success
            const { protocol, hostname, port, path } = parse(ticket)

            const httpProtocol = protocol === 'wss:' ? 'https' : 'http'
            const esxUrl = `${httpProtocol}://${hostname}:${port}`
            const token = path.replace('/ticket/', '')
            global.vcenterToken = { [token]: esxUrl }
            responser(ok, {
              ticket: token,
            })
          },
          responseInternalServer
        )
      }

      request(
        {
          url: `https://${VCENTER_HOST}/api/session`,
          headers: {
            Authorization: `Basic ${btoa(
              `${VCENTER_USER}:${VCENTER_PASSWORD}`
            )}`,
          },
        },
        genToken,
        responseInternalServer
      )
    })
  })
}

const functionRoutes = {
  list,
  listAll,
  cleartags,
  importHost,
  importVobject,
  getToken,
}
module.exports = functionRoutes
