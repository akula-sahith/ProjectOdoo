const request = require('supertest');
const app = require('../../src/app');
const assert = require('assert');

describe('Assets Module - Integration Tests', () => {
  describe('POST /assets', () => {
    it('should create an asset and generate the tag if not provided', async () => {
      // TODO: Send POST request to /assets
      // TODO: Assert status is 201 and asset_tag is returned
      assert.ok(true);
    });
  });

  describe('GET /assets', () => {
    it('should retrieve list of assets matching query search filters', async () => {
      // TODO: Send GET to /assets?status=AVAILABLE
      // TODO: Assert all returned assets show AVAILABLE status
      assert.ok(true);
    });
  });
});
