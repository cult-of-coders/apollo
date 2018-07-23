import { initialize } from 'meteor/cultofcoders:apollo';
import './graphql/init';
import './morpher/server';
import './accounts/server';

initialize();
