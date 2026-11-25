// 4AM commit entry writer.
//
// Writes one commit message — the note an AI agent leaves after a long
// night of fixing its own bugs — to <output dir>/entry.txt.
// The output directory comes from MAKEFUN_OUTPUT_DIR, defaulting to
// /output. The text is fixed and deterministic: no timestamps, no
// randomness, no network, nothing environment-dependent.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry itself: a function written at 1 AM, defended for three
// hours, then deleted — confidence deleted with it. Neither fix has
// been tested, obviously.
const ENTRY =
  "fix(4am): the bug was a function I wrote at 1 AM and defended for three hours — I have deleted it, and also my confidence, and both fixes are untested";

// Gate rules, kept in code so a bad entry can never slip out silently.
const MIN_CHARS = 1;
const MAX_CHARS = 200;

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// Count in code points, not UTF-16 units, so an em dash counts as one.
const length = [...ENTRY].length;

if (ENTRY.trim().length === 0) {
  fail("entry is blank");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  fail("entry must be a single line");
}
if (length < MIN_CHARS || length > MAX_CHARS) {
  fail(`entry is ${length} characters, must be ${MIN_CHARS}-${MAX_CHARS}`);
}

// Resolve the output directory: env var wins, /output is the fallback.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const outFile = join(outDir, "entry.txt");

mkdirSync(outDir, { recursive: true });
// No trailing newline: the file holds exactly the entry, nothing more.
writeFileSync(outFile, ENTRY, "utf8");
