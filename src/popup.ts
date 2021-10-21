const sendMessage = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id;
    if (!tabId) return;

    chrome.tabs.sendMessage(tabId, {
      message: 'onDisplayGithubView',
    });

    const promptForceStartEl = document.getElementById('prompt-force-start');
    const promptDoneEl = document.getElementById('prompt-done');
    const promptDoneCountEl = document.getElementById('prompt-done-count');

    if (!promptForceStartEl || !promptDoneEl || !promptDoneCountEl) return;

    promptForceStartEl.style.display = 'none';
    promptDoneEl.style.display = 'block';
    setTimeout(() => promptDoneCountEl.innerHTML = '2', 1000);
    setTimeout(() => promptDoneCountEl.innerHTML = '1', 2000);
    setTimeout(() => {
      promptForceStartEl.style.display = 'block';
      promptDoneEl.style.display = 'none';
      promptDoneCountEl.innerHTML = '3';
    }, 3000);
  });
};

window.addEventListener('load', () => {
  const promptForceStartHyperlinkEl = document.getElementById('prompt-force-start-hyperlink');

  promptForceStartHyperlinkEl?.addEventListener('click', sendMessage, false);
});
