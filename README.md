# Meteor Apollo

A simple wrapper to easily add Apollo to your app, which contains:

* Apollo Live features (Reactive Queries Support)
* Date and JSON scalars
* HTTP and Websockets Authentication Built-in
* GraphiQL Support & Authentication
* Ability to easy add Meteor Accounts Support

## Install

First, let's get up and running with all the npm dependencies:

```bash
meteor npm i -S graphql graphql-load subscriptions-transport-ws apollo-live-server apollo-live-client apollo-client apollo-cache-inmemory apollo-link apollo-link-http apollo-link-ws express apollo-server-express uuid graphql-subscriptions body-parser graphql-tools graphql-type-json
```

Phiew that was a lot! Any space left on your device? Now let's add our package:

```bash
meteor add cultofcoders:apollo
```

Now, if you start your Meteor app it will complain because you don't have any Query set up yet, just set up an easy one:

```js
// file: server/index.js
import { load } from 'graphql-load';

load({
  typeDefs: `
    type Query {
      sayHello: String
    }
  `,
  resolvers: {
    Query: {
      sayHello: () => 'Hello world!',
    },
  },
});
```

Now get on your browser and go to: http://localhost:3000/graphiql and give it a query for testing:

```js
query {
  sayHello
}
```

## GraphQL Files

It would be quite nice if we could write our types inside `.gql` or `.graphql` files right, so we can benefit of some nice syntax highlighting:

```bash
meteor add swydo:graphql
```

If you don't want, just create `.js` files that export a string.

## A more complex sample

```js
# file: server/User.gql
type User {
  _id: ID!
  firstname: String
  lastname: String
  fullname: String
}

type Query {
  users: [User]
}
```

```js
// file: server/User.resolver.js
export default {
  User: {
    fullname(user) {
      return user.firstname + ' ' + user.lastname;
    },
  },
  Query: {
    users() {
      return [
        {
          firstname: 'Theodor',
          lastname: 'Diaconu',
        },
        {
          firstname: 'Claudiu',
          lastname: 'Roman',
        },
      ];
    },
  },
};
```

```js
// file: server/index.js
import { load } from 'graphql-load';
import UserType from './User';
import UserResolver from './User.resolver';

load({
  typeDefs: [UserType],
  resolvers: [UserResolver],
});
```

Now query in your GraphiQL:

```js
query {
  users {
    fullname
  }
}
```

