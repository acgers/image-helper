'use strict'

import * as $ from 'jquery'

interface Settings {
  ifSaveUnAuthPic: boolean
}

type UserSettings = (settings: Settings) => Promise<Settings>

$(() => {
  const restoreOptions = (fn: UserSettings): void => {
    chrome.storage.sync.get(null, (items: { [key: string]: any }) => {
      fn(<Settings>items).then((settings: Settings) => {
        const { ifSaveUnAuthPic } = settings
        const allowSaveUnAuth = <HTMLInputElement>$('#allow-un-auth')[0]
        allowSaveUnAuth.checked = ifSaveUnAuthPic
      })
    })
  }

  const saveOptions = () => {
    const allowSaveUnAuth = <HTMLInputElement>$('#allow-un-auth')[0]
    chrome.storage.sync.set({
      ifSaveUnAuthPic: allowSaveUnAuth.checked
    }, () => {
      window.close()
      console.log('saved')
    })
  }

  // document.addEventListener('DOMContentLoaded', restoreOptions);
  restoreOptions(async (settings: Settings) => { return settings })

  $('#save-un-auth-pic').text(chrome.i18n.getMessage('ifSaveUnAuthPic'))
  $('#save').text(chrome.i18n.getMessage('optionsSaveBtn'))
  $('#save').on('click', saveOptions)
})
