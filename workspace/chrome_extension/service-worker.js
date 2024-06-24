const XSY_DOMAIN = '.xiaoshouyi.com';

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  if (url.origin.includes(XSY_DOMAIN) || url.origin.includes("chrome.com")) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: 'sidepanel.html',
      enabled: true
    });
  } else {
    await chrome.sidePanel.setOptions({
      tabId,
      enabled: false
    });
  }
});

chrome.runtime.onMessage.addListener( async function(request, sender, sendResponse) {

  if (request.cmd === "get_tree_data") {
    sendResponse({message: "background_received!"});
    const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
    const response = await chrome.tabs.sendMessage(tab.id, {cmd: "get_tree_data"});
  }

  if (request.cmd === "return_tree_data") {
    chrome.runtime.sendMessage({
      cmd: "return_tree_data_from_background",
      data: request.data
    });
  }
});
