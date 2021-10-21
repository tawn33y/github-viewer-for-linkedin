import marked from 'marked';
import { defaultUser, getUserFromApi, User } from './api';
import { getGithubUsernameFromLinkedInContactInfoModal } from './getGithubUsername';
import { getEmberContainerHtml, getNoResultsHtml, getRepoCardHtml } from './htmlHelpers';

const renderReadMe = (user: User): void => {
  const htmlFromMarkdown = user.readme?.object?.text && marked(user.readme.object.text);
  const childHtml = htmlFromMarkdown ?? getNoResultsHtml('No README found.');

  const emberContainerHtml = getEmberContainerHtml('Github README', 'readme', user.url, childHtml);

  document.querySelector('#main .pv-oc:not(#oc-background-section)')?.insertAdjacentHTML('afterend', emberContainerHtml);
};

const renderReposList = (user: User, username?: string): void => {
  const childHtml = user.repositories.nodes.length > 0 && username
    ? user.repositories.nodes.map((repo) => getRepoCardHtml(repo, username)).join('')
    : getNoResultsHtml('No repos found.');
    
  const emberContainerHtml = getEmberContainerHtml('Github Repos', 'repos', user.url, childHtml);

  document.querySelector('#main #ember-gvfl-readme')?.insertAdjacentHTML('afterend', emberContainerHtml);
};

let isLoading = false;

const displayGithubView = async (): Promise<void> => {
  if (isLoading) return;
  isLoading = true;

  let user = defaultUser;
  const username = await getGithubUsernameFromLinkedInContactInfoModal();

  if (username) {
    const userFromApi = await getUserFromApi(username);
    if (userFromApi) user = userFromApi;
  } else {
    // TODO: render a small search window
  }

  renderReadMe(user);
  renderReposList(user, username);
  isLoading = false;
};

window.addEventListener('load', () => {
  displayGithubView();
});

chrome.runtime.onMessage.addListener((request): void => {
  if (request.message === 'onDisplayGithubView') {
    displayGithubView();
  }
});
