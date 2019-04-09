import Scalars from './scalars';
import DateResolver from './Date';
import GraphQLJSON from 'graphql-type-json';
import EJSON from './EJSON';
import { load } from 'graphql-load';

const typeDefs = [Scalars];
const resolvers = [
  {
    Date: DateResolver,
    JSON: GraphQLJSON,
    EJSON,
  },
];

load({
  typeDefs,
  resolvers,
});
