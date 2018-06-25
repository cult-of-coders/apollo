# Grapher

You can use Grapher to define your links in your types, for rapid prototyping:

- [Read more about Grapher](https://github.com/cult-of-coders/grapher)
- [Read more about Grapher Directives](https://github.com/cult-of-coders/grapher-schema-directives)
- [Read more about Grapher & GraphQL](https://github.com/cult-of-coders/grapher/blob/master/docs/graphql.md)

## Sample

```js
type Comment @mongo(name: "comments") {
  _id: ID!
  text: String
  userId: String!
  user: User @link(field: "userId")
  postId: String
  post: Post @link(field: "postId")
  createdAt: Date
}
```

## Query

With Grapher you don't have to care about resolvers, because it knows exactly
how to create your data, and does it very efficiently, speeds more than 200X in some cases:

```js
export default {
  Query: {
    comments(_, args, { db }) {
      return db.comments.astToQuery().fetch();
    },
  },
};
```

---

### [Table of Contents](index.md)
