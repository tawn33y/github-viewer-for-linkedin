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
});
