export default {
  CONTEXT: {},
  DISABLE_SUBSCRIPTIONS: false,
  DISABLE_GRAPHIQL: !Meteor.isDevelopment,
  ENGINE_API_KEY: null,
  ENGINE_PORT: 4000,
  USER_DEFAULT_FIELDS: {
    _id: 1,
    username: 1,
    emails: 1,
    profile: 1,
  },
};
