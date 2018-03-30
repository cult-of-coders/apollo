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

We recommend this package so you can store your types inside `.gql` files so you can benefit of reactivity:

```bash
meteor add swydo:graphql
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

## Documentation

### Table of Contents

* [Simple Usage](docs/sample.md)
* [Database](docs/db.md)
* [Client](docs/client.md)
* [Scalars](docs/scalars.md)
* [Live Queries](docs/live_queries.md)
* [Accounts](docs/accounts.md)
* [Settings](docs/settings.md)
* [DDP](docs/ddp.md)
* [Visualising](docs/visualising.md)

## Premium Support

Looking to start or develop your new project with **GraphQL**? Reach out to us now, we can help you along every step: contact@cultofcoders.com. We specialise in building high availability GraphQL APIs and with the help with our awesome frontend developers we can easily consume any GraphQL API.
