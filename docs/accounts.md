# Meteor Accounts

In Apollo your resolver receives `root`, `args` and `context`. Inside `context` we store the current `userId` and `user`:

The data we fetch for user can be customized via config:

```js
// file: server/
export default {
  Query: {
    invoices(root, args, { user, userId }) {
      return Invoices.find({
        userId,
      }).fetch();
    },
  },
};
```

```js
import { initialize } from 'meteor/cultofcoders:apollo';

initialize({}, {
  // You can configure your default fields to fetch on GraphQL request
  // This works with Subscription onConnect()
  userFields: {
    _id: 1,
    roles: 1,
  }
}),
```

Adding accounts to your GraphQL Schema:

```
meteor add accounts-password
meteor npm i -S bcrypt meteor-apollo-accounts
meteor add cultofcoders:apollo-accounts
```

Make sure you have a type called `User` already defined and loaded, otherwise it will fail.

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

You can register an account like this:

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

Test the fact that you can query the logged in user:

```js
import { load } from 'meteor/cultofcoders:apollo';

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

load({
  typeDefs,
  resolvers,
});
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
// file: client/main.js
import { initialize } from 'meteor/cultofcoders:apollo';
import { onTokenChange } from 'meteor-apollo-accounts';

// Preferably you instantiate it in a different place
const { client, wsLink } = initialize();

onTokenChange(function() {
  client.resetStore();
  wsLink.subscriptionClient.close(true); // it will restart the websocket connection
});
```

To use them nicely inside your client:

```
meteor npm i -S bcrypt meteor-apollo-accounts
```

Read here: https://github.com/cult-of-coders/meteor-apollo-accounts#methods

If you are using SSR and want to benefit from authentication for server-renders, check out this comment https://github.com/apollographql/meteor-integration/issues/116#issuecomment-370923220

If you wish to customize the mutations or resolvers exposed you can load different ones, after you loaded the ones from the package:

```js
load({
  typeDefs: `
    createUser(): String
  `,
  resolvers: {
    Mutation: {
      createUser() { ... }
    }
  }
})
```

---

### [Table of Contents](index.md)
