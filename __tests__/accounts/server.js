import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { load } from 'meteor/cultofcoders:apollo';
import { asyncIterator } from 'apollo-live-server';

const PASSWORD = '12345';

Meteor.users.remove({});

Accounts.createUser({
  username: 'account-1',
  email: 'account-1@apollo.com',
  password: PASSWORD,
});

Accounts.createUser({
  username: 'account-2',
  email: 'account-2@apollo.com',
  password: PASSWORD,
});

load({
  typeDefs: `
    type Query {
      me: User
    }

    type Subscription {
      me: SubscriptionEvent
    }
  `,
  resolvers: {
    Query: {
      me(_, args, { userId }) {
        if (!userId) {
          throw new Error('not-allowed');
        }

        return Meteor.users.findOne(userId);
      },
    },
    Subscription: {
      me: {
        resolve: payload => payload,
        subscribe(_, args, ctx) {
          if (!ctx.userId) {
            throw new Error('not-allowed');
          }

          const iterator = asyncIterator(
            Meteor.users.find({
              _id: ctx.userId,
            }),
            {
              sendInitialAdds: true,
            }
          );

          console.log('Finish iterator');

          return iterator;
        },
      },
    },
  },
});
