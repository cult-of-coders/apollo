import { load } from 'graphql-load';
import { typeDefs as directiveTypeDefs } from '../directives';

load({
  typeDefs: [...directiveTypeDefs],
});
