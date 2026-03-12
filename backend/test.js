// Simple tests without any testing library
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.log(`❌ FAIL: ${name} — ${err.message}`);
    failed++;
  }
}

function expect(value) {
  return {
    toBe(expected) {
      if (value !== expected) {
        throw new Error(`Expected ${expected} but got ${value}`);
      }
    },
    toBeGreaterThan(expected) {
      if (value <= expected) {
        throw new Error(`Expected ${value} to be greater than ${expected}`);
      }
    },
    toBeTruthy() {
      if (!value) {
        throw new Error(`Expected truthy value but got ${value}`);
      }
    }
  };
}

// ─── Your actual tests ───────────────────────────

test('adds two numbers correctly', () => {
  expect(1 + 1).toBe(2);
});

test('string is not empty', () => {
  const note = 'Hello world';
  expect(note.length).toBeGreaterThan(0);
});

test('note object has required fields', () => {
  const note = { id: 1, text: 'Buy groceries' };
  expect(note.id).toBeTruthy();
  expect(note.text).toBeTruthy();
});

test('empty string is invalid note', () => {
  const text = '';
  expect(text.trim().length).toBe(0);
});

// ─── Results ─────────────────────────────────────
console.log(`\n${passed + failed} tests — ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1); // tells GitHub Actions: something failed!
}