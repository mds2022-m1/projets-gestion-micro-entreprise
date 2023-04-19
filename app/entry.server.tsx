import type { EntryContext } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import { renderToString } from 'react-dom/server';
import {
  ApolloClient, ApolloProvider, createHttpLink, InMemoryCache,
} from '@apollo/client';
import { getDataFromTree } from '@apollo/client/react/ssr';

// eslint-disable-next-line import/no-default-export
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const client = new ApolloClient({
    ssrMode: true,
    cache: new InMemoryCache(),
    link: createHttpLink({
      uri: 'https://steady-goat-51.hasura.app/v1/graphql', // from Apollo's Voyage tutorial series (https://www.apollographql.com/tutorials/voyage-part1/)
      headers: {
        'x-hasura-admin-secret': 'GprSN11JKh93b6VDIKPIqofgIcRIFO0uFWvc9tUqizC4caLI9k5HVR2delX6wh9V',
      },
    }),
  });

  const App = (
    <ApolloProvider client={client}>
      <RemixServer context={remixContext} url={request.url} />
    </ApolloProvider>
  );

  return getDataFromTree(App).then(() => {
    // Extract the entirety of the Apollo Client cache's current state
    const initialState = client.extract();

    const markup = renderToString(
      <>
        {App}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__APOLLO_STATE__=${JSON.stringify(
              initialState,
            ).replace(/</g, '\\u003c')}`, // The replace call escapes the < character to prevent cross-site scripting attacks that are possible via the presence of </script> in a string literal
          }}
        />
      </>,
    );

    responseHeaders.set('Content-Type', 'text/html');

    return new Response(`<!DOCTYPE html>${markup}`, {
      status: responseStatusCode,
      headers: responseHeaders,
    });
  });

  // const markup = renderToString(App);
  //
  // responseHeaders.set('Content-Type', 'text/html');
  //
  // return new Response(`<!DOCTYPE html>${markup}`, {
  //   headers: responseHeaders,
  //   status: responseStatusCode,
  // });
}
