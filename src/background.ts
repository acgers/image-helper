'use strict'

chrome.contextMenus.create({
  id: 'm_pic_bcy_origin',
  title: chrome.i18n.getMessage('saveOrgBtn'),
  enabled: true,
  checked: false,
  // "all", "page", "frame", "selection", "link", "editable", "image",
  // "video", "audio", "launcher", "browser_action", or "page_action"
  contexts: ['image']
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'm_pic_bcy_origin') {
    chrome.tabs.query({ active: true, currentWindow: true }, result => {
      result.map((v, i) => {
        chrome.tabs.sendMessage(v.id, { type: 'C_SAVE', info: info, tab: tab }, response => {
          let durl: string = response.durl
          chrome.downloads.download({ url: durl }, downloadId => {
            if (downloadId == null) {
              console.error(`download ${durl} failed.`)
            }
          })
        })
      })
    })
  }
})
