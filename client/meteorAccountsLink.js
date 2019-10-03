import { ApolloLink } from 'apollo-link';

export default new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('Meteor.loginToken');

  operation.setContext(() => ({
    headers: {
      'meteor-login-token': token,
    },
  }));

  return forward(operation);
});
