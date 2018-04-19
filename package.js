Package.describe({
  name: 'cultofcoders:apollo',
  version: '0.3.1',
  // Brief, one-line summary of the package.
  summary: 'Meteor & Apollo integration',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/cult-of-coders/apollo.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
});

Package.onUse(function(api) {
  api.versionsFrom('1.3');
  api.use('ecmascript');
  api.use('check');
  api.use('mongo');
  api.use('cultofcoders:grapher@1.3.4');
  api.use('cultofcoders:grapher-schema-directives@0.1.4');
  api.use('accounts-base', { weak: true });

  api.mainModule('client/index.js', 'client');
  api.mainModule('server/index.js', 'server');
});

Package.onTest(function(api) {});
