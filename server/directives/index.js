import { directives as grapherDirectives } from 'meteor/cultofcoders:grapher-schema-directives';
import { directiveDefinitions } from 'meteor/cultofcoders:grapher-schema-directives';

export const typeDefs = [directiveDefinitions];

export default {
  ...grapherDirectives,
};
