import test from 'node:test';
import assert from 'node:assert/strict';
import { mock } from 'node:test';

import pool from '../utils/database.js';
import { generateToken } from '../utils/jwtUtils.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';
import { loginUser } from '../controllers/authController.js';
import { requestEquipment } from '../controllers/equipmentController.js';
import { updateCourtStatus } from '../controllers/courtController.js';

const buildJsonResponse = () => {
  const res = {
    statusCode: null,
    payload: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.payload = data;
      return this;
    },
  };
  return res;
};

test('authenticateToken accepts a valid JWT and attaches the user from the database', async () => {
  const token = generateToken('e22018', 'student');
  const queryMock = mock.method(pool, 'query', async () => ({ rows: [{ user_id: 'e22018', role: 'student' }] }));

  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = buildJsonResponse();
  let nextCalled = false;

  await authenticateToken(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, null);
  assert.equal(nextCalled, true);
  assert.equal(req.user.userId, 'e22018');
  assert.equal(req.user.role, 'student');

  queryMock.mock.restore();
});

test('authenticateToken rejects missing or invalid tokens', async () => {
  const missingTokenReq = { headers: {} };
  const missingRes = buildJsonResponse();
  await authenticateToken(missingTokenReq, missingRes, () => {});
  assert.equal(missingRes.statusCode, 401);
  assert.deepEqual(missingRes.payload, { message: 'Access token required' });

  const invalidReq = { headers: { authorization: 'Bearer invalid-token' } };
  const invalidRes = buildJsonResponse();
  await authenticateToken(invalidReq, invalidRes, () => {});
  assert.equal(invalidRes.statusCode, 403);
  assert.deepEqual(invalidRes.payload, { message: 'Invalid or expired token' });
});

test('authorizeRole denies users whose role is not in the allowed list', () => {
  const req = { user: { role: 'student' } };
  const res = buildJsonResponse();
  let nextCalled = false;

  authorizeRole(['admin'])(req, res, () => {
    nextCalled = true;
  });

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.payload, { message: 'Insufficient permissions' });
  assert.equal(nextCalled, false);
});

test('loginUser rejects empty credentials and unknown users', async () => {
  const emptyReq = { body: { userId: '', password: '' } };
  const emptyRes = buildJsonResponse();
  await loginUser(emptyReq, emptyRes);
  assert.equal(emptyRes.statusCode, 400);
  assert.deepEqual(emptyRes.payload, { message: 'User ID and password are required' });

  const queryMock = mock.method(pool, 'query', async () => ({ rows: [] }));
  const invalidReq = { body: { userId: 'e22018', password: 'wrongpass' } };
  const invalidRes = buildJsonResponse();
  await loginUser(invalidReq, invalidRes);
  assert.equal(invalidRes.statusCode, 400);
  assert.deepEqual(invalidRes.payload, { message: 'Invalid credentials' });

  queryMock.mock.restore();
});

test('requestEquipment validates payloads and accepts valid issue requests', async () => {
  const invalidReq = { body: { studentId: 'e22018', equipment_id: 4, quantity: 0, pickupTime: '2026-09-25T09:00:00Z' } };
  const invalidRes = buildJsonResponse();
  await requestEquipment(invalidReq, invalidRes);
  assert.equal(invalidRes.statusCode, 400);
  assert.deepEqual(invalidRes.payload, { message: 'quantity must be a positive integer' });

  const queryMock = mock.method(pool, 'query', async (query, values) => {
    if (query.includes('COUNT(*) as count')) {
      return { rows: [{ count: '0' }] };
    }
    return { rows: [{ id: 42 }] };
  });

  const validReq = {
    body: {
      studentId: 'e22018',
      equipment_id: 4,
      quantity: 2,
      pickupTime: '2026-09-25T09:00:00Z',
    },
  };
  const validRes = buildJsonResponse();
  await requestEquipment(validReq, validRes);

  assert.equal(validRes.statusCode, 201);
  assert.equal(validRes.payload.requestId, 42);
  assert.equal(validRes.payload.message, 'Equipment requested successfully');

  queryMock.mock.restore();
});

test('updateCourtStatus converts blocked values into the database maintenance state', async () => {
  const queryMock = mock.method(pool, 'query', async () => ({ rows: [{ court_id: 7, status: 'maintenance', reason: 'Maintenance' }] }));
  const req = {
    params: { id: '7' },
    body: { status: 'blocked', reason: 'Maintenance' },
    user: { userId: 'admin01' },
  };
  const res = buildJsonResponse();

  await updateCourtStatus(req, res);

  assert.equal(res.statusCode, null);
  assert.equal(res.payload.message, 'Court status updated successfully');
  assert.equal(res.payload.courtStatus.status, 'maintenance');

  queryMock.mock.restore();
});

test('event utility functions handle date expiry and payload normalization as implemented', async () => {
  const { expandCourtSelection, isEventExpired, normalizeEventRequestPayload } = await import('../utils/eventUtils.js');
  const courts = [
    { id: 1, name: 'Main Gymnasium Hall', location: 'Main Gymnasium Hall', is_indoor: true },
    { id: 2, name: 'Badminton Court', location: 'Indoor Gymnasium', is_indoor: true },
    { id: 3, name: 'Basketball Court', location: 'Indoor Gymnasium', is_indoor: true },
    { id: 4, name: 'Football Field', location: 'Outdoor', is_indoor: false },
  ];

  assert.deepEqual(expandCourtSelection([4], true, courts), [1, 2, 3, 4]);
  assert.equal(isEventExpired({ startDate: '2026-08-10', endDate: '2026-08-10', startTime: '10:00', endTime: '11:00' }, new Date('2026-08-10T12:00:00')), true);

  const normalized = normalizeEventRequestPayload({
    requestType: 'tournament',
    title: 'Campus Cup',
    selectedCourts: '[2,4]',
    sportEntries: '[{"sportName":"Football","date":"2026-08-01"}]',
    mainGymSelected: true,
  });

  assert.equal(normalized.type, 'tournament');
  assert.deepEqual(normalized.selectedCourts, [2, 4]);
  assert.equal(normalized.mainGymSelected, true);
});
