const request = require('supertest');
const app = require('../../src/app');
const assert = require('assert');

describe('Booking Module - Integration Tests', () => {
  describe('POST /bookings', () => {
    it('should successfully book a resource and return 201', async () => {
      // TODO: Send POST request to /bookings
      // TODO: Assert status is 201
      assert.ok(true);
    });

    it('should block overlapping bookings for the same resource with 400', async () => {
      // TODO: Send POST request with overlapping dates
      // TODO: Assert status is 400
      assert.ok(true);
    });
  });
});
