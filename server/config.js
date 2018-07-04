let Config = {
  CONTEXT: {},
  DISABLE_SUBSCRIPTIONS: false,
  DISABLE_GRAPHIQL: !Meteor.isDevelopment,
  ENGINE_API_KEY: null,
  ENGINE_PORT: 4000,
  USER_DEFAULT_FIELDS: {
    _id: 1,
    username: 1,
    emails: 1,
    roles: 1,
  },
  GRAPHQL_VALIDATION_RULES: [],
  GRAPHQL_SCHEMA_DIRECTIVES: {},
  EXPRESS_MIDDLEWARES: [],
  MOCKING: null,
  LOADER: null,
};

export default Config;
