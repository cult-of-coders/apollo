# Meteor Accounts

In Apollo your resolver receives `root`, `args` and `context`. Inside `context` we store the current `userId` and `user`:

The data we fetch for user can be customised via config:

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
import { Config } from 'meteor/cultofcoders:apollo';

Config.USER_DEFAULT_FIELDS: {
  _id: 1,
  username: 1,
  emails: 1,
  roles: 1,
},
```

`userId` works with your client and with `/graphiql` because the `Meteor.loginToken` is stored in `localStorage` and it's on the same domain, making very easy for you to test your queries and mutations.

Adding accounts to your GraphQL Schema:

```
meteor add accounts-password
meteor npm i -S bcrypt
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

To use them nicely inside your client:

```
meteor npm i -S bcrypt meteor-apollo-accounts
```

Read here: https://github.com/orionsoft/meteor-apollo-accounts#methods

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
