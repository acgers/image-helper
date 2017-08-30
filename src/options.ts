'use strict'

import * as $ from 'jquery'

$(() => {
  const restoreOptions = (fn: (settings) => Promise<{ ifSaveUnAuthPic }>): void => {
    var ifSaveUnAuthPic: boolean = false
    chrome.storage.sync.get({ ifSaveUnAuthPic: false }, items => {
      fn(items).then(settings => {
        let { ifSaveUnAuthPic } = settings
        let allowSaveUnAuth = <HTMLInputElement>$('#allow-un-auth')[0]
        allowSaveUnAuth.checked = !!ifSaveUnAuthPic
      })
    })
  }

  const saveOptions = () => {
    let allowSaveUnAuth = <HTMLInputElement>$('#allow-un-auth')[0]
    chrome.storage.sync.set({
      ifSaveUnAuthPic: allowSaveUnAuth.checked
    }, () => {
      console.log('saved')
      window.close()
    })
  }

  // document.addEventListener('DOMContentLoaded', restoreOptions);
  restoreOptions(async settings => { return settings })

  $('#save-un-auth-pic').text(chrome.i18n.getMessage('ifSaveUnAuthPic'))
  $('#save').text(chrome.i18n.getMessage('optionsSaveBtn'))
  $('#save').on('click', saveOptions)
})
