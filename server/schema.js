import { makeExecutableSchema } from 'graphql-tools';
import { getSchema } from 'graphql-load';

let schema;
export function getExecutableSchema() {
  if (schema) {
    return schema;
  }

  schema = makeExecutableSchema(getSchema());

  return schema;
}
