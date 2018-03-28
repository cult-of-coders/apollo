import { Meteor } from 'meteor/meteor';
import { getExecutableSchema } from './schema';
import { WebApp } from 'meteor/webapp';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import { AUTH_TOKEN_KEY, GRAPHQL_SUBSCRIPTION_PATH } from '../constants';
import { addCurrentUserToContext } from './core/users';
import Config from './config';

export function createSubscriptionServer({ schema }) {
  // start up a subscription server
  new SubscriptionServer(
    {
      schema,
      execute,
      subscribe,
      // on connect subscription lifecycle event
      onConnect: async (connectionParams, webSocket) => {
        const context = {};

        // if a meteor login token is passed to the connection params from the client,
        // add the current user to the subscription context
        const subscriptionContext = connectionParams[AUTH_TOKEN_KEY]
          ? await addCurrentUserToContext(
              context,
              connectionParams[AUTH_TOKEN_KEY]
            )
          : context;

        return subscriptionContext;
      },
    },
    {
      // bind the subscription server to Meteor WebApp
      server: WebApp.httpServer,
      path: '/' + GRAPHQL_SUBSCRIPTION_PATH,
    }
  );
}
