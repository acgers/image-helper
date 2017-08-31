'use strict'

let performFix = (fn: (saveUnAuthPicEnabled: boolean) => Promise<boolean>): void => {
  chrome.storage.sync.get('ifSaveUnAuthPic', items => {
    fn(items['ifSaveUnAuthPic']).then(saveUnAuthPicEnabled => {
      if (saveUnAuthPicEnabled) {
        const allowCut = e => {
          e.stopImmediatePropagation()
          return true
        }
        const allowCopy = e => {
          e.stopImmediatePropagation()
          return true
        }
        const allowPaste = e => {
          e.stopImmediatePropagation()
          return true
        }
        const allowContextMenu = e => {
          e.stopImmediatePropagation()
          return true
        }
        const allowDragStart = e => {
          e.stopImmediatePropagation()
          return true
        }
        const allowDrag = e => {
          e.stopImmediatePropagation()
          return true
        }
        const allowDrop = e => {
          e.stopImmediatePropagation()
          return true
        }
        const allowMouseDown = e => {
          e.stopImmediatePropagation()
          return true
        }
        const allowSelectStart = e => {
          e.stopImmediatePropagation()
          return true
        }

        document.addEventListener('contextmenu', allowContextMenu, true)
        document.addEventListener('mousedown', allowMouseDown, true)
        document.addEventListener('selectstart', allowSelectStart, true)

        // document.addEventListener('cut', allowCut, true)
        // document.addEventListener('copy', allowCopy, true)
        // document.addEventListener('paste', allowPaste, true)
        // document.addEventListener('dragstart', allowDragStart, true)
        // document.addEventListener('drag', allowDrag, true)
        // document.addEventListener('drop', allowDrop, true)
      }
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        switch (request.type) {
          case 'C_SAVE':
            const selectInfo: chrome.contextMenus.OnClickData = request.info
            const imgSrc: string = selectInfo.srcUrl!
            console.log(`info: ${JSON.stringify(request.info)}`)
            console.log(`tab: ${JSON.stringify(request.tab)}`)
            const durl: string = imgSrc.substring(0, imgSrc.lastIndexOf('/'))
            console.log(`durl: ${durl}`)
            if (isImg(durl)) {
              sendResponse({ durl })
            }
            break
          default: break
        }
      })
    })
  })
}

performFix(async saveUnAuthPicEnabled => { return saveUnAuthPicEnabled })

const isImg: (string) => boolean = (imgurl: string) => {
  const suffix = imgurl.substring(imgurl.lastIndexOf('.'), imgurl.length)
  return /\.(gif|jpg|jpeg|png|apng|webp|bmp|tiff|svg|exif|wmf)$/.test(suffix.toLowerCase())
}
