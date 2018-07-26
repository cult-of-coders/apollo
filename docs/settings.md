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
initialize({
  engine: {
    apiKey: 'XXX',
  },
});
```

## `ApolloConstructorOptions`

https://www.apollographql.com/docs/apollo-server/api/apollo-server.html#constructor-options-lt-ApolloServer-gt

Do not override `schema` and `context`, use `graphql-load` and `MeteorApolloOptions` for that.

## `MeteorApolloOptions`

```js
initialize({}, {
  // Context that is going to be passed to resolvers
  // By default we inject { db } from 'meteor/cultofcoders:grapher' package
  // If you override this to include other context information, make sure to include that as well
  context: {
    db // Access to database context via Grapher
  },

  // This is just an example, you have cors built in ApolloOptions
  // You can also add other connect middlewares to '/graphql' endpoint
  middlewares: [],

  // GUI, because we're using an express middleware to connect with our WebApp, gui configuration is done at that level
  // So basically the `gui` config from `ApolloConstructorOptions` will be ignored
  gui: Meteor.isDevelopment

  // Load custom schema directives that you want to use
  schemaDirectives: []

  // Because we support authentication by default
  // We inject { user, userId } into the context
  // These fields represent what fields to retrieve from the logged in user on every request
  // You can use `undefined` if you want all fields
  userDefaultFields: {
    _id: 1,
    username: 1,
    emails: 1,
    roles: 1,
  },
});
```

---

### [Table of Contents](index.md)
