interface Message {
  type: string
}

interface SaveImageMessage extends Message {
  info: chrome.contextMenus.OnClickData
  tab: chrome.tabs.Tab
}
