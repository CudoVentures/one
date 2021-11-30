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
import root from 'window-or-global'

/**
 * Save an item in the browser storage.
 *
 * @param {string} name
 * - Name of item in the storage
 * @param {string} data
 * - Data will be saved into storage
 * @param {boolean} keepData
 * - If `true`, save the data in local storage, instead of session storage
 */
export const storage = (name = '', data = '', keepData = false) => {
  if (name && data) {
    keepData
      ? root?.localStorage?.setItem(name, data)
      : root?.sessionStorage?.setItem(name, data)
  }
}

/**
 * Remove group of items from the browser storage.
 *
 * @param {string[]} items - List of item names
 */
export const removeStoreData = (items = []) => {
  const itemsToRemove = !Array.isArray(items) ? [items] : items

  itemsToRemove.forEach((item) => {
    root?.localStorage?.removeItem(item)
    root?.sessionStorage?.removeItem(item)
  })
}

/**
 * Looking for an item in the browser storage.
 *
 * @param {string} name - Name of item
 * @returns {object|string} Returns the item if found it
 */
export const findStorageData = (name = '') => {
  if (name && root?.localStorage?.getItem(name)) {
    return root.localStorage.getItem(name)
  } else if (name && root?.sessionStorage?.getItem(name)) {
    return root.sessionStorage.getItem(name)
  } else return false
}
