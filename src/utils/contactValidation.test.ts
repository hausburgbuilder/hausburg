import test from 'node:test';
import assert from 'node:assert/strict';
import { validateContactForm, generateOrderCode, generateMailtoLink, formatClipboardMessage } from './contactValidation';

test('validateContactForm detects empty required fields', () => {
  const result = validateContactForm({});
  assert.equal(result.isValid, false);
  assert.ok(result.errors.fullName);
  assert.ok(result.errors.email);
  assert.ok(result.errors.robloxUsername);
  assert.ok(result.errors.message);
});

test('validateContactForm rejects invalid emails and short inputs', () => {
  const result = validateContactForm({
    fullName: 'J',
    email: 'not-an-email',
    robloxUsername: 'ab',
    message: 'hi',
  });
  assert.equal(result.isValid, false);
  assert.ok(result.errors.fullName);
  assert.ok(result.errors.email);
  assert.ok(result.errors.robloxUsername);
  assert.ok(result.errors.message);
});

test('validateContactForm approves complete and valid inputs', () => {
  const result = validateContactForm({
    fullName: 'John Doe',
    email: 'john@example.com',
    robloxUsername: 'JohnBuilder99',
    message: 'Looking forward to building this Saturday afternoon.',
  });
  assert.equal(result.isValid, true);
  assert.equal(Object.keys(result.errors).length, 0);
});

test('generateOrderCode generates consistent branded prefixes', () => {
  const code = generateOrderCode('villa-luminosa');
  assert.ok(code.startsWith('HAU-VIL-'));
  assert.equal(code.length, 12);
});

test('generateMailtoLink creates properly encoded mailto URI', () => {
  const link = generateMailtoLink(
    {
      fullName: 'John Doe',
      email: 'john@example.com',
      robloxUsername: 'JohnBuilder99',
      houseId: 'villa-luminosa',
      houseName: 'Villa Luminosa',
      message: 'Looking for a clean build',
    },
    'recipient@hausburg.com'
  );

  assert.ok(link.startsWith('mailto:recipient@hausburg.com?subject='));
  assert.ok(link.includes(encodeURIComponent('[HAUSBURG Bloxburg] House Build Request: Villa Luminosa')));
});

test('formatClipboardMessage includes folio and key order details', () => {
  const msg = formatClipboardMessage(
    {
      fullName: 'John',
      email: 'john@test.com',
      robloxUsername: 'John99',
      houseId: 'villa-luminosa',
      houseName: 'Villa Luminosa',
      message: 'Ready to build',
    },
    'HAU-VIL-1234'
  );

  assert.ok(msg.includes('HAU-VIL-1234'));
  assert.ok(msg.includes('HAUSBURG'));
  assert.ok(msg.includes('Villa Luminosa'));
  assert.ok(msg.includes('@John99'));
});
