# Morpher

This comes built in with cultofcoders:apollo package!

## Install

```
meteor npm i -S apollo-morpher
```

### Server Usage

```js
// api/server
import { expose } from 'meteor/cultofcoders:apollo';

expose({
  users: {
    type: 'User'
    collection: () => collection,
    update: (ctx, {selector, modifier, modifiedFields, modifiedTopLevelFields}) => true,
    insert: (ctx, {document}) => true,
    remove: (ctx, {selector}) => true,
    find(ctx, params) {
      // params is an object
      // by default filters, options are always empty objects, if they were not passed
      // if you pass other params filters and options will still be empty objects

      // You have two options here:
      // 1. Modify params.filters and params.options and don't return anything
      params.filters.userId = ctx.userId

      // 2. Modify filters options based on other parameters sent out
      if (params.accepted) {
        params.filters.accepted = true;
      }

      // 3. Return astToQueryOptions from Grapher for custom query support
      // https://github.com/cult-of-coders/grapher/blob/master/docs/graphql.md
      return {
        $filters: params.filters,
        $options: params.options
      }
  }
})
```

### Client Usage

```js
// Then on the client
import db, { setClient } from 'apollo-morpher';

// Set your Apollo client
setClient(apolloClient);

// Built-in mutations
db.users.insert(document).then(({ _id }) => {});
db.users.update(selector, modifier).then(response => {});
db.users.remove(selector).then(response => {});

// Or define the in object style:
const fields = {
  firstName: 1,
  lastName: 1,
  lastInvoices: {
    total: 1,
  },
};

// Or you could also define the fields in GraphQL style `firstName`

db.users
  .find(fields, {
    filters: {},
    options: {},
  })
  .then(result => {});

// find equivallent .findOne()
db.users.findOne(fields, {
  filters: { _id: 'XXX' },
});
```

---

### [Table of Contents](index.md)
