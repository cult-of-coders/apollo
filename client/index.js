import { SubscriptionClient } from 'subscriptions-transport-ws';
import ApolloClient from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { split, concat, ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import { meteorAccountsLink } from './meteorAccountsLink';
import Config from './config';

import {
  GRAPHQL_SUBSCRIPTION_ENDPOINT,
  GRAPHQL_ENDPOINT,
  AUTH_TOKEN_KEY,
} from '../constants';

let links = [];

if (!Config.DISABLE_WEBSOCKETS) {
  export const wsLink = new WebSocketLink({
    uri: GRAPHQL_SUBSCRIPTION_ENDPOINT,
    options: {
      reconnect: true,
      connectionParams: () => ({
        [AUTH_TOKEN_KEY]: localStorage.getItem('Meteor.loginToken'),
      }),
    },
  });

  links.push(wsLink);
}

export const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
});

if (meteorAccountsLink) {
  links.push(concat(meteorAccountsLink, httpLink));
} else {
  links.push(httpLink);
}

const link = split(({ query }) => {
  const { kind, operation } = getMainDefinition(query);
  return kind === 'OperationDefinition' && operation === 'subscription';
}, ...links);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    dataIdFromObject: object => object._id || null,
  }),
});

export { Config };
