import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';

/**
 * @param {() => React.Element} options.app
 * @param {String} options.root The id of element we're gonna render in
 * @param {ApolloServer} options.server The id of element we're gonna render in
 * @param {Function} options.handler Perform additional operations
 * @param {Function} options.getLink Perform additional operations
 */
export default function getRenderer(options) {
  // We weirdly do it here so the package doesn't force you to have these packages added.
  import React from 'react';
  import { renderToString } from 'react-dom/server';
  import { getDataFromTree, ApolloProvider } from 'react-apollo';
  import { SchemaLink } from 'apollo-link-schema';

  const render = async sink => {
    const link = new SchemaLink({
      schema: options.server.schema,
      context: await options.server.context({ req: sink.request }),
    });

    if (options.getLink) {
      link = options.getLink(link);
    }

    const client = new ApolloClient({
      ssrMode: true,
      link,
      cache: new InMemoryCache(),
    });

    const context = {};
    const WrappedApp = (
      <ApolloProvider client={client}>{options.app(sink)}</ApolloProvider>
    );

    options.handler && (await options.handler(sink, client));

    // load all data from local server;
    await getDataFromTree(WrappedApp);

    const body = renderToString(WrappedApp);
    sink.renderIntoElementById(options.root || 'react-root', body);

    const initialState = client.extract();
    sink.appendToBody(`
      <script>window.__APOLLO_STATE__=${JSON.stringify(initialState)};</script>
    `);
  };

  return render;
}
