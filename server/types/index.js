import { ReactiveEventType } from 'apollo-live-server';
import { load } from 'graphql-load';
import { typeDefs as directiveTypeDefs } from '../directives';

load({
  typeDefs: [ReactiveEventType, ...directiveTypeDefs],
});
