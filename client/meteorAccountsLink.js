import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';

let meteorAccountsLink;

// We have a weak dependency on this package, and if we import it without it being added, it will crash
if (Package['accounts-base']) {
  import { Accounts } from 'meteor/accounts-base';
  
  meteorAccountsLink = new ApolloLink((operation, forward) => {
    const token = Accounts._storedLoginToken();
  
    operation.setContext(() => ({
      headers: {
        'meteor-login-token': token,
      },
    }));
  
    return forward(operation);
  });
}

export {
  meteorAccountsLink
}
