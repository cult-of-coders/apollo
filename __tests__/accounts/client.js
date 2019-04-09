import client, { wsLink } from '../apolloClient';
import gql from 'graphql-tag';
import { assert } from 'chai';
import { loginWithPassword, logout } from 'meteor-apollo-accounts';

const PASSWORD = '12345';

describe('Accounts', () => {
  it('Should allow me to login', async () => {
    const username = 'account-1';
    const userId = await loginWithPassword({ username, password: PASSWORD }, client);

    assert.isString(userId);
    await logout(client);
  });

  it('Should throw an error if invalid login', done => {
    const username = 'accountZ-2';
    loginWithPassword({ username, password: PASSWORD }, client).catch(e => {
      done();
    });
  });

  it('Should properly store the token in such a way that I am identified', async () => {
    const username = 'account-1';
    const userId = await loginWithPassword({ username, password: PASSWORD }, client);

    const query = gql`
      query {
        me {
          _id
        }
      }
    `;

    const response = await client.query({
      query,
    });

    const { me } = response.data;

    assert.equal(userId, me._id);
    await logout(client);
  });

  // TODO: It seems that the subscription is authenticated properly
  // However, due to the nature of how subscriptions work, if a new message is received before asyncIterator is returned
  // That message doesn't reach the client

  // it('Should identify subscription authentication', async () => {
  //   const username = 'account-1';
  //   const userId = await loginWithPassword(
  //     { username, password: PASSWORD },
  //     client
  //   );

  //   assert.isString(userId);
  //   wsLink.subscriptionClient.close(true);

  //   return new Promise((resolve, reject) => {
  //     setTimeout(() => {
  //       const query = gql`
  //         subscription {
  //           me {
  //             event
  //             doc
  //           }
  //         }
  //       `;

  //       const observable = client.subscribe({ query });
  //       const subscription = observable.subscribe(
  //         x => {
  //           console.log(x);
  //         },
  //         () => {
  //           console.log('err');
  //         },
  //         () => {
  //           console.log('Finished');
  //         }
  //       );
  //     }, 500);
  //   });
  // });
});
