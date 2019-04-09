import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';
import { EJSON } from 'meteor/ejson';

export default new GraphQLScalarType({
  name: 'EJSON',
  description: 'EJSON custom scalar type',
  parseValue(value) {
    return EJSON.parse(value);
  },
  serialize(value) {
    return EJSON.stringify(value);
  },
  parseLiteral(ast) {
    if (ast.kind == Kind.STRING) {
      return EJSON.stringify(value);
    }

    return null;
  },
});
