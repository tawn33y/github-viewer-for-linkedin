import marked from 'marked';
import DOMPurify from 'dompurify';
import { print } from 'graphql/language/printer';
import userQuery from './graphql/userQuery.gql';

interface Repo {
  description: string;
  forkCount: number;
  name: string;
  primaryLanguage: null | {
    color: string;
    name: string;
  };
  stargazerCount: number;
  url: string;
}

interface User {
  url: string;
  readme: {
    object: null | {
      text: string;
    };
  };
  repositories: {
    nodes: Repo[];
  };
}

const getUserFromApi = async (login: string): Promise<User> => {
  const result = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${process.env.GITHUB_AUTH_TOKEN}`
    },
    body: JSON.stringify({
      query: print(userQuery),
      variables: {
        login,
      },
    }),
  })
    .then((res) => res.json());

  if (!result.data) throw new Error(result.message);
  const { data: { user } } = result;

  return user;
};

const getReadMeHtml = (markdown: string): string => {
  const rawHtml = marked(markdown);
  const html = DOMPurify.sanitize(rawHtml);
  return html;
};

const generateRepoCard = (login: string, repo: Repo): string => `
  <div class="Box d-flex py-3 width-full">
    <a class="text-bold flex-auto min-width-0" href="${repo.url}" target="_blank">
      ${repo.name}
    </a>

    <p class="pinned-item-desc color-text-secondary text-small d-block mt-2 mb-3">
      ${repo.description}
    </p>

    <p class="mb-0 f6 color-text-secondary">
      ${!repo.primaryLanguage
        ? ''
        : `
          <span class="d-inline-block mr-3">
            <span class="repo-language-color" style="background-color: ${repo.primaryLanguage.color}"></span>
            <span itemprop="programmingLanguage">${repo.primaryLanguage.name}</span>
          </span>
        `
      }
      <a href="/${login}/awesome-github-profile-readme/stargazers" class="pinned-item-meta Link--muted">
        <svg aria-label="stars" role="img" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-star">
          <path fill-rule="evenodd" d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"></path>
        </svg>
        ${repo.stargazerCount}
      </a>
      <a href="/${login}/awesome-github-profile-readme/network/members" class="pinned-item-meta Link--muted">
        <svg aria-label="forks" role="img" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-repo-forked">
          <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
        </svg>
        ${repo.forkCount}
      </a>
    </p>
  </div>
`;

const generateReadMeCard = (content?: string) => `<div>${content}</div`;

window.addEventListener('load', async () => {
  const login = 'tawn33y';
  const user = await getUserFromApi(login);
  const readme = user.readme.object ? getReadMeHtml(user.readme.object.text) : 'No README found.';

  document.querySelectorAll('#app #repos')[0].innerHTML = user.repositories.nodes.map((repo) => generateRepoCard(login, repo)).join('');
  document.querySelectorAll('#app #readme')[0].innerHTML = generateReadMeCard(readme);
});
