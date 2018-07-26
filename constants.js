import { Meteor } from 'meteor/meteor';

export const AUTH_TOKEN_KEY = 'meteor-login-token';
export const AUTH_TOKEN_LOCALSTORAGE = 'Meteor.loginToken';

export const GRAPHQL_SUBSCRIPTION_PATH = 'graphql';
export const GRAPHQL_SUBSCRIPTION_ENDPOINT = Meteor.absoluteUrl(
  GRAPHQL_SUBSCRIPTION_PATH
).replace(/http/, 'ws');

export const GRAPHQL_ENDPOINT = Meteor.absoluteUrl('/graphql').replace(
  '//graphql',
  '/graphql'
);
