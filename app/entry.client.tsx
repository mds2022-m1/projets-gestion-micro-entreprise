import { RemixBrowser } from '@remix-run/react';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { hydrateRoot } from 'react-dom/client';

function Client() {
  const client = new ApolloClient({
    // eslint-disable-next-line no-underscore-dangle
    cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
    uri: 'https://steady-goat-51.hasura.app/v1/graphql', // the same uri in our entry.server file
    headers: {
      'x-hasura-admin-secret': 'GprSN11JKh93b6VDIKPIqofgIcRIFO0uFWvc9tUqizC4caLI9k5HVR2delX6wh9V',
    },
  });

  return (
    <ApolloProvider client={client}>
      <RemixBrowser />
    </ApolloProvider>
  );
}

// function hydrate() {
//   startTransition(() => {
//     hydrateRoot(
//       document,
//       <StrictMode>
//         <RemixBrowser />
//       </StrictMode>,
//     );
//   });
// }

hydrateRoot(document, <Client />);

// if (window.requestIdleCallback) {
//   window.requestIdleCallback(hydrate);
// } else {
//   // Safari doesn't support requestIdleCallback
//   // https://caniuse.com/requestidlecallback
//   window.setTimeout(hydrate, 1);
// }
