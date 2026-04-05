// packages/integration/src/__tests__/emissions.test.js
import {
  connectDb,
  disconnectDb,
  seedCollection,
  cleanCollection,
} from '../../../../shared/helpers/mongoSeeder.js';

describe('Emissions data pipeline — integration', () => {
  let db;
  let insertedIds;

  beforeAll(async () => {
    db = await connectDb();

    // Seed known emission factors before the tests run
    insertedIds = await seedCollection(db, 'emissionFactors', [
      { fuelType: 'diesel', value: 2.68, source: 'DEFRA', year: 2024 },
      { fuelType: 'petrol', value: 2.31, source: 'DEFRA', year: 2024 },
    ]);
  });

  afterAll(async () => {
    // Clean up only the documents this test suite inserted
    // Never drop the whole collection — other test suites may share it
    await cleanCollection(db, 'emissionFactors', {
      _id: { $in: Object.values(insertedIds) },
    });
    await disconnectDb();
  });

  test('fetches correct factor for diesel', async () => {
    const factor = await db.collection('emissionFactors').findOne({ fuelType: 'diesel' });

    expect(factor.value).toBe(2.68);
  });
});
