# Meteor Connectivity Simulation

For folks coming from the classic Meteor DDP environment, we are very used to reactivity on the connection to the server. For instance, when we connect to Meteor using DDP, we automatically have:

* Reactive connectivity status to server and event notification when that status changes. This helps us do things like navigating to splash-screen/login/post-login pages.
* Auto-login attempt when connection established

You can still achieve that with this package, though there is a bit of extra setup.

## Meteor Connectivity Status Simulation

The standard Meteor/DDP behaviour is when the DDP over websocket connection is established, you get ```Meteor.status().connected``` and ```Meteor.user()```. When the link status changes, or the user logs in/out, you get reactive updates. To get such behaviour with this package, you can register handlers for onConnected, onReconnected, and onDisconnected events from the ```wsLink``` apollo-link that we created.

```js

let linkBounce = false; // this is to handle intentional bouncing of our link

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

function _connected() {
  console.log("WE ARE CONNECTED!");
  
  // do something here, say check user login status or navigate to appropriate page
 
}

function _disconnected() {
  console.log("WE ARE DISCONNECTED!");

  // if we are intentionally bouncing our link, don't do anything
  if (!linkBounce) {
      
      // do something here, like flush all subscriptions or navigate to a different page

  }

  // reset link bounce flag
  linkBounce = false;

}

function setupServerConnectionListeners() {
  // set some listeners for websocket connection status
  wsLink.subscriptionClient.onConnected(_connected);
  wsLink.subscriptionClient.onReconnected(_connected);
  wsLink.subscriptionClient.onDisconnected(_disconnected);

  // bounce websocket link in subscription client to reconnect so that our listeners are active
  console.log("bouncing websocket link");
  linkBounce = true;
  wsLink.subscriptionClient.close(false, false);

}
```

Notice that in our ```setupServerConnectionListeners()``` function, we bounce the link after we set up the listeners. This is because the websocket connection is established when you create the wsLink and the listeners will not be active yet. We bounce the link to activate the listeners. Also notice that we don'd do anything in our ```_disconnect()``` handler when we are intentionally bouncing the link.

You should be able to test this now by bringing either the server or client up and down, and you should observer Meteor like connection reactivity.

Keep in mind that the subscriptions-transport-ws uses a backoff system to reconnect to the server, so you might experience a few seconds of delay before the link is reestablished when the server goes down and comes back up. There should be no delay when the client goes down and comes back up.

## Auto-login of User

Meteor users are also used to have the system auto-login the user if there is a valid login token, and having a ```Meteor.user()```. We can get this type of behaviour by setting up a query to retrieve user information. Let's call it a ```whoAmI``` query. Obviously, we need to set this schema and resolver on the server:

### Server

Let's set up the schema first:

```graphql
# file user.graphql

type Email
{
	address: String
	verified: Boolean
}

type User @mongo(name: "users")
{
  _id: ID!
  emails: [Email]
  firstName: String
  lastName: String
  fullName: String
}

type Query {
  users: [User]
  me: User # This is our user to query on!
}
```

Next, our resolver:

```js
// file user.resolver.js

import { Meteor } from "meteor/meteor";

export default {
  User: {
    fullName(user) {
      return (`${user.profile.firstName} ${user.profile.lastName}`);
    },
    firstName(user) {
      return (`${user.profile.firstName}`);
    },
    lastName(user) {
      return (`${user.profile.lastName}`);
    }
  },
  Query: {
    users(_, args, {db}, ast) {
      // use grapher to do the query instead of direct mongo query
      let allUsers = db.users.astToQuery(ast, {
        embody({body, getArgs}) { // eslint-disable-line no-unused-vars
          // grab profile too if not already included
          if (!body.profile) {
            Object.assign(body, {
              profile: 1
            });
          }
        }
      }).fetch();
      return allUsers;
    },
    // this is our 'me' query resolver
    me(_, args, context) {
        return Meteor.users.findOne(context.userId); // notice we look for the userId, so we are looking for a valid login token
    }
  }
};
```

### Client

Now that we have set up our server, we can query for the user once the websocket connection has been established. So we change our ```_connected()``` connection handler to:

```js
import gql from "graphql-tag";

// checks user info
function whoAmI() {
  const myInfo = gql`
      query {
        me {
          _id
          firstName
          lastName
          fullName
        }
      }`;

  return new Promise((resolve, reject) => { // eslint-disable-line no-undef
    // execute the query
    client.query({
      query: myInfo,
      fetchPolicy: "no-cache" // we don't want to cache the results
    }).then((result) => {
      console.log("user query success: " + JSON.stringify(result));
      resolve(result.data);
    }).catch((error) => {
      console.log("user query error: " + error);
      reject(null);
    });
  });
}

function _connected() {
  console.log("WE ARE CONNECTED!");

  // check our login status
  whoAmI().then((data) => {
    if (data && data.me) {
      console.log("we are already logged in!");
      // we have a valid login token, do something, maybe go to post-login page
      // we also have a valid userId in data.me._id, so we could use that elsewhere
    } else if (data && !data.me) {
      console.log("we are not logged in!");
      // we do not have a valid login token, proceed to login page
    }
  });
}
```

With this, once, the websocket connection has been established, it will do a http-link query to get the user information. This assumes the httpLink has been set up correctly.

Keep in mind that the user infor you get back is not truly reactive like ```Meteor.user()```. This just tells you whether you have a valid login token or not. If you want to have your user information to be reactive, you need to set up a users subscription.

With this, you have achieved some level of the Meteor connectivity reactiviy we have all gotten used to. Hopefully, this was useful!


