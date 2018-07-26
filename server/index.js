import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import { load } from 'graphql-load';
import { db } from 'meteor/cultofcoders:grapher';

import './scalars';
import './types';
export { default as Config } from './config';
export { getUserForContext } from './core/users';
export { default as initialize } from './initialize';
export { default as expose } from './morpher/expose';

export { load, db };

checkNpmVersions({
  'apollo-server-express': '2.x.x',
  graphql: '0.13.x',
  'graphql-load': '0.1.x',
  'graphql-type-json': '0.2.x',
  'graphql-tools': '3.x.x',
});
