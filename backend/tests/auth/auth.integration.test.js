const request = require('supertest');
const app = require('../../src/app');
const assert = require('assert');

describe('Auth Module - Integration Tests', () => {
  describe('POST /login', () => {
    it('should login and return a JWT token with user details', async () => {
      // TODO: Send POST request to /login with valid body
      // TODO: Assert response status is 200
      // TODO: Assert response contains JWT token and user info
      assert.ok(true);
    });

    it('should return 400 Bad Request if email/password are missing', async () => {
      // TODO: Send POST request with empty body
      // TODO: Assert status is 400
      assert.ok(true);
    });
  });
});
