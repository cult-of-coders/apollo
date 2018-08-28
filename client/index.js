import ApolloClient from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { split, concat, ApolloLink } from 'apollo-link';
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

  const uploadLink = createUploadLink();

  if (meteorAccountsLink) {
    links.push(concat(meteorAccountsLink, httpLink, uploadLink));
  } else {
    links.push(httpLink);
  }

  const link = split(({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  }, ...links);

  let transformedLink = Config.getLink(link);

  const client = new ApolloClient({
    link: transformedLink,
    cache: new InMemoryCache({
      dataIdFromObject: object => object._id || null,
    }).restore(window.__APOLLO_STATE__ || {}),
  });

  return {
    client,
    link,
    wsLink,
    httpLink,
    uploadLink,
  };
}

export { Config };
