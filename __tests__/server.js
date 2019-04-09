import { initialize } from 'meteor/cultofcoders:apollo';
import './graphql/init';
import './morpher/server';
import './accounts/server';
import './default/server';
import './ejson/server';

initialize({
  context: async () => ({
    secretMessage: 'SECRET_MESSAGE_IN_CONTEXT',
  }),
});
