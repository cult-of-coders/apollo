# Client

This is a quick recipe to get started with Apollo queries and React.

## React

Let's get our dependencies setup:

```js
meteor npm i -S react react-apollo react-dom prop-types graphql-tag
```

```js
// in client/main.html
<body>
  <div id="app" />
</body>
```

```js
// in client/main.js
import React from 'react';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';

import { Meteor } from 'meteor/meteor';
import { initialize } from 'meteor/cultofcoders:apollo';

const { client } = initialize();

Meteor.startup(() => {
  render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('app')
  );
});

const QUERY = gql`
  query {
    sayHello
  }
`;

const App = () => {
  <Query query={QUERY}>
    {(data, loading, error) => {
      return data;
    }}
  </Query>;
};
```

## Settings

Initialize accepts as an argument a configuration object:

```js
initialize({
  // Allow custom URI, rather than Meteor.absoluteUrl()
  uri: 'http://endpoint:5000/graphql',
  
  // Whether or not to try to connect to websockets, it connects by default
  disableWebsockets: false, 
});
```

- [Read more about React Apollo](https://www.apollographql.com/docs/react/)

---

### [Table of Contents](index.md)
