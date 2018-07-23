import { initialize } from 'meteor/cultofcoders:apollo';

const { client, wsLink } = initialize();

export { wsLink };

export default client;
