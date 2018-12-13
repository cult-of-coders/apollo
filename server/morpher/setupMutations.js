import getFields from './getFields';
import { EJSON } from 'meteor/ejson';
import { check } from 'meteor/check';

export default function setupMutations(config, name, type, collection) {
  let Mutation = {};
  let MutationType = ``;

  if (config.insert) {
    MutationType += `${name}Insert(payload: String!): ${type}\n`;

    Mutation[`${name}Insert`] = (_, { payload }, ctx) => {
      const { document } = EJSON.parse(payload);
      check(document, Object);

      if (typeof config.insert === 'function') {
        config.insert.call(null, ctx, { document });
      }

      const docId = collection().insert(document);

      return {
        _id: docId,
      };
    };
  }

  if (config.update) {
    MutationType += `${name}Update(payload: String!): String\n`;

    Mutation[`${name}Update`] = (_, { payload }, ctx) => {
      const { selector, modifier } = EJSON.parse(payload);
      check(selector, Object);
      check(modifier, Object);

      if (typeof config.update === 'function') {
        const { topLevelFields, fields } = getFields(modifier);
        config.update.call(null, ctx, {
          selector,
          modifier,
          modifiedFields: fields,
          modifiedTopLevelFields: topLevelFields,
        });
      }

      const docId = collection().update(selector, modifier);

      return 'ok';
    };
  }

  if (config.remove) {
    MutationType += `${name}Remove(payload: String!): String\n`;

    Mutation[`${name}Remove`] = (_, { payload }, ctx) => {
      const { selector } = EJSON.parse(payload);
      check(selector, Object);

      if (typeof config.insert === 'function') {
        config.remove.call(null, ctx, { selector });
      }

      collection().remove(selector);

      return 'ok';
    };
  }

  return { MutationType, Mutation };
}
