#!/usr/bin/env node
// Checks that the website (data.js) and the CV PDF (assets/) say the same things.
// Usage: node tools/check-cv-sync.mjs   (needs `pdftotext` from poppler)
// Exit code 1 when anything on the site is missing from the CV.
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import vm from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const ctx = { window: {} };
vm.runInNewContext(readFileSync(join(root, "data.js"), "utf8"), ctx);
const S = ctx.window.SITE;

// Flatten both sides the same way: one line, single spaces, and no hyphens or dashes at all,
// because pdftotext silently drops a hyphen that falls at a line break.
const norm = (t) =>
  String(t)
    .replace(/[‐-―-]/g, "")
    .replace(/[“”]/g, '"')
    .replace(/’/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
const cv = norm(execFileSync("pdftotext", [join(root, S.cv.file), "-"], { encoding: "utf8" }));

const problems = [];
const expect = (label, text) => {
  const t = norm(String(text).replace(/\.$/, ""));
  if (t && !cv.includes(t)) problems.push(`${label}: "${text}"`);
};

expect("CV date", `Updated ${S.cv.updated}`);
S.keywords.forEach((k) => expect("Research interest", k));
S.publications.forEach((p) => {
  expect(`[${p.id}] title`, p.title);
  expect(`[${p.id}] venue`, p.venue);
  expect(`[${p.id}] status`, p.status);
  if (p.link) expect(`[${p.id}] link label`, p.link.label);
});
S.research.forEach((r) => {
  expect("Research title", r.title);
  expect(`${r.title} dates`, r.dates);
  r.meta.split(/\s[·|]\s/).forEach((part) => expect(`${r.title} meta`, part));
  r.bullets.forEach((b) => expect(`${r.title} bullet`, b));
});
S.education.forEach((e) => {
  expect("School", e.school);
  expect(`${e.school} dates`, e.dates);
  e.coursework.forEach((c) => expect("Coursework", c));
});
S.industry.forEach((j) => {
  expect("Role", j.role);
  expect(`${j.role} dates`, j.dates);
  j.bullets.forEach((b) => expect(`${j.role} bullet`, b));
});
S.honors.forEach((h) => {
  expect("Honor", h.title);
  expect(`${h.title} detail`, h.detail);
});
S.skills.forEach((s) => s.items.forEach((i) => expect(`Skill (${s.label})`, i)));

if (problems.length) {
  console.log(`${problems.length} item(s) on the site were not found in the CV PDF:\n`);
  problems.forEach((p) => console.log("  - " + p));
  process.exit(1);
}
console.log(`In sync: every site item checked appears in ${S.cv.file}.`);