Ofcourse, when you're dealing with a big project, your data structure is surely going to change, this is just for demo purposes.
Keep in mind, you can separate queries anyway you want, and `load()` them independently, the `load` function smartly merges types and resolvers and works with arrays and GraphQL modules as well [Read more about `graphql-load`](https://www.npmjs.com/package/graphql-load?activeTab=readme)

## Live Data

This package comes already with the [apollo-live-server](https://www.npmjs.com/package/apollo-live-server) npm package already set-up, but for client you will also need: [apollo-live-client](https://www.npmjs.com/package/apollo-live-client)

These 2 packages work hand-in-hand with the live queries from Meteor, a seemless super easy to plug-in integration.

Alongside [`redis-oplog`](https://github.com/cult-of-coders/redis-oplog) you can have large scale reactivity at low costs.

Quick show-case:

```js
# file: server/User.gql
# ...
type Subscription {
  users: ReactiveEvent
}
```

```js
// file User.resolver.js

// when dealing with subscriptions the typename needs to be set at collection level:
// Meteor.users acts as any other Mongo.Collection you may have
Meteor.users.setTypename('User');

// Simulate some reactivity ...
Meteor.setInterval(function () {
  const userId = Accounts.createUser({
    username: 'Apollo is Live!',
  })

  Meteor.setTimeout(function () {
    Meteor.users.remove({_id: userId})
  }, 500)
}, 2000);

// our Subscription resolver
export default {
  ...
  Subscription: {
    users: {
      resolve: payload => payload,
      subscribe() {
        return Meteor.users.asyncIterator({}, {
          fields: {
            'username': 1,
          }
        }); // filters, options
      }
    }
  }
}
```

You can now test your query inside GraphiQL:

```js
subscription {
  users {
    _id
    type
    event
    doc
  }
}
```

Read more about [apollo-live-client](https://www.npmjs.com/package/apollo-live-client) to integrate it in your React app very easily and intuitively.

## userId in context

In Apollo your resolver receives `root`, `args` and `context`. Inside `context` we store the current `userId`:

```js
// file: server/
export default {
  Query: {
    invoices(root, args, context) {
      return Invoices.find({
        userId: context.userId,
      }).fetch();
    },
  },
};
```

`userId` works with your client and with `/graphiql` because the `Meteor.loginToken` is stored in `localStorage` and it's on the same domain, making very easy for you
to test your queries and mutations.

## Scalars

This package comes with 2 scalars `Date` (because it's very common) and `JSON` (because we need it for easy reactivity inside `apollo-live-server`.

You can use it in your types:

```js
type User {
  createdAt: Date!
  dynamicInformation: JSON
}
```

## Accounts

Adding accounts to your GraphQL Schema:

```
meteor add accounts-password
meteor npm i -S bcrypt meteor-apollo-accounts
meteor add cultofcoders:apollo-accounts
```

```js
// file: /server/accounts.js
import { initAccounts } from 'meteor/cultofcoders:apollo-accounts';
import { load } from 'graphql-load';

// Load all accounts related resolvers and type definitions into graphql-loader
const AccountsModule = initAccounts({
  loginWithFacebook: false,
  loginWithGoogle: false,
  loginWithLinkedIn: false,
  loginWithPassword: true,
}); // returns { typeDefs, resolvers }

load(AccountsModule); // Make sure you have User type defined as it works directly with it
```

Now you can already start creating users, logging in, open up your GraphiQL and look in the Mutation documentations.

If you want to test authentication live and you don't yet have a client-side setup. Just create a user:

```js
mutation {
  createUser(
    username: "cultofcoders",
    plainPassword: "12345",
  ) {
    token
  }
}
```

Store it in localStorage, in your browser console:

```js
localStorage.setItem('Meteor.loginToken', token); // the one you received from the query result
```

Create a quick `me` query:

```js
const typeDefs = `
  type Query {
    me: User
  }
`;

const resolvers = {
  Query: {
    me(_, args, context) {
      return Meteor.users.findOne(context.userId);
    },
  },
};

export { typeDefs, resolvers };
```

And try it out:

```js
query {
  me {
    _id
  }
}
```

And also register the proper clear-outs for live subscription authentication:

```js
// file: client/accounts.js
import { onTokenChange } from 'meteor-apollo-accounts';
import { wsLink, client } from 'meteor/cultofcoders:apollo';

onTokenChange(function() {
  client.resetStore();
  wsLink.subscriptionClient.close(true); // it will restart the websocket connection
});
```

If you are using SSR and want to benefit from authentication for server-renders, check out this comment https://github.com/apollographql/meteor-integration/issues/116#issuecomment-370923220

## React Client

```js
// in client-side code
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import React from 'react';
import { ApolloProvider } from 'react-apollo';
import App from '/imports/ui/App';
import { client } from 'meteor/cultofcoders:apollo';

Meteor.startup(() => {
  render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('app')
  );
});
```

## DDP Connection

Currently the problem is that your Meteor client still tries to connect to DDP, even if you disable websockets it tries to fallback to polling. You cannot have both DDP and GraphQL Websockets at the same time.

You have several options:

1.  Start your meteor app with DISABLE_WEBSOCKETS=true
2.  Start a minimal meteor app that only uses npm packages and copy what is inside client/index.js and adapt it properly
3.  Think about shifting your frontend to a separate Meteor application

## Settings

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
  CONTEXT: {},

  // If engine key is present it will automatically instantiate it for you
  ENGINE_API_KEY: null,
  // Should be the same port as your Meteor port or `process.env.PORT`
  ENGINE_PORT: 3000,

  // Here you can add certain validation rules to the GraphQL query
  // If, for example, you want to disable introspection on production
  // https://github.com/helfer/graphql-disable-introspection
  GRAPHQL_VALIDATION_RULES: [],

  // Because we support authentication by default
  // We inject { user, userId } into the context
  // These fields represent what fields to retrieve from the logged in user on every request
  // You can use `undefined` if you want all fields
  USER_DEFAULT_FIELDS: {
    _id: 1,
    username: 1,
    emails: 1,
    profile: 1,
    roles: 1,
  },
}
```

Change any value you like by doing:

```js
// in some startup file on the server
import { Config } from 'meteor/cultofcoders:apollo';

Object.assign(Config, {
  ENGINE_API_KEY: Meteor.settings.ENGINE_API_KEY,
});
```

## Premium Support

Looking to start or develop your new project with **GraphQL**? Reach out to us now, we can help you along every step: contact@cultofcoders.com. We specialise in building high availability GraphQL APIs and with the help with our awesome frontend developers we can easily consume any GraphQL API.
