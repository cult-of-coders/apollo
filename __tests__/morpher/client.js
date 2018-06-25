import { initialize } from 'meteor/cultofcoders:apollo';
import { setClient } from 'apollo-morpher';

const { client } = initialize();

setClient(client);

export default client;
