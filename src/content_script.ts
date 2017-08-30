'use strict'

let performFix = (fn: (saveUnAuthPicEnabled: boolean) => Promise<boolean>): void => {
  chrome.storage.sync.get('ifSaveUnAuthPic', items => {
    fn(items['ifSaveUnAuthPic']).then(saveUnAuthPicEnabled => {
      if (saveUnAuthPicEnabled) {
        let allowCut = e => {
          e.stopImmediatePropagation();
          return true;
        }
        let allowCopy = e => {
          e.stopImmediatePropagation();
          return true;
        }
        let allowPaste = e => {
          e.stopImmediatePropagation();
          return true;
        }
        let allowContextMenu = e => {
          e.stopImmediatePropagation();
          return true;
        }
        let allowDragStart = e => {
          e.stopImmediatePropagation();
          return true;
        }
        let allowDrag = e => {
          e.stopImmediatePropagation();
          return true;
        }
        let allowDrop = e => {
          e.stopImmediatePropagation();
          return true;
        }
        let allowMouseDown = e => {
          e.stopImmediatePropagation();
          return true;
        }
        let allowSelectStart = e => {
          e.stopImmediatePropagation();
          return true;
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
            let selectInfo: chrome.contextMenus.OnClickData = request.info
            let imgSrc: string = selectInfo.srcUrl!
            console.log(`info: ${JSON.stringify(request.info)}`);
            console.log(`tab: ${JSON.stringify(request.tab)}`); 1
            let durl: string = imgSrc.substring(0, imgSrc.lastIndexOf('/'))
            console.log(`durl: ${durl}`)
            sendResponse({ durl: durl })
            break
          default: break
        }
      })
    })
  })
}

performFix(async saveUnAuthPicEnabled => { return saveUnAuthPicEnabled })
