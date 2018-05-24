# React-Native Client

Things mostly should just work out of the box for a react-native client. Make sure you install the following packages:

* apollo-cache-redux
* apollo-client
* apollo-link
* apollo-link-context
* apollo-link-error
* apollo-link-http
* apollo-link-ws
* apollo-live-client
* apollo-utilities
* core-js
* meteor-apollo-accounts
* react-apollo
* subscriptions-transport-ws

If you don't use redux, install apollo-cache-inmemory instead of apollo-cache-redux, or any other cache implementation.

There are, however, a few things to keep in mind:

* Authentication token is usually stored in AsyncStorage, and retrieval of the token is an asynchronous process.
* The authorization header needs to set up appropriately for both http links and websocket links.
* Some polyfills are needed

Since retrieval of the token is an asynchronous process, care must be taken to set it up appropriately for your http and websocket links. Let us first create a function to retrieve the token from AsyncStorage as a promise:

```js
// our login token cache
let loginToken;

// gets token from cache or from AsyncStorage
function getLoginToken() {

  return new Promise((resolve, reject) => { // eslint-disable-line no-undef
    if (loginToken) {
      console.log("resolving login token " + loginToken);
      resolve(loginToken);
    } else {
      AsyncStorage.getItem(constants.AUTH_TOKEN_LOCALSTORAGE).then((token) => {
        console.log("retrieved login token from AsyncStorage: " + token);
        loginToken = token;
        resolve(token);
      }).catch(() => {
        console.log("no login token found!");
        reject("");
      });
    }
  });

}
```

Notice that we use a cache to avoid unnecessary lookups into AsyncStorage. We now need to provide this authorization token both your http and websocket links.

## HTTP Link

