import { load } from 'graphql-load';
import { typeDefs as directiveTypeDefs } from '../directives';
import SubscriptionEventType from './SubscriptionEventType';

load({
  typeDefs: [...directiveTypeDefs, SubscriptionEventType],
});
