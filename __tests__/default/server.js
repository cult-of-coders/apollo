import { load } from 'meteor/cultofcoders:apollo';

load({
  typeDefs: `
    type Query {
      secretContextMessage: String!
    }
  `,
  resolvers: {
    Query: {
      secretContextMessage(_, args, { secretMessage }) {
        return secretMessage;
      },
    },
  },
});
