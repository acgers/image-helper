'use strict'

import * as $ from 'jquery'

$(() => {
  const bkgPage: Window | null = chrome.extension.getBackgroundPage()

  $('#bcy-nav').html(chrome.i18n.getMessage('bcyNavText'))
  $('#bcy-favorite').html(chrome.i18n.getMessage('myBcyFavorite'))

  $('#bcy-nav').on('click', () => {
    window.open('https://bcy.net', '_blank')
  })

  const setDynamicText = (): void => {
    if (bkgPage) {
      bkgPage.chrome.cookies.getAll({
        path: '/',
        domain: '.bcy.net',
        name: 'LOGGED_USER',
      }, cookies => {
        console.log(cookies)
        if (cookies.length === 0) {
          $('#bcy-favorite').html(chrome.i18n.getMessage('myBcyFavorite')
            + chrome.i18n.getMessage('notLogged'))
        } else {
          $('#bcy-favorite').html(chrome.i18n.getMessage('myBcyFavorite'))
        }
      })
    }
  }

  setDynamicText()
})
