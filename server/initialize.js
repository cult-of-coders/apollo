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

/**
 *
 * @param {*} apolloConfig Options https://www.apollographql.com/docs/apollo-server/api/apollo-server.html#constructor-options-lt-ApolloServer-gt
 * @param {MeteorApolloConfig} meteorApolloConfig
 */
export default function initialize(apolloConfig = {}, meteorApolloConfig = {}) {
  meteorApolloConfig = Object.assign(
    {
      gui: Meteor.isDevelopment,
      middlewares: [],
      schemaDirectives: [],
      context: { db },
      userDefaultFields: {
        _id: 1,
        roles: 1,
        username: 1,
        emails: 1,
      },
    },
    meteorApolloConfig
  );

  const schema = getExecutableSchema(meteorApolloConfig);

  apolloConfig = Object.assign(
    {
      schema,
      introspection: Meteor.isDevelopment,
      debug: Meteor.isDevelopment,
      path: '/graphql',
      formatError: e => ({
        message: e.message,
        locations: e.locations,
        path: e.path,
      }),
      context: getContextCreator(meteorApolloConfig),
      subscriptions: getSubscriptionConfig(),
    },
    apolloConfig
  );

  const server = new ApolloServer(apolloConfig);

  server.applyMiddleware({
    app: WebApp.connectHandlers,
    gui: meteorApolloConfig.gui,
  });

  server.installSubscriptionHandlers(WebApp.httpServer);

  meteorApolloConfig.middlewares.forEach(middleware => {
    WebApp.connectHandlers.use('/graphql', middleware);
  });

  // We are doing this work-around because Playground sets headers and WebApp also sets headers
  // Resulting into a conflict and a server side exception of "Headers already sent"
  WebApp.connectHandlers.use('/graphql', (req, res) => {
    if (req.method === 'GET') {
      res.end();
    }
  });
}

function getContextCreator(meteorApolloConfig) {
  return async function getContext({ req, connection }) {
    if (connection) {
      return {
        ...meteorApolloConfig.context,
        ...connection.context,
      };
    } else {
      let userContext = {};
      if (Package['accounts-base']) {
        const loginToken = req.headers['meteor-login-token'];
        userContext = await getUserForContext(
          loginToken,
          meteorApolloConfig.userDefaultFields
        );
      }

      return {
        ...meteorApolloConfig.context,
        ...userContext,
      };
    }
  };
}

function getSubscriptionConfig(meteorApolloConfig) {
  return {
    onConnect: async (connectionParams, webSocket, context) => {
      const loginToken = connectionParams[AUTH_TOKEN_KEY];

      return new Promise((resolve, reject) => {
        if (loginToken) {
          const userContext = getUserForContext(
            loginToken,
            meteorApolloConfig.userDefaultFields
          ).then(userContext => {
            resolve(userContext);
          });
        } else {
          resolve({});
        }
      });
    },
  };
}
