'use strict'

type EnableSaveUnAuthPic = (saveUnAuthPicEnabled: boolean) => Promise<boolean>
type ContextEvent = (e: Event) => boolean
type ImageUrlCheck = (url: string) => boolean

const IMAGE_SUFIX_LENGTH = 5

const performFix = (fn: EnableSaveUnAuthPic): void => {
  chrome.storage.sync.get('ifSaveUnAuthPic', (items: { [key: string]: any }) => {
    fn(items['ifSaveUnAuthPic'] as boolean).then((saveUnAuthPicEnabled: boolean) => {
      if (saveUnAuthPicEnabled) {
        const allowContextMenu: ContextEvent = e => {
          e.stopImmediatePropagation()
          e.returnValue = true
          return true
        }
        const allowMouseDown: ContextEvent = e => {
          e.stopImmediatePropagation()
          e.returnValue = true
          return true
        }
        const allowSelectStart: ContextEvent = e => {
          e.stopImmediatePropagation()
          e.returnValue = true
          return true
        }
        const allowCut: ContextEvent = e => {
          e.stopImmediatePropagation()
          e.returnValue = true
          return true
        }
        const allowCopy: ContextEvent = e => {
          e.stopImmediatePropagation()
          e.returnValue = true
          return true
        }
        const allowPaste: ContextEvent = e => {
          e.stopImmediatePropagation()
          e.returnValue = true
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
            // console.log(`info: ${JSON.stringify(imgmsg.info)}`)
            // console.log(`tab: ${JSON.stringify(imgmsg.tab)}`)
            console.log(imgSrc)
            if (typeof imgSrc === 'string') {
              let durl, name
              if (isImg(imgSrc)) {
                durl = imgSrc
              }

              const urlTest1: string = imgSrc.substring(0, imgSrc.lastIndexOf('/'))
              if (isImg(urlTest1)) {
                durl = urlTest1
              }

              const urlTest2: string = imgSrc.substring(0, imgSrc.lastIndexOf('?'))
              if (isImg(urlTest2)) {
                durl = urlTest2
              }

              const urlTest3: string = imgSrc.substring(0, imgSrc.lastIndexOf('!'))
              if (isImg(urlTest3)) {
                durl = urlTest3
              }

              const urlTest4: string = imgSrc.substring(0, imgSrc.lastIndexOf('#'))
              if (isImg(urlTest4)) {
                durl = urlTest4
              }

              if (durl !== undefined) {
                if (durl.indexOf('pbs.twimg.com') > 0) {
                  durl = durl.concat(':orig')
                  name = durl.substring(durl.lastIndexOf('/') + 1, durl.lastIndexOf(':'))
                }

                if (durl.endsWith('.image')) {
                  durl = durl.substring(0, durl.length - IMAGE_SUFIX_LENGTH).concat('png')
                }
                const response: ImageResponse = { durl, name }
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

const imgReg: RegExp = /\.(image|gif|jpg|jpeg|png|apng|webp|bmp|tiff|svg|exif|wmf)$/

const isImg: ImageUrlCheck = (imgurl: string) => {
  const suffix = imgurl.substring(imgurl.lastIndexOf('.'), imgurl.length)
  return imgReg.test(suffix.toLowerCase())
}
