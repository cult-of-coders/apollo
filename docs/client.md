# Client

Let's play with Apollo, but outside GraphiQL

## React

```js
// in client/main.html
<body>
  <div id="app" />
</body>
```

```js
// in client/main.js
import { render } from 'react-dom';
import React from 'react';
import { ApolloProvider } from 'react-apollo';

import { Meteor } from 'meteor/meteor';
import { client } from 'meteor/cultofcoders:apollo';

import App from 'YOUR_APP';

Meteor.startup(() => {
  render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>,
    document.getElementById('app')
  );
});
```
