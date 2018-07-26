## Scalars

Read more about scalars:
https://www.apollographql.com/docs/graphql-tools/scalars.html

This package comes with 2 scalars `Date` (because it's very common) and `JSON` (because we need it for easy reactivity inside [`apollo-live-server`](https://github.com/cult-of-coders/apollo-live-server) and for easily using it with [Morpher](./morpher.md)

You can use it in your types:

```typescript
type User {
  createdAt: Date!
  dynamicInformation: JSON
}
```

The `Date` scalar parses `.toISOString()`, so, when you want to send a date from the client-side, make sure to apply that method to the date.

---

Apollo Client doesn't support scalar Hydration (meaning you will get the timestamp of the date not the objecyou desire) If you are looking to transform your scalars on your client directly use [apollo-client-transformers](https://github.com/cult-of-coders/apollo-client-transformers):

```
meteor npm i -S apollo-client-transformers
```

```js
// on the client
import { createTransformerLink } from 'apollo-client-transform';

const transformerLink = createTransformerLink(transformers);

const { client } = initialize({
  getLink(link) {
    return transformerLink.concat(link);
  },
});
```

### [Table of Contents](index.md)
