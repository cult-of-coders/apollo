import { GraphQLScalarType } from 'graphql';
import { Kind } from 'graphql/language';

export default new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  parseValue(value) {
    console.log('parsing', value);
    return new Date(value);
  },
  serialize(value) {
    return value.toISOString();
  },
  parseLiteral(ast) {
    if (ast.kind == Kind.STRING) {
      const time = Date.parse(ast.value);
      const date = new Date(time);

      return date;
    }
    return null;
  },
});
