import { SubscriptionClient } from 'subscriptions-transport-ws';
import ApolloClient from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { split, concat, ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import { meteorAccountsLink } from './meteorAccountsLink';
import {
  GRAPHQL_SUBSCRIPTION_ENDPOINT,
  GRAPHQL_ENDPOINT,
  AUTH_TOKEN_KEY,
} from '../constants';

export const wsLink = new WebSocketLink({
  uri: GRAPHQL_SUBSCRIPTION_ENDPOINT,
  options: {
    reconnect: true,
    connectionParams: () => ({
      [AUTH_TOKEN_KEY]: localStorage.getItem('Meteor.loginToken'),
    }),
  },
});

export const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  // meteorAccountsLink sends 'meteor-login-token' as header
  concat(meteorAccountsLink, httpLink)
);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache({
    dataIdFromObject: object => object._id || null
  }),
});
