import client, { wsLink } from '../apolloClient';
import gql from 'graphql-tag';
import { loginWithPassword, logout } from 'meteor-apollo-accounts';
import { resolve } from 'dns';

const PASSWORD = '12345';

describe('Default', () => {
  it('Should allow me to provide custom context', async () => {
    const response = await client.query({
      query: gql`
        query {
          secretContextMessage
        }
      `,
    });

    assert.equal(
      response.data.secretContextMessage,
      'SECRET_MESSAGE_IN_CONTEXT'
    );
  });
});
