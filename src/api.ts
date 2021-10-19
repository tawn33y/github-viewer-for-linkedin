import { print } from 'graphql/language/printer';
import userQuery from './graphql/userQuery.gql';

export interface Repo {
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

export interface User {
  url: string | null;
  readme: null | {
    object: null | {
      text: string;
    };
  };
  repositories: {
    nodes: Repo[];
  };
}

export const defaultUser: User = {
  url: null,
  readme: null,
  repositories: {
    nodes: [],
  },
};

export const getUserFromApi = async (username: string): Promise<User> => {
  const result = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `bearer ${process.env.GITHUB_AUTH_TOKEN}`,
    },
    body: JSON.stringify({
      query: print(userQuery),
      variables: {
        login: username,
      },
    }),
  })
    .then((res) => res.json());

  if (!result.data) throw new Error(result.message);
  const { data: { user } } = result;

  return user;
};
