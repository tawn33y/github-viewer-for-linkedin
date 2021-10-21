// https://newbedev.com/how-to-listen-for-url-change-with-chrome-extension
// https://stackoverflow.com/questions/20865581/chrome-extension-content-script-not-loaded-until-page-is-refreshed
// chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab): void => {
//   let previousUrl = '';
//   const newUrl = tab.url;

//   if (changeInfo.status === 'complete' && newUrl?.includes('linkedin.com/in') && previousUrl !== newUrl) {
//     const numSlugs = newUrl.split('linkedin.com/in')[1]
//       .split('/')
//       .map(str => str.replace(/\s+/g, ''))
//       .filter(str => !!str)
//       .length;
//     if (numSlugs > 1) return;

//     chrome.tabs.sendMessage(tabId, {
//       message: 'onDisplayGithubView',
//     });
//     previousUrl = newUrl;
//   }
// });

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  let previousUrl = '';
  const newUrl = details.url;

  if (newUrl?.includes('linkedin.com/in') && previousUrl !== newUrl) {
    const numSlugs = newUrl.split('linkedin.com/in')[1]
      .split('/')
      .map(str => str.replace(/\s+/g, ''))
      .filter(str => !!str)
      .length;
    if (numSlugs > 1) return;

    chrome.tabs.sendMessage(details.tabId, {
      message: 'onDisplayGithubView',
    });
    previousUrl = newUrl;
  }

  // chrome.tabs.executeScript(null,{file:"contentscript.js"});
});
