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
meteor npm i -S graphql graphql-load subscriptions-transport-ws apollo-live-server apollo-live-client apollo-client apollo-cache-inmemory apollo-link apollo-link-http apollo-link-ws apollo-server-express subscriptions-transport-ws uuid graphql-subscriptions body-parser express graphql-tools graphql-type-json
```

Phiew that was a lot! Any space left on your device? Now let's add our package:

```bash
meteor add cultofcoders:apollo
```

Your Meteor app is now Apollo-enhanced, you don't have to do anything else, just setup your client:

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

We recommend but it's not mandatory, to have support for `.gql` files:

```bash
meteor add swydo:graphql
```

## Usage

In your server-side just modularise your schemas and resolvers and use the `graphql-load` npm package:

```js
import { load } from 'graphql-load';

load({
  typeDefs: `
    User: {
      _id: ID!
      lastName: String!
      firstName: String!
    }

    Query: {
      users: [User]
    }
  `,
  resolvers: {
    Query: {
      users() {
        return Meteor.users.find().fetch();
      },
    },
  },
});
```

Now access your `http://localhost:3000/graphiql` and enjoy query-ing.

Learn more about modularising: https://www.npmjs.com/package/graphql-load?activeTab=readme

## DDP Connection

Currently the problem is that your Meteor client still tries to connect to DDP, even if you disable websockets it tries to fallback to polling. You cannot have both DDP and GraphQL Websockets at the same time.

You have several options:

1.  Start your meteor app with DISABLE_WEBSOCKETS=true
2.  Start a minimal meteor app that only uses npm packages and copy what is inside client/index.js and adapt it properly
3.  Think about shifting your frontend part to `create-react-app`, and just copy what's inside this package's `client` folder

## Live Data

This package comes already with the [apollo-live-server](https://www.npmjs.com/package/apollo-live-server) npm package already set-up, but for client you will also need: [apollo-live-client](https://www.npmjs.com/package/apollo-live-client)

These 2 packages work hand-in-hand with the live queries from Meteor, a seemless super easy to plug-in integration.

Alongside [`redis-oplog`](https://github.com/cult-of-coders/redis-oplog) you can have large scale reactivity at low costs.

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
meteor add nicolaslopezj:apollo-accounts
meteor npm i -S graphql-loader
```

```js
import { initAccounts } from 'meteor/nicolaslopezj:apollo-accounts';
import { getSchema } from 'graphql-loader';
import { load } from 'graphql-load';

// Load all accounts related resolvers and type definitions into graphql-loader
initAccounts({
  loginWithFacebook: false,
  loginWithGoogle: false,
  loginWithLinkedIn: false,
  loginWithPassword: true,
});

load(getSchema());
```

And also register the proper clear-outs for live subscription authentication:

```js
import { onTokenChange } from 'meteor-apollo-accounts';
import { wsLink, client } from 'meteor/cultofcoders:apollo';

onTokenChange(function() {
  client.resetStore();
  wsLink.subscriptionClient.close(true);
});
```

## Premium Support

Looking to start or develop your new project with **GraphQL**? Reach out to us now, we can help you along every step: contact@cultofcoders.com. We specialise in building high availability GraphQL APIs and with the help with our awesome frontend developers we can easily consume any GraphQL API.
