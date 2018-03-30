## Scalars

Read more about scalars:
https://www.apollographql.com/docs/graphql-tools/scalars.html

This package comes with 2 scalars `Date` (because it's very common) and `JSON` (because we need it for easy reactivity inside [`apollo-live-server`](https://github.com/cult-of-coders/apollo-live-server).

You can use it in your types:

```typescript
type User {
  createdAt: Date!
  dynamicInformation: JSON
}
```

The `Date` scalar parses `.toISOString()`, so, when you want to send a date from the client-side, make sure to apply that method to the date.
