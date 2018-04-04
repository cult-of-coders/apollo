# Meteor Apollo

Features:

* Plug and Play Zero-Config GraphQL Server
* GraphiQL + Subscription Support
* Apollo Live Features (Reactive Scalable Queries)
* MongoDB Tailored
* Date and JSON scalars
* HTTP and Subscription built-in Authentication (+ GraphiQL Authentication Support)
* Meteor Accounts (Plug & Play)

## Install

If you do not Meteor up and running, [install it from here](https://www.meteor.com/install)

```bash
meteor create --bare graphql-baby
cd graphql-baby

# Now we install our npm dependencies
meteor npm i -S graphql graphql-load subscriptions-transport-ws apollo-live-server apollo-live-client apollo-client apollo-cache-inmemory apollo-link apollo-link-http apollo-link-ws express apollo-server-express uuid graphql-subscriptions body-parser graphql-tools graphql-type-json

# Now we add the package
meteor add cultofcoders:apollo

# Optional but highly recommended (so you can import .gql/.graphql files)
meteor add swydo:graphql
```

Let's setup a basic query and initialize our GraphQL server:

```js
// file: server/load.js
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

// file: server/index.js
import { initialize } from 'meteor/cultofcoders:apollo';
import './load.js';

initialize();
```

Now you can safely run your project:

```
meteor run
```

Now get on your browser and go to: http://localhost:3000/graphiql and give it a spin:

```js
query {
  sayHello
}
```

## [Documentation](docs/table-of-contents.md)

[Click here to go to the documentation](docs/table-of-contents.md)

### Useful packages

* [graphql-load](https://www.npmjs.com/package/graphql-load?activeTab=readme)
* [disable-introspection](https://github.com/helfer/graphql-disable-introspection)

## Premium Support

Looking to start or develop your new project with **GraphQL**? Reach out to us now, we can help you along every step: contact@cultofcoders.com. We specialise in building high availability GraphQL APIs and with the help with our awesome frontend developers we can easily consume any GraphQL API.
