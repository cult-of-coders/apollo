import { Meteor } from 'meteor/meteor';
import { addMockFunctionsToSchema } from 'graphql-tools';
import { createServer } from './apolloServer';
import { createSubscriptionServer } from './subcriptionServer';
import { createEngine } from './engineServer';
import { getExecutableSchema } from './schema';
import { db } from 'meteor/cultofcoders:grapher';
import Config from './config';

export default function initialize(config = {}) {
  Object.assign(Config, config);
  Object.assign(Config.CONTEXT, {
    db,
  });

  Object.freeze(Config);

  const schema = getExecutableSchema(
    Config.LOADER && Config.LOADER.getSchema
      ? Config.LOADER.getSchema.bind(Config.LOADER)
      : undefined
  );

  if (Config.MOCKING) {
    addMockFunctionsToSchema({
      schema,
      ...Config.MOCKING,
    });
  }

  const app = createServer({ schema });

  if (Config.ENGINE_API_KEY) {
    createEngine({
      expressApp: app,
      apiKey: Config.ENGINE_API_KEY,
      port: Config.ENGINE_PORT,
    });
  }

  if (!Config.DISABLE_SUBSCRIPTIONS) {
    createSubscriptionServer({ schema });
  }
}
