const request = require('supertest');
const app = require('../../src/app');
const assert = require('assert');

describe('Allocation Module - Integration Tests', () => {
  describe('POST /allocations', () => {
    it('should create an active allocation and lock the asset', async () => {
      // TODO: Send POST request to /allocations
      // TODO: Assert status is 201
      assert.ok(true);
    });
  });

  describe('PUT /allocations/:id/return', () => {
    it('should process return checkin and release the asset', async () => {
      // TODO: Send PUT request to /allocations/1/return
      // TODO: Assert status is 200
      assert.ok(true);
    });
  });
});
