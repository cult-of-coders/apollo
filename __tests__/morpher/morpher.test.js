import db from 'apollo-morpher';
import client from './client';

describe('Morpher', () => {
  it('Should work with insert()', done => {
    db.users
      .insert({
        firstName: 'John',
        lastName: 'Smith',
      })
      .then(result => {
        assert.isString(result._id);
        done();
      });
  });
  it('Should work with update()', async () => {
    const { _id } = await db.users.insert({
      firstName: 'John',
      lastName: 'Smith',
    });

    const response = await db.users.update(
      { _id },
      {
        $set: { lastName: 'Brown' },
      }
    );

    assert.equal('ok', response);
  });

  it('Should work with remove()', async () => {
    const { _id } = await db.users.insert({
      firstName: 'John',
      lastName: 'Smith',
    });

    const response = await db.users.remove({ _id });

    assert.equal('ok', response);
  });

  it('Should work with find()', async () => {
    const { _id } = await db.users.insert({
      firstName: 'John',
      lastName: 'Smith',
    });

    const users = await db.users.find(
      {
        _id: 1,
        firstName: 1,
        lastName: 1,
      },
      {
        filters: { _id },
      }
    );

    assert.lengthOf(users, 1);
    assert.isObject(users[0]);
    assert.equal(_id, users[0]._id);
    assert.equal('John', users[0].firstName);
    assert.equal('Smith', users[0].lastName);
  });

  it('Should work with findOne()', async () => {
    const { _id } = await db.users.insert({
      firstName: 'John',
      lastName: 'Smith',
    });

    const user = await db.users.findOne(
      {
        _id: 1,
        firstName: 1,
        lastName: 1,
      },
      {
        filters: { _id },
      }
    );

    assert.isObject(user);
    assert.equal(_id, user._id);
    assert.equal('John', user.firstName);
    assert.equal('Smith', user.lastName);
  });

  it('Should work with count()', async () => {
    await db.users.remove({
      firstName: 'JohnCountable',
    });

    const d1 = await db.users.insert({
      firstName: 'JohnCountable',
    });
    const d2 = await db.users.insert({
      firstName: 'JohnCountable',
    });

    const count = await db.users.count({
      filters: {
        firstName: 'JohnCountable',
      },
    });

    assert.equal(2, count);
  });

  it('Should work with options', async () => {
    await db.users.remove({
      firstName: 'JohnOptionable',
    });

    const d1 = await db.users.insert({
      firstName: 'JohnOptionable',
    });
    const d2 = await db.users.insert({
      firstName: 'JohnOptionable',
    });

    const results = await db.users.find(`firstName`, {
      filters: {
        firstName: 'JohnOptionable',
      },
      options: {
        limit: 1,
      },
    });

    assert.equal(1, results.length);
  });
});
