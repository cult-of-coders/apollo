import { expose, db } from "meteor/cultofcoders:apollo";
import { Mongo } from "meteor/mongo";

export const TestCollection = new Mongo.Collection("tests");

expose({
  users: {
    type: "User",
    collection: () => db.users,
    update: () => true,
    insert: () => true,
    remove: () => true,
    find: () => true
  }
});
