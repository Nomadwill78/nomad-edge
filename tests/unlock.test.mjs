import { test } from "node:test";
import assert from "node:assert/strict";
import { tokenFor, isUnlocked } from "../src/lib/unlock.ts";
test("paid cookie signing fails closed and rejects tampering", () => {
  const previous = process.env.UNLOCK_SECRET;
  try {
    delete process.env.UNLOCK_SECRET;
    assert.throws(() => tokenFor("38103"), /UNLOCK_SECRET/);
    process.env.UNLOCK_SECRET = "short";
    assert.throws(() => tokenFor("38103"), /UNLOCK_SECRET/);
    process.env.UNLOCK_SECRET = "test-only-".repeat(8);
    const cookie = tokenFor("38103");
    assert.equal(isUnlocked(cookie, "38103"), true);
    assert.equal(isUnlocked(cookie.replace("38103", "38104"), "38104"), false);
    assert.equal(isUnlocked("38103." + "☃".repeat(32), "38103"), false);
    process.env.UNLOCK_SECRET = "rotated-test-only-".repeat(4);
    assert.equal(isUnlocked(cookie, "38103"), false);
  } finally { if (previous === undefined) delete process.env.UNLOCK_SECRET; else process.env.UNLOCK_SECRET = previous; }
});
