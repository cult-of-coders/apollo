import { Meteor } from 'meteor/meteor';
import { db } from 'meteor/cultofcoders:grapher';
import { WebApp } from 'meteor/webapp';

import { addMockFunctionsToSchema } from 'graphql-tools';
import { ApolloServer } from 'apollo-server-express';

import { AUTH_TOKEN_KEY } from '../constants';
import { getExecutableSchema } from './schema';
import { getUserForContext } from './core/users';
import Config from './config';
import { resolve } from 'path';

export default function initialize(config = {}) {
  Object.assign(Config, config);
  Object.assign(Config.CONTEXT, {
    db,
  });

  Object.freeze(Config);
  Object.freeze(Config.CONTEXT);

  const schema = getExecutableSchema();

  if (Config.MOCKING) {
    addMockFunctionsToSchema({
      schema,
      ...Config.MOCKING,
    });
  }

  let apolloConfig = {
    schema,
    introspection: Meteor.isDevelopment,
    debug: Meteor.isDevelopment,
    path: '/graphql',
    // gui: {},
    // error formatting
    formatError: e => ({
      message: e.message,
      locations: e.locations,
      path: e.path,
    }),
    context: getContext,
    subscriptions: getSubscriptionConfig(),
  };

  if (Config.ENGINE_API_KEY) {
    apolloConfig.engine = {
      apiKey: Config.ENGINE_API_KEY,
    };
  }

  const server = new ApolloServer(apolloConfig);

  server.applyMiddleware({
    app: WebApp.connectHandlers,
  });

  server.installSubscriptionHandlers(WebApp.httpServer);

  // We are doing this work-around because Playground sets headers and WebApp also sets headers
  // Resulting into a conflict and a server side exception of "Headers already sent"
  WebApp.connectHandlers.use('/graphql', (req, res) => {
    if (req.method === 'GET') {
      res.end();
    }
  });
}

async function getContext({ req, connection }) {
  if (connection) {
    return {
      ...Config.CONTEXT,
      ...connection.context,
    };
  } else {
    let userContext = {};
    if (Package['accounts-base']) {
      const loginToken = req.headers['meteor-login-token'];
      userContext = await getUserForContext(loginToken);
    }

    return {
      ...Config.CONTEXT,
      ...userContext,
    };
  }
}

function getSubscriptionConfig() {
  return {
    onConnect: async (connectionParams, webSocket, context) => {
      const loginToken = connectionParams[AUTH_TOKEN_KEY];

      return new Promise((resolve, reject) => {
        if (loginToken) {
          const userContext = getUserForContext(loginToken).then(
            userContext => {
              resolve(userContext);
            }
          );
        } else {
          resolve({});
        }
      });
    },
  };
}
