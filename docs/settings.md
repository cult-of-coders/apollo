# Settings

```js
import { initialize } from 'meteor/cultofcoders:apollo';

initialize(ApolloConstructorOptions?, MeteorApolloOptions?);

// quickest way:
initialize();
```

## Quick Tip: [Engine](https://engine.apollographql.com/)

If you want to use engine GraphQL monitoring tool:

```js
initialize(
  {},
  {
    engine: {
      apiKey: "XXX"
    }
  }
);
```

## `ApolloConstructorOptions`

https://www.apollographql.com/docs/apollo-server/api/apollo-server.html#constructor-options-lt-ApolloServer-gt

Do not override `schema`.

## `MeteorApolloOptions`

```js
initialize({
  // Here you can provide the apollo options provided here:
  // https://www.apollographql.com/docs/apollo-server/api/apollo-server.html#constructor-options-lt-ApolloServer-gt

  // You must not override schema

  // Allow custom URI, rather than Meteor.absoluteUrl()
  uri: 'http://endpoint:5000/graphql',

  meteorAccounts: true, // You can disable reading the users via Meteor accounts
  // You can add `schemaDirectives` and `context` without worrying about context update
  schemaDirectives: {
    MyCustomDirective,
  },
  // You get access to db, user, userId inside the resolver.
  context: async ({ db, user, userId }) => ({
    services
  })
}, {
  // This is just an example, you have cors built in ApolloOptions
  // You can also add other connect middlewares to '/graphql' endpoint
  middlewares: [],

  // GUI, because we're using an express middleware to connect with our WebApp, gui configuration is done at that level
  // So basically the `gui` config from `ApolloConstructorOptions` will be ignored
  gui: Meteor.isDevelopment

  // Because we support authentication by default
  // We inject { user, userId } into the context
  // These fields represent what fields to retrieve from the logged in user on every request
  // You can use `undefined` if you want all fields
  userFields: {
    _id: 1,
    username: 1,
    emails: 1,
    roles: 1,
  },
});
```

---

### [Table of Contents](index.md)
