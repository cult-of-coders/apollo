import { Meteor } from 'meteor/meteor';
import { getExecutableSchema } from './schema';
import { GRAPHQL_SUBSCRIPTION_ENDPOINT } from '../constants';
import { createApolloServer } from 'meteor/apollo';

Meteor.startup(() => {
  const schema = getExecutableSchema();
  createApolloServer(
    {
      schema,
    },
    {
      graphiqlOptions: {
        subscriptionsEndpoint: GRAPHQL_SUBSCRIPTION_ENDPOINT,
      },
    }
  );
});
