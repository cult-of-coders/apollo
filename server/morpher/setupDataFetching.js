import { asyncIterator, astToFields, Event } from 'apollo-live-server';

export default function setupDataFetching(config, name, type, collection) {
  let Query = {};
  let QueryType = ``;
  let Subscription = {};
  let SubscriptionType = ``;

  QueryType += `${name}(params: JSON!): [${type}]!` + '\n';
  QueryType += `${name}Count(params:JSON!): Int!` + '\n';
  QueryType += `${name}Single(params: JSON!): ${type}`;

  // We are creating the function here because we are re-using it for Single ones

  const resolveSelectors = (_, { params }, ctx, ast) => {
    let astToQueryOptions;

    if (typeof config.find === 'function') {
      params = Object.assign(
        {
          filters: {},
          options: {},
        },
        params
      );

      let astToQueryOptions = config.find.call(null, ctx, params, ctx, ast);
      if (astToQueryOptions === false) {
        throw new Error('Unauthorized');
      }
    }

    if (astToQueryOptions === undefined || astToQueryOptions === true) {
      astToQueryOptions = {
        $filters: params.filters || {},
        $options: params.options || {},
      };
    }

    return astToQueryOptions;
  };

  const fn = (_, { params }, ctx, ast) => {
    const astToQueryOptions = resolveSelectors(_, { params }, ctx, ast);

    return collection()
      .astToQuery(ast, astToQueryOptions)
      .fetch();
  };

  Query = {
    [name]: fn,
    [name + 'Count'](_, { params }, ctx, ast) {
      const astToQueryOptions = resolveSelectors(_, { params }, ctx, ast);

      return collection()
        .find(astToQueryOptions.$filters || {})
        .count();
    },
    [name + 'Single'](_, args, ctx, ast) {
      const result = fn.call(null, _, args, ctx, ast);
      return result[0] || null;
    },
  };

  /**
   * This will not be in the current release
   * 
  if (config.subscription) {
    SubscriptionType = `${name}(params: JSON!): SubscriptionEvent`;
    Subscription = {
      [name]: {
        resolve: payload => {
          if (config.subscriptionResolver) {
            return config.subscriptionResolver.call(null, payload);
          }
          return payload;
        },
        subscribe(_, { params }, ctx, ast) {
          const fields = astToFields(ast)[doc];

          if (typeof config.subscription === 'function') {
            config.subscription.call(null, ctx, fields);
          }

          const observable = collection().find({}, { fields });
          return asyncIterator(observable);
        },
      },
    };
  }
  */

  return { QueryType, SubscriptionType, Query, Subscription };
}
