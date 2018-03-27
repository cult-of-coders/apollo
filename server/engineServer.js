export function createEngine({ expressApp, port, apiKey }) {
  const { ApolloEngine } = require('apollo-engine');

  const engine = new ApolloEngine({
    apiKey,
  });

  engine.listen({
    port,
    expressApp,
  });

  return engine;
}
