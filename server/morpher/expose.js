import { check, Match } from 'meteor/check';
import { db } from 'meteor/cultofcoders:grapher';
import { load } from 'meteor/cultofcoders:apollo';
import setupDataFetching from './setupDataFetching';
import setupMutations from './setupMutations';

const MaybeBoolOrFunction = Match.Maybe(Match.OneOf(Boolean, Function));

const getConfig = object => {
  check(object, {
    type: String,
    collection: Function,
    update: MaybeBoolOrFunction,
    insert: MaybeBoolOrFunction,
    remove: MaybeBoolOrFunction,
    find: MaybeBoolOrFunction,
  });

  const newObject = Object.assign(
    {
      subscription: true,
    },
    object
  );

  return newObject;
};

const morph = config => {
  for (name in config) {
    let singleConfig = getConfig(config[name]);
    let modules = exposeSingle(name, singleConfig);

    load(modules);
  }
};

function exposeSingle(name, config) {
  const { collection, type } = config;

  let modules = [];

  if (config.insert || config.update || config.remove) {
    let { MutationType, Mutation } = setupMutations(
      config,
      name,
      type,
      collection
    );

    MutationType = `type Mutation { ${MutationType} }`;

    modules.push({
      typeDefs: MutationType,
      resolvers: { Mutation },
    });
  }

  if (config.find) {
    let { QueryType, Query } = setupDataFetching(
      config,
      name,
      type,
      collection
    );

    QueryType = `type Query { ${QueryType} }`;

    modules.push({
      typeDefs: [QueryType],
      resolvers: { Query },
    });
  }

  return modules;
}

export default morph;
