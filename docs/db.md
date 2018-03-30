# Mongo

This package is tailored for Mongo database. If you're looking for a bare-bones API implementation, not coupled to mongo, you can look at: https://github.com/apollographql/meteor-integration

This package depends on [`cultofcoders:grapher`](https://github.com/cult-of-coders/grapher), a very awesome tool,
which allows you too query related MongoDB objects at serious speeds.

The difference is that we will never use the exposure mechanisms from Grapher which are used for Meteor's DDP (Methods & Publications),
but it's not a problem, we have many other nice things we can use.

The advantage is that you can start using your database and related links in just your types, for example:

```typescript
type Post @mongo(name: "posts")
{
  text: String!
  author: Author @link(field: "authorId")
}

type Author @mongo(name: "authors")
{
  name: String
  posts: [Post] @link(to: "author")
  groups: [Group] @link(field: "groupIds")
}

type Group @mongo(name: "groups") {
  name: String
  authors: [Author] @link(to: "groups")
}
```

Above we have the following relationships:

* Post has one author and it's stored in `authorId`
* Author has many posts
* Author belongs to many groups and it's stored in `groupIds`
* Groups have many authors

And the beautiful part is that for prototyping this is so fast, because we inject the db inside our context:

Read more about these directives here:
https://github.com/cult-of-coders/grapher-schema-directives

```js
export default {
  Query: {
    posts(_, args, ctx, ast) {
      // Performantly fetch the query using Grapher
      // You don't need to implement resolvers for your links, it's all done automatically

      return ctx.db.posts.astToQuery(ast).fetch();
      // but you can do whatever you want here since ctx.db.posts is a Mongo.Collection
      // https://docs.meteor.com/api/collections.html
    },
  },
  Mutation: {
    addPost(_, { title }, ctx) {
      ctx.db.posts.insert({
        title,
      });
    },
  },
  Subscription: {
    posts(_, args, ctx) {
      // You can also use astToBody from Grapher, to only follow the requested fields
      // But since that is a rare case, we won't cover it here so we keep it simple:
      // But note that reactivity only works at a single level.
      ctx.db.posts.find(
        {},
        {
          fields: { status: 1 },
        }
      );
    },
  },
};
```

Read more about Grapher's GraphQL bridge:
https://github.com/cult-of-coders/grapher/blob/master/docs/graphql.md
