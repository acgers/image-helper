'use strict'

type EnableSaveUnAuthPic = (saveUnAuthPicEnabled: boolean) => Promise<boolean>
type ContextEvent = (e: Event) => boolean
type UrlCheck = (url: string) => boolean

const performFix = (fn: EnableSaveUnAuthPic): void => {
  chrome.storage.sync.get('ifSaveUnAuthPic', (items: { [key: string]: any }) => {
    fn(items['ifSaveUnAuthPic'] as boolean).then((saveUnAuthPicEnabled: boolean) => {
      if (saveUnAuthPicEnabled) {
        const allowContextMenu: ContextEvent = (e) => {
          e.stopImmediatePropagation()
          return true
        }
        const allowMouseDown: ContextEvent = (e) => {
          e.stopImmediatePropagation()
          return true
        }
        const allowSelectStart: ContextEvent = (e) => {
          e.stopImmediatePropagation()
          return true
        }
        const allowCut: ContextEvent = (e) => {
          e.stopImmediatePropagation()
          return true
        }
        const allowCopy: ContextEvent = (e) => {
          e.stopImmediatePropagation()
          return true
        }
        const allowPaste: ContextEvent = (e) => {
          e.stopImmediatePropagation()
          return true
        }

        document.addEventListener('contextmenu', allowContextMenu, true)
        document.addEventListener('mousedown', allowMouseDown, true)
        document.addEventListener('selectstart', allowSelectStart, true)

        document.addEventListener('cut', allowCut, true)
        document.addEventListener('copy', allowCopy, true)
        document.addEventListener('paste', allowPaste, true)
      }
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        const message = request as Message
        switch (message.type) {
          case 'C_SAVE':
            const imgmsg: SaveImageMessage = request as SaveImageMessage
            const selectInfo = imgmsg.info
            const imgSrc: string | undefined = selectInfo.srcUrl
            console.log(`info: ${JSON.stringify(imgmsg.info)}`)
            console.log(`tab: ${JSON.stringify(imgmsg.tab)}`)
            if (typeof imgSrc === 'string') {
              const durl: string = imgSrc.substring(0, imgSrc.lastIndexOf('/'))
              console.log(`durl: ${durl}`)
              if (isImg(durl)) {
                const response: ImageResponse = { durl }
                sendResponse(response)
              }
            }
            break
          default: break
        }
      })
    })
  })
}

performFix(async (saveUnAuthPicEnabled: boolean) => { return saveUnAuthPicEnabled })

const isImg: UrlCheck = (imgurl: string) => {
  const suffix = imgurl.substring(imgurl.lastIndexOf('.'), imgurl.length)
  return /\.(gif|jpg|jpeg|png|apng|webp|bmp|tiff|svg|exif|wmf)$/.test(suffix.toLowerCase())
}
