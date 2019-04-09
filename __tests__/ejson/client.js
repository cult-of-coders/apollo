import client, { wsLink } from '../apolloClient';
import gql from 'graphql-tag';
import { EJSON } from 'meteor/ejson';
import { assert } from 'chai';

const PASSWORD = '12345';

describe('EJSON', () => {
  it('Should work properly', async () => {
    const response = await client.query({
      query: gql`
        query($input: EJSON) {
          jsonTest(input: $input)
        }
      `,
      variables: {
        input: EJSON.stringify({
          name: 'john',
          date: new Date(),
        }),
      },
    });

    const data = EJSON.parse(response.data.jsonTest);

    assert.isString(data.name);
    assert.isTrue(data.date instanceof Date);
  });
});
