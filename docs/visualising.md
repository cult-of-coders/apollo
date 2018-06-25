# Visualising

Various ways to visualise your GraphQL Schema with ease:

```
graphqlviz https://localhost:3000/graphql | dot -Tpng -o graph.png
```

## Graphqlviz

Easily export your API schema into a png file:
https://github.com/sheerun/graphqlviz

## Voyager

Nicely explore the schema of your GraphQL App, using an amazing app: https://github.com/APIs-guru/graphql-voyager

Create a file `private/voyager.html` in your Meteor app:

```html
<!DOCTYPE html>
<html>

<head>
  <script src="https://cdn.jsdelivr.net/react/15.4.2/react.min.js"></script>
  <script src="https://cdn.jsdelivr.net/react/15.4.2/react-dom.min.js"></script>

  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/graphql-voyager/dist/voyager.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/fetch/2.0.3/fetch.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/graphql-voyager/dist/voyager.min.js"></script>
</head>

<body>
  <div id="voyager">Loading...</div>
  <script>
    const GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';

    function introspectionProvider(query) {
      return fetch(GRAPHQL_ENDPOINT, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query }),
      }).then(response => response.json());
    }
    // Render <Voyager />
    GraphQLVoyager.init(document.getElementById('voyager'), {
      introspection: introspectionProvider
    })
  </script>
</body>

</html>
```

For this you may also need to enable CORS (Cross-origin resource sharing):

```
meteor npm i -S cors
```

```js
import { Config } from 'meteor/cultofcoders:apollo';

// Maybe you want thsi only in development
Meteor.isDevelopment && Config.EXPRESS_MIDDLEWARES.push(cors());
```

Now open the html file directly in your browser, and engage in the nice schema view.

---

### [Table of Contents](index.md)
