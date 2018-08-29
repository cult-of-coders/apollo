# Meteor Apollo

## License: MIT

[![Build Status](https://api.travis-ci.org/cult-of-coders/apollo.svg?branch=master)](https://travis-ci.org/cult-of-coders/apollo)

## Features

- Plug and Play Zero-Config GraphQL Server
- GraphQL Playground + Subscription Support
- MongoDB Relational Support - [Grapher](https://github.com/cult-of-coders/grapher)
- Scalable Reactive Queries - [RedisOplog](https://github.com/cult-of-coders/redis-oplog)
- HTTP & Subscription authentication support with Meteor Accounts
- Built-in convenience `Date` and `JSON` scalars

## Install

If you do not have Meteor up and running, [install it from here](https://www.meteor.com/install)

```bash
meteor create --bare graphql-baby
cd graphql-baby

# Now we install our npm dependencies for server
meteor npm i -S graphql graphql-load apollo-server-express uuid graphql-tools graphql-type-json apollo-live-server

# Dependencies for the client
meteor npm i -S react-apollo apollo-live-client apollo-client apollo-cache-inmemory apollo-link apollo-link-http apollo-link-ws apollo-morpher subscriptions-transport-ws apollo-upload-client

# Now we add the package
meteor add cultofcoders:apollo

# Optional but highly recommended (so you can import .gql/.graphql files)
meteor add swydo:graphql

# If you're looking into Server Side Rendering with React
meteor npm i -S react react-dom react-apollo react-router apollo-link-schema
```

Let's setup a basic query and initialize our GraphQL server:

```js
// file: server/main.js
import { initialize } from 'meteor/cultofcoders:apollo';
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

initialize();
```

Now you can safely run your project:

```
meteor run
```

Now get on your browser and go to: http://localhost:3000/graphql and give it a spin:

```js
query {
  sayHello
}
```

## [Documentation](docs/index.md)

[Click here to go to the documentation](docs/index.md)

## Useful packages

- [graphql-load](https://www.npmjs.com/package/graphql-load?activeTab=readme)

## Premium Support

Looking to start or develop your new project with **GraphQL**? Reach out to us now, we can help you along every step: contact@cultofcoders.com. We specialise in building high availability GraphQL APIs and with the help with our awesome frontend developers we can easily consume any GraphQL API.
