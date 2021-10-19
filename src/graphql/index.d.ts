// https://www.npmjs.com/package/graphql-tag#importing-graphql-files
// https://github.com/apollographql/graphql-tag/issues/59#issuecomment-316991007

declare module '*.graphql' {
  import { DocumentNode } from 'graphql';

  const value: DocumentNode;
  export default value;
}

declare module '*.gql' {
  import { DocumentNode } from 'graphql';

  const value: DocumentNode;
  export default value;
}
