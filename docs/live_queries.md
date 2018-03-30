# Live Data

This package comes already with the [apollo-live-server](https://www.npmjs.com/package/apollo-live-server) npm package already set-up, but for client you will also need: [apollo-live-client](https://www.npmjs.com/package/apollo-live-client)

These 2 packages work hand-in-hand with the live queries from Meteor, a seemless super easy to plug-in integration.

Alongside [`redis-oplog`](https://github.com/cult-of-coders/redis-oplog) you can have large scale reactivity at low costs.

## How it works

Every subscription in apollo-live-server emits a `ReactiveEvent`, which is composed of:

```js
{
  type, // the typename of the object
  event, // added, changed, removed
  _id, // guess!
  doc, // full doc for added, changeset for changed, null for removed
}
```

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
Meteor.users.setTypename('User');

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
        }); // asyncIterator accepts: filters, options
      }
    }
  }
}
```

## Simulate reactivity

```js
// Meteor.users acts as any other Mongo.Collection you may have

// Simulate some reactivity ...
Meteor.setInterval(function() {
  const userId = Accounts.createUser({
    username: 'Apollo is Live!',
  });

  Meteor.setTimeout(function() {
    Meteor.users.remove({ _id: userId });
  }, 500);
}, 2000);
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
