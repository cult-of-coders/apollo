import { expose, db } from 'meteor/cultofcoders:apollo';

expose({
  users: {
    type: 'User',
    collection: () => db.users,
    update: () => true,
    insert: () => true,
    remove: () => true,
    find: () => true,
  },
});
