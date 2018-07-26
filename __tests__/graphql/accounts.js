import { initAccounts } from 'meteor/cultofcoders:apollo-accounts';

// Load all accounts related resolvers and type definitions into graphql-loader
const AccountsModule = initAccounts({
  loginWithFacebook: false,
  loginWithGoogle: false,
  loginWithLinkedIn: false,
  loginWithPassword: true,
}); // returns { typeDefs, resolvers }

export default AccountsModule;