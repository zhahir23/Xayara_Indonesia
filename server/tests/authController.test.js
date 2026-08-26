const test = require('node:test');
const assert = require('node:assert/strict');

const { login } = require('../controllers/authController');

const buildRes = () => {
  const res = {
    statusCode: null,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.payload = payload;
      return this;
    }
  };

  return res;
};

test('login bypasses credential checks when no database configuration is present', async () => {
  const previousDbEnv = process.env.DATABASE_URL;
  const previousBypassEnv = process.env.ENABLE_LOGIN_BYPASS;

  delete process.env.DATABASE_URL;
  delete process.env.DB_HOST;
  delete process.env.POSTGRES_URL;
  delete process.env.MYSQL_HOST;
  delete process.env.ENABLE_LOGIN_BYPASS;

  try {
    const req = { body: { email: 'any-user@example.com', password: 'anything' } };
    const res = buildRes();

    await login(req, res);

    assert.equal(res.statusCode, null);
    assert.ok(res.payload && res.payload.token);
    assert.equal(res.payload.user.email, 'any-user@example.com');
    assert.equal(res.payload.user.role, 'admin');
  } finally {
    if (previousDbEnv === undefined) {
      delete process.env.DATABASE_URL;
    } else {
      process.env.DATABASE_URL = previousDbEnv;
    }

    if (previousBypassEnv === undefined) {
      delete process.env.ENABLE_LOGIN_BYPASS;
    } else {
      process.env.ENABLE_LOGIN_BYPASS = previousBypassEnv;
    }
  }
});
