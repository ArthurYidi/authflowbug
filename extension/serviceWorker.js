// open options page when installed
chrome.runtime.onInstalled.addListener((_reason) => {
  chrome.runtime.openOptionsPage();
});
