import { load } from 'meteor/cultofcoders:apollo';
import MorpherModule from './morpher';
import AccountsModule from './accounts';

load([
  AccountsModule,
  MorpherModule
]);