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

export function initialize(config = {}) {
  Object.assign(Config, config);
  Object.freeze(Config);

  let links = [];
  let wsLink;

  if (!Config.DISABLE_WEBSOCKETS) {
    wsLink = new WebSocketLink({
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

  const httpLink = new HttpLink({
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

  const client = new ApolloClient({
    link,
    cache: new InMemoryCache({
      dataIdFromObject: object => object._id || null,
    }),
  });

  return {
    client,
    link,
    wsLink,
    httpLink,
  };
}

export { Config };
