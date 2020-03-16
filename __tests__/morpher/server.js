import "./bootstrap";
import { db } from "meteor/cultofcoders:apollo";
import setupMutations from "../../server/morpher/setupMutations";
import setupDataFetching from "../../server/morpher/setupDataFetching";
import { assert } from "chai";

describe("Unit tests", () => {
  it("Should send all the right args to the config functions", () => {
    const testRest = [
      {},
      {
        payload: JSON.stringify({
          document: { a: 1 },
          selector: {},
          modifier: {}
        })
      },
      {},
      {}
    ];

    const checkArray = rest => {
      assert.equal(4, rest.length);

      for (let i = 0; i < testRest.length; i++) {
        if (i === 1) {
          continue;
        }
        assert.strictEqual(testRest[i], rest[i]);
      }

      // assert.equal(rest[1], {});
    };

    let count = 0;

    const { Mutation } = setupMutations(
      {
        insert(ctx, special, ...rest) {
          checkArray(rest);
          count++;
        },
        update(ctx, special, ...rest) {
          checkArray(rest);
          count++;
        },
        remove(ctx, special, ...rest) {
          checkArray(rest);
          count++;
        }
      },
      "test",
      "TestEntity",
      () => db.tests
    );

    const { Query } = setupDataFetching(
      {
        find(ctx, special, ...rest) {
          count++;
          checkArray(rest);
        }
      },
      "test",
      "TestEntity",
      () => db.tests
    );

    const safeRun = fn => {
      try {
        fn();
      } catch (e) {}
    };
    safeRun(() => Mutation.testInsert(...testRest));
    safeRun(() => Mutation.testUpdate(...testRest));
    safeRun(() => Mutation.testRemove(...testRest));

    safeRun(() => Query.test(...testRest));
    safeRun(() => Query.testSingle(...testRest));
    safeRun(() => Query.testCount(...testRest));

    assert.equal(count, 6);
  });
});
