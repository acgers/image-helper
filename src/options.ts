'use strict'

import * as $ from 'jquery'

$(() => {
  const restoreOptions = (fn: (settings) => Promise<{ ifSaveUnAuthPic }>): void => {
    const ifSaveUnAuthPic = false
    chrome.storage.sync.get({ ifSaveUnAuthPic: false }, items => {
      fn(items).then(settings => {
        const { ifSaveUnAuthPic } = settings
        const allowSaveUnAuth = <HTMLInputElement>$('#allow-un-auth')[0]
        allowSaveUnAuth.checked = !!ifSaveUnAuthPic
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
  restoreOptions(async settings => { return settings })

  $('#save-un-auth-pic').text(chrome.i18n.getMessage('ifSaveUnAuthPic'))
  $('#save').text(chrome.i18n.getMessage('optionsSaveBtn'))
  $('#save').on('click', saveOptions)
})
