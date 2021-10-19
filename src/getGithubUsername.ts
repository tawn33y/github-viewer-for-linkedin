/**
 * Waits for an HTML element to be rendered on document
 */
const waitForElement = (selector: string): Promise<Element | null> => new Promise(resolve => {
  if (document.querySelector(selector)) {
    return resolve(document.querySelector(selector));
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const observer = new MutationObserver((_mutations) => {
    if (document.querySelector(selector)) {
      resolve(document.querySelector(selector));
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});

/**
 * A manual way to get the Github username of a user from their LinkedIn profile.
 * In the profile section, there is a link labelled 'Contact info', which when clicked,
 * opens a modal containing a user's website, email, etc. If a user has listed their Github
 * url there, this will get that url and then extract the username.
 */
export const getGithubUsernameFromLinkedInContactInfoModal = async (): Promise<string | undefined> => {
  // open modal
  let el;
  for (const searchEl of document.querySelectorAll('a.ember-view') as any) {
    if (searchEl.textContent.includes('Contact info')) {
      el = searchEl;
    }
  }
  el.click();
  await waitForElement('button.artdeco-modal__dismiss');

  // extract username from url
  let username;
  const linksEl = document.querySelectorAll('a.pv-contact-info__contact-link');
  for (var i = 0, len = linksEl.length; i < len; i++) {
    const url = (linksEl[i] as HTMLElement).innerText;
    if (url.includes('github.com')) {
      username = url
        .split('/')
        .map(str => str.replace(/\s+/g, '')) // trim whitespace
        .filter(str => !!str) // remove empty elements
        .slice(-1)[0]; // pick last element
    }
  }

  // close modal
  (document.querySelectorAll('button.artdeco-modal__dismiss')[0] as HTMLElement)?.click?.();

  return username;
};
