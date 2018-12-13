# Server Side Rendering

This allows you to [server-render](https://docs.meteor.com/packages/server-render.html) your apps, works with context and account system as you expect it would.

It uses `StaticRouter` from `react-router` so make sure your `App` entry point does not initialise a router.

```js
// This code must be executed server side
import React from 'react';
import { StaticRouter } from 'react-router';

import { getRenderer } from 'meteor/cultofcoders:apollo';
import { onPageLoad } from 'meteor/server-render';

import { server } from './apollo';
import App from '../../ui/main/index';

// This function provides you with the function that handles Server Side Rendering for you
const render = getRenderer({
  app: sink => (
    <StaticRouter location={sink.request.url} context={{}}>
      <App />
    </StaticRouter>
  ), // Main entry point function
  server, // This is returned by initialize() function
  root: 'react-root', // The id of the element of rendering,
  handler: async sink => {}, // Async function that allows you to perform additional operations
});

// hanlde SSR
onPageLoad(render);
```

Your `apollo.js` may look something like this (this should be executed after you load() your schema)

```js
import { initialize } from 'meteor/cultofcoders:apollo';
const { server } = initialize();

export { server };
```

And don't forget that as a client, you'll have to run `hydrate` rather than `render`, something along these lines:

```js
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import App from '../../ui/main';
import apolloClient from './apollo';
import { BrowserRouter } from 'react-router-dom';

const ApolloApp = () => (
  <ApolloProvider client={apolloClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
);

ReactDOM.hydrate(<ApolloApp />, document.getElementById('react-root'));
```

### Authentication

You just need to set the cookie properly when the user is logging in. You need to run the following client-side.

The reason we do this, is because when we do Server-Side Rendering we get the authentication token through cookies.

```js
import { onTokenChange } from 'meteor-apollo-accounts';
import Cookies from 'js-cookie';

onTokenChange(({ token }) => {
  Cookies.set('meteor-login-token', token);
});
```

### Helmet Integration

```js
import { Helmet } from 'react-helmet';

const render = getRenderer({
  handler: async sink => {
    const helmet = Helmet.renderStatic();
    sink.appendToHead(helmet.meta.toString());
    sink.appendToHead(helmet.title.toString());
  },
});
```

---

### [Table of Contents](index.md)
