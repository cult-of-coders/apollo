import { Meteor } from 'meteor/meteor';
import { db } from 'meteor/cultofcoders:grapher';
import { WebApp } from 'meteor/webapp';
import { ApolloServer } from 'apollo-server-express';
import { getSchema } from 'graphql-load';
import cookie from 'cookie';
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

  const schemaDirectives = {
    ...defaultSchemaDirectives,
    ...(initialApolloConfig.schemaDirectives ? initialApolloConfig.schemaDirectives : {}),
  };

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
    schemaDirectives,
    context: getContextCreator(meteorApolloConfig, initialApolloConfig),
    subscriptions: getSubscriptionConfig(meteorApolloConfig, initialApolloConfig),
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

function getContextCreator(meteorApolloConfig, initialApolloConfig) {
  const {
    context: defaultContextResolver,
    meteorAccounts,
  } = initialApolloConfig;

  return async function getContext({ req: request, connection }) {
    // This function is called whenever a normal graphql request is being made,
    // as well as when a client initiates a new subscription. However, when a
    // client subscribes, the request headers are not being send along. The
    // websocket only send those on the onConnect event. We store them on the
    // `connection.context` together with the parsed cookies, so we can
    // reconstruct a fake request object to be used by the context creator.
    const req = connection ? connection.context.req : request;

    const defaultContext = defaultContextResolver
      ? await defaultContextResolver({ req, connection })
      : {};

    let userContext = {};
    if (meteorAccounts !== false && Package['accounts-base']) {
      const loginToken =
        req.headers['meteor-login-token'] ||
        req.cookies['meteor-login-token'] ||
        req.connectionParams && req.connectionParams[AUTH_TOKEN_KEY];

      userContext = await getUserForContext(loginToken, meteorApolloConfig.userFields);
    }

    return {
      db,
      ...userContext,
      ...defaultContext,
    };
  };
}

function getSubscriptionConfig() {
  return {
    onConnect: async (connectionParams, webSocket, { request }) => {
      return new Promise(resolve => {
        const headers = request.headers;
        const cookies = cookie.parse(headers['cookie'] || '');

        return resolve({ req: { headers, cookies, connectionParams } });
      });
    },
  };
}
