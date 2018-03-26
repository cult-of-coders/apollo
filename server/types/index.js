import { ReactiveEventType } from 'apollo-live-server';
import { load } from 'graphql-load';

load({
  typeDefs: ReactiveEventType,
});
