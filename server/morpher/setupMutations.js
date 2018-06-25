import getFields from './getFields';

export default function setupMutations(config, name, type, collection) {
  let Mutation = {};
  let MutationType = ``;

  if (config.insert) {
    MutationType += `${name}Insert(document: JSON): ${type}\n`;

    Mutation[`${name}Insert`] = (_, { document }, ctx) => {
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
    MutationType += `${name}Update(selector: JSON, modifier: JSON): String!\n`;

    Mutation[`${name}Update`] = (_, { selector, modifier }, ctx) => {
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
    MutationType += `${name}Remove(selector: JSON): String\n`;

    Mutation[`${name}Remove`] = (_, { selector }, ctx) => {
      if (typeof config.insert === 'function') {
        config.remove.call(null, ctx, { selector });
      }

      collection().remove(selector);

      return 'ok';
    };
  }

  return { MutationType, Mutation };
}
