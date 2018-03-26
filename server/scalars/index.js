import Scalars from './scalars';
import DateResolver from './Date';
import GraphQLJSON from 'graphql-type-json';
import { load } from 'graphql-load';

const typeDefs = [Scalars];
const resolvers = [
  {
    Date: DateResolver,
    JSON: GraphQLJSON,
  },
];

load({
  typeDefs,
  resolvers,
});
