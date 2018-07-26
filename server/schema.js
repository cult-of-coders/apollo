import { makeExecutableSchema } from 'graphql-tools';
import { load, getSchema } from 'graphql-load';
import Config from './config';
import directives from './directives';

const EMPTY_QUERY_ERROR =
  'Error: Specified query type "Query" not found in document.';

export function getExecutableSchema(meteorApolloOptions) {
  try {
    const { typeDefs, resolvers } = getSchema();
    schema = makeExecutableSchema({
      typeDefs,
      resolvers,
      schemaDirectives: {
        ...directives,
        ...meteorApolloOptions.schemaDirectives,
      },
    });
  } catch (error) {
    if (error.toString() === EMPTY_QUERY_ERROR) {
      throw '[cultofcoders:apollo] You do not have any Query loaded yet. Please use { load } from "graphql-load" package to initialize your typeDefs and resolvers.';
    }
    throw error;
  }

  return schema;
}
