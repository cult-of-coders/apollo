import { renderToString } from 'react-dom/server';
import { getDataFromTree, ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { SchemaLink } from 'apollo-link-schema';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { StaticRouter } from 'react-router';
import React from 'react';

/**
 * @param {React.Element} options.app
 * @param {String} options.root The id of element we're gonna render in
 * @param {ApolloServer} options.server The id of element we're gonna render in
 * @param {Function} options.handler Perform additional operations
 */
export default function getRenderer(options) {
  const render = async sink => {
    const schemaLink = new SchemaLink({
      schema: options.server.schema,
      context: await options.server.context({ req: sink.request }),
    });

    const client = new ApolloClient({
      ssrMode: true,
      link: schemaLink,
      cache: new InMemoryCache(),
    });

    const context = {};
    const WrappedApp = (
      <ApolloProvider client={client}>
        <StaticRouter location={sink.request.url} context={context}>
          {options.app}
        </StaticRouter>
      </ApolloProvider>
    );

    options.handler && (await options.handler(sink));

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
