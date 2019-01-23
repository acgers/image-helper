'use strict'

import * as $ from 'jquery'

$(() => {
  const bkgPage: Window | null = chrome.extension.getBackgroundPage()

  $('#bcy-nav').html(chrome.i18n.getMessage('bcyNavText'))
  $('#lofter-nav').html(chrome.i18n.getMessage('lofterNavText'))
  // $('#diyi-nav').html(chrome.i18n.getMessage('diyiNavText'))
  $('#twi-nav').html(chrome.i18n.getMessage('twiNavText'))

  $('#bcy-nav').on('click', () => window.open('https://bcy.net', '_blank'))
  $('#lofter-nav').on('click', () => window.open('http://lofter.com', '_blank'))
  // $('#diyi-nav').on('click', () => window.open('http://diyidan.com', '_blank'))
  $('#twi-nav').on('click', () => window.open('https://twitter.com', '_blank'))

  const setDynamicText = (): void => {
    if (bkgPage !== null) {
      bkgPage.chrome.cookies.getAll({
        path: '/',
        domain: '.bcy.net',
        name: 'LOGGED_USER'
      }, (cookies: chrome.cookies.Cookie[]) => {
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