We will use ```setContext()``` from [apollo-link-context](https://github.com/apollographql/apollo-link/tree/master/packages/apollo-link-context) to set the authorization header:

```js
// our http link
const httpLink = createHttpLink({
  uri: constants.GRAPHQL_ENDPOINT
});

const AUTH_TOKEN_KEY = "meteor-login-token";

// create a link to insert the authorization header for http(s)
const authorizationLink = setContext(operation => getLoginToken().then(token => { // eslint-disable-line no-unused-vars
  return {
    // set meteor token here
    headers: {
      [AUTH_TOKEN_KEY]: token || null
    }
  };
})
);

// create our query/mutation link which uses http(s)
const queryLink = ApolloLink.from([authorizationLink, httpLink]);
```

Now, every time the http link is used, it will query the latest login token. This will happen even if the login token changes.

## WebSocket Link

Things are slightly more complicated for websocket links which are required for subscriptions:

* First, [apollo-link-ws](https://github.com/apollographql/apollo-link/tree/master/packages/apollo-link-ws) uses [subscriptions-transport-ws](https://github.com/apollographql/subscriptions-transport-ws), the latest version of which (0.9.9 as of this writing) does not support an asynchronous call to set connection parameters headers with the authorization token.
* Second, the token is sent only once when the connection is established, so if/when the token changes, the connection needs to be reestablished.

For the first issue, we need to patch [subscriptions-transport-ws](https://github.com/apollographql/subscriptions-transport-ws). Here is the patch:

```diff
patch-package
--- a/node_modules/subscriptions-transport-ws/dist/client.js
+++ b/node_modules/subscriptions-transport-ws/dist/client.js
@@ -380,9 +380,11 @@ var SubscriptionClient = (function () {
             _this.clearMaxConnectTimeout();
             _this.closedByUser = false;
             _this.eventEmitter.emit(_this.reconnecting ? 'reconnecting' : 'connecting');
-            var payload = typeof _this.connectionParams === 'function' ? _this.connectionParams() : _this.connectionParams;
-            _this.sendMessage(undefined, message_types_1.default.GQL_CONNECTION_INIT, payload);
-            _this.flushUnsentMessagesQueue();
+            var promise = Promise.resolve(typeof _this.connectionParams === 'function' ? _this.connectionParams() : _this.connectionParams);
+            promise.then(payload => {
+              _this.sendMessage(undefined, message_types_1.default.GQL_CONNECTION_INIT, payload);
+              _this.flushUnsentMessagesQueue();
+            })
         };
         this.client.onclose = function () {
             if (!_this.closedByUser) {
```

You can use the excellent [patch-package](https://github.com/ds300/patch-package) to automatically apply this patch whenever you install node_modules with either "yarn" or "npm install".

Once the patch has been applied, you can set up the WebSocketLink to use an asynchronous function to set up the authorization header:

```js
// our websocket link for subscriptions
const wsLink = new WebSocketLink({
  uri: constants.GRAPHQL_SUBSCRIPTION_ENDPOINT,
  options: {
    reconnect: true,
    connectionParams: () => ( // a promise that resolves to return the loginToken
    new Promise((resolve, reject) => { // eslint-disable-line no-undef,no-unused-vars
      getLoginToken().then(token => {
        if (token) {
          console.log("wsLink loginToken = " + token);
          resolve({
            [constants.AUTH_TOKEN_KEY]: token
          });
        } else {
          resolve({
            [constants.AUTH_TOKEN_KEY]: ""
          });
        }
      });
    }))
  }
});
```

Now, the login token is resolved and sent to the server when the websocket connection is established.

However, we still need address the second issue where the authorization token is sent only once and not when the token changes, e.g. during logout/login. To handle this, we essentially need to bounce the websocket link:

```js
wsLink.subscriptionClient.close(false, false);
```

This needs to be done at an appropraiate place, such when your client receives a new login token. If you are using [meteor-apollo-accounts](https://github.com/cult-of-coders/meteor-apollo-accounts), then the loginToken change will happen in the ```setTokenStore()``` implementation:

```js
import { loginWithPassword, onTokenChange, setTokenStore } from "meteor-apollo-accounts";
import { getMainDefinition } from "apollo-utilities";

const AUTH_TOKEN_KEY = "meteor-login-token";
const AUTH_TOKEN_LOCALSTORAGE = "Meteor.loginToken";
const AUTH_TOKEN_EXPIRY = "Meteor.loginTokenExpires";
const AUTH_USER_ID = "Meteor.userId";

const link = split(({query}) => {
  const {kind, operation} = getMainDefinition(query);
  return kind === "OperationDefinition" && operation === "subscription";
}, wsLink, queryLink);

// our apollo client
const client = new ApolloClient({
  link,
  cache
});

// override setTokenStore to store login token in AsyncStorage
setTokenStore({
  set: async function ({userId, token, tokenExpires}) {
    console.log("setting new token " + token);
    loginToken = token; // update cache
    await AsyncStorage.setItem(AUTH_USER_ID, userId);
    await AsyncStorage.setItem(AUTH_TOKEN_LOCALSTORAGE, token);
    // AsyncStorage doesn't support Date type so we'll store it as a String
    await AsyncStorage.setItem(AUTH_TOKEN_EXPIRY, tokenExpires.toString());
    if (token) {
      // we have a valid login token, reset apollo client store
      client.resetStore();
      // bounce the websocket link so that new token gets sent
      linkBounce = true;
      console.log("bouncing websocket link");
      wsLink.subscriptionClient.close(false, false);
    }
  },
  get: async function () {
    return {
      userId: await AsyncStorage.getItem(AUTH_USER_ID),
      token: await AsyncStorage.getItem(AUTH_TOKEN_LOCALSTORAGE),
      tokenExpires: await AsyncStorage.getItem(AUTH_TOKEN_EXPIRY)
    };
  }
});

// callback when token changes
onTokenChange(function() {
  console.log("token did change");
  client.resetStore(); // client is the apollo client instance
});
```

One thing to note is that, don't start a new subscription immediately after bouncing the link. Wait for the connection to be established before doing so. You can do that in the onConnected()/onReconnected() handlers:

```js
function _connected() {
  console.log("WE ARE CONNECTED!");
  // do someting here...
}

wsLink.subscriptionClient.onConnected(_connected);
wsLink.subscriptionClient.onReconnected(_connected);
```

## Polyfills

On react-native, there are some other quirky issues. The meteor-apollo-accounts makes use of the Symbol type which is not supported on Android. A polyfille is required to handle this:

```js
// import this since android needs this to resolve
// https://github.com/orionsoft/meteor-apollo-accounts/issues/73
// solution was suggested here...
// https://github.com/facebook/react-native/issues/4676#issuecomment-163399041
import "core-js/es6/symbol";
import "core-js/fn/symbol/iterator";
import "core-js/es6/set";
```

Another polyfill is needed to handle Object.setProtoypeOf() which is used by apollo-client and not supported by android:

```js
// This polyfill is to address an issue on android
// Object.setProtoypeOf is not defined on android
// https://github.com/apollographql/apollo-client/issues/3236
Object.setPrototypeOf = Object.setPrototypeOf || function(obj, proto) {
  obj.__proto__ = proto; // eslint-disable-line no-proto
  return obj;
};
```

Do both of these at the top of your main application file.

This should get you functional on react-native!
