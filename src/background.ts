chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  let previousUrl = '';
  const newUrl = details.url;

  if (newUrl?.includes('linkedin.com/in') && !previousUrl.includes('linkedin.com/in') && previousUrl !== newUrl) {
    chrome.tabs.sendMessage(details.tabId, {
      message: 'onDisplayGithubView',
    });
    previousUrl = newUrl;
  }
});
