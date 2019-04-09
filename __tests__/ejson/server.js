import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { load } from 'meteor/cultofcoders:apollo';

load({
  typeDefs: `
    type Query {
      jsonTest(input: EJSON): EJSON
    }
  `,
  resolvers: {
    Query: {
      jsonTest(_, { input }, { userId }) {
        console.log(`input`, input);

        return {
          ...input,
        };
      },
    },
  },
});
