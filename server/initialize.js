import { Meteor } from 'meteor/meteor';
import { db } from 'meteor/cultofcoders:grapher';
import { WebApp } from 'meteor/webapp';
import { ApolloServer } from 'apollo-server-express';
import { getSchema } from 'graphql-load';
import { AUTH_TOKEN_KEY } from '../constants';
import defaultSchemaDirectives from './directives';
import { getUserForContext } from './core/users';

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
      userFields: {
        _id: 1,
        roles: 1,
        username: 1,
        emails: 1,
      },
    },
    meteorApolloConfig
  );

  const { typeDefs, resolvers } = getSchema();

  const initialApolloConfig = Object.assign({}, apolloConfig);
  apolloConfig = {
    introspection: Meteor.isDevelopment,
    debug: Meteor.isDevelopment,
    path: '/graphql',
    formatError: e => {
      console.error(e);

      return {
        message: e.message,
        locations: e.locations,
        path: e.path,
      };
    },
    ...initialApolloConfig,
    typeDefs,
    resolvers,
    schemaDirectives: {
      ...defaultSchemaDirectives,
      ...(initialApolloConfig.schemaDirectives
        ? initialApolloConfig.schemaDirectives
        : []),
    },
    context: getContextCreator(meteorApolloConfig, initialApolloConfig.context),
    subscriptions: getSubscriptionConfig(meteorApolloConfig),
  };

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

  return {
    server,
  };
}

function getContextCreator(meteorApolloConfig, defaultContextResolver) {
  return async function getContext({ req, connection }) {
    const defaultContext = defaultContextResolver
      ? await defaultContextResolver({ req, connection })
      : {};

    Object.assign(defaultContext, { db });

    if (connection) {
      return {
        ...defaultContext,
        ...connection.context,
      };
    } else {
      let userContext = {};
      if (Package['accounts-base']) {
        const loginToken =
          req.headers['meteor-login-token'] || req.cookies['meteor-login-token'];
        userContext = await getUserForContext(loginToken, meteorApolloConfig.userFields);
      }

      return {
        ...defaultContext,
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
            meteorApolloConfig.userFields
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
