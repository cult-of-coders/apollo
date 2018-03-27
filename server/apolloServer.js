import { Meteor } from 'meteor/meteor';
import { getExecutableSchema } from './schema';
import { GRAPHQL_SUBSCRIPTION_ENDPOINT } from '../constants';
import { createApolloServer } from './core/main-server';
import Config from './config';

export function createServer({ schema }) {
  return createApolloServer(
    {
      schema,
    },
    {
      context: Config.CONTEXT,
      graphiqlOptions: {
        subscriptionsEndpoint: GRAPHQL_SUBSCRIPTION_ENDPOINT,
      },
    }
  );
}
