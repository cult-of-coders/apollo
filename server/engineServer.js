import { WebApp } from 'meteor/webapp';

export function createEngine({ expressApp, port, apiKey }) {
  const { ApolloEngine } = require('apollo-engine');

  const engine = new ApolloEngine({
    apiKey,
  });

  engine.meteorListen(WebApp);

  return engine;
}
