# Sample Usage

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
Keep in mind, you can separate queries anyway you want, and `load()` them independently, the `load` function smartly merges types and resolvers and works with arrays and GraphQL modules as well.

[Read more about `graphql-load`](https://www.npmjs.com/package/graphql-load?activeTab=readme)
