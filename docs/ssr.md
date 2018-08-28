# Server Side Rendering

This allows you to server-render your apps, works with context and account system as you expect it would.

It uses `StaticRouter` from `react-router` so make sure your `App` entry point does not initialise a router.

```js
import React from 'react';

import { getRenderer } from 'meteor/cultofcoders:apollo';
import { onPageLoad } from 'meteor/server-render';

import { server } from './apollo';
import App from '../../ui/main/index';

// This function provides you with the function that handles Server Side Rendering for you
const render = getRenderer({
  app: <App />, // Main entry point
  server, // This is returned by initialize() function
  root: 'react-root', // The id of the element of rendering,
  handler, // Async function that allows you to perform additional operations
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
