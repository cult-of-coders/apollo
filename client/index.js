import ApolloClient from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import ApolloLink from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getMainDefinition } from 'apollo-utilities';
import { meteorAccountsLink } from './meteorAccountsLink';
import { createUploadLink } from 'apollo-upload-client';
import Config from './config';
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';

checkNpmVersions({
  'subscriptions-transport-ws': '0.9.x',
  'apollo-upload-client': '8.x.x',
  'apollo-client': '2.x.x',
  'apollo-cache-inmemory': '1.x.x',
  'apollo-link': '1.x.x',
  'apollo-link-http': '1.x.x',
  'apollo-link-ws': '1.x.x',
  // 'apollo-live-client': '0.2.x',
  // 'apollo-morpher': '0.2.x',
});

import {
  GRAPHQL_SUBSCRIPTION_ENDPOINT,
  GRAPHQL_ENDPOINT,
  AUTH_TOKEN_KEY,
} from '../constants';

export function initialize(config = {}) {
  Object.assign(Config, config);
  Object.freeze(Config);

  const uploadLink = createUploadLink();

  let terminatingLink;

  // We define the HTTP Link
  const httpLink = new HttpLink({
    uri: GRAPHQL_ENDPOINT,
    ...(config.httpLinkOptions || {}),
  });

  if (meteorAccountsLink) {
    terminatingLink = ApolloLink.concat(
      meteorAccountsLink,
      uploadLink,
      httpLink
    );
  } else {
    terminatingLink = ApolloLink.concat(uploadLink, httpLink);
  }

  // A chance to add change the links
  terminatingLink = Config.getLink(terminatingLink);

  if (!config.disableWebsockets) {
    wsLink = new WebSocketLink({
      uri: GRAPHQL_SUBSCRIPTION_ENDPOINT,
      options: {
        reconnect: true,
        connectionParams: () => ({
          [AUTH_TOKEN_KEY]: localStorage.getItem('Meteor.loginToken'),
        }),
      },
    });

    // If it's subscription it goes through wsLink otherwise through terminatingLink
    terminatingLink = ApolloLink.split(
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsLink,
      terminatingLink
    );
  }

  const client = new ApolloClient({
    link: terminatingLink,
    cache: new InMemoryCache({
      dataIdFromObject: object => object._id || null,
    }).restore(window.__APOLLO_STATE__ || {}),
  });

  return {
    client,
  };
}

export { Config, meteorAccountsLink };
