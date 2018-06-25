# Settings

When initializing, we accept as an argument a configuration object:

```js
{
  // By default we open the websocket that supports authentication
  // You can only expose an HTTP Server and that's it
  // If you are using the client from this package, you have to have the same config on the client-side as well
  DISABLE_SUBSCRIPTIONS: false,

  // You can disable GraphiQL
  // By default it's only enabled in development mode
  DISABLE_GRAPHIQL: !Meteor.isDevelopment,

  // Context that is going to be passed to resolvers
  CONTEXT: {
    db // Access to database context via Grapher
  },

  // If engine key is present it will automatically instantiate it for you
  ENGINE_API_KEY: null,
  // Should be the same port as your Meteor port or `process.env.PORT`
  ENGINE_PORT: 3000,

  // Here you can add certain validation rules to the GraphQL query
  // If, for example, you want to disable introspection on production
  // https://github.com/helfer/graphql-disable-introspection
  GRAPHQL_VALIDATION_RULES: [],

  // Specify the directives we want to use
  GRAPHQL_SCHEMA_DIRECTIVES: {},

  // Express middlewares, for example you may want to use 'cors'
  EXPRESS_MIDDLEWARES: [],

  // Because we support authentication by default
  // We inject { user, userId } into the context
  // These fields represent what fields to retrieve from the logged in user on every request
  // You can use `undefined` if you want all fields
  USER_DEFAULT_FIELDS: {
    _id: 1,
    username: 1,
    emails: 1,
    roles: 1,
  },

  // OPTIONS TO ADD ADDITIONAL MOCKING
  // By default this is null
  // Read more: https://www.apollographql.com/docs/graphql-tools/mocking.html
  MOCKING: {
    mocks: {},
    preserveResolvers: false,
  }
}
```

---

### [Table of Contents](index.md)
