'use strict'

type ImageResponse = { durl: string }

chrome.contextMenus.create({
  id: 'm_pic_bcy_origin',
  title: chrome.i18n.getMessage('saveOrgBtn'),
  enabled: true,
  checked: false,
  // "all", "page", "frame", "selection", "link", "editable", "image",
  // "video", "audio", "launcher", "browser_action", or "page_action"
  contexts: ['image', 'link']
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'm_pic_bcy_origin') {
    chrome.tabs.query({ active: true, currentWindow: true }, (result) => {
      result.map((v, i) => {
        if (typeof v.id === 'number' && tab !== undefined) {
          const message: SaveImageMessage = { type: 'C_SAVE', info, tab }
          chrome.tabs.sendMessage(v.id, message, (response: any) => {
            const resp = response as ImageResponse
            const durl: string = resp.durl
            chrome.downloads.download({ url: durl }, (downloadId: number) => {
              console.log(`download id: ${downloadId} succeed.`)
            })
          })
        }
      })
    })
  }
})
