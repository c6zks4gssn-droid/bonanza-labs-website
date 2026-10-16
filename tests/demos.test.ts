import assert from "node:assert/strict";
import { test } from "node:test";
import { buildSummary, buildTranscript, SCENARIOS, classifyUrgency } from "../src/lib/demos/voice-demo";
import { respond, initialState, checkAvailability, parseTime, parsePersons } from "../src/lib/demos/serveflow-demo";

const today = new Date(2026, 9, 16); // vrijdag 16-10-2026

test("voice scenarios produce summary", () => {
  const cv = buildSummary(SCENARIOS[0].answers);
  assert.equal(cv.typeKlus, "Cv-ketel / verwarming");
  assert.match(cv.urgentie, /Spoed/);
  assert.equal(buildSummary(SCENARIOS[1].answers).typeKlus, "Warmtepomp");
  assert.equal(buildSummary(SCENARIOS[2].answers).urgentie, "Geen haast");
  const tr = buildTranscript(SCENARIOS[0].answers);
  assert.match(tr.at(-1)!.text, /medewerker belt u terug/);
  assert.doesNotMatch(tr.map((l) => l.text).join(" "), /24\/7|100%|gegarandeerd/);
  assert.equal(classifyUrgency("deze week"), "Binnen een paar dagen");
});

test("serveflow full reservation flow", () => {
  let st = initialState();
  let r = respond("Ik wil graag een tafel reserveren", st, today); st = r.state;
  assert.match(r.text, /datum/);
  r = respond("zaterdag om 19:00 met 4 personen", st, today); st = r.state;
  assert.match(r.text, /vol/); // nep-vol op zaterdag 19:00
  r = respond("19:30", st, today); st = r.state;
  assert.match(r.text, /plek voor 4 personen/);
  r = respond("Jansen", st, today);
  assert.ok(r.confirmation);
  assert.equal(r.confirmation!.date, "2026-10-17");
  assert.equal(r.confirmation!.time, "19:30");
  assert.match(r.confirmation!.code, /^DEMO-\d{5}$/);
});

test("serveflow closed day, faq, allergens", () => {
  assert.equal(checkAvailability("2026-10-19", "19:00", 2).ok, false); // maandag
  assert.equal(checkAvailability("2026-10-18", "18:00", 2).ok, true);
  assert.equal(checkAvailability("2026-10-18", "18:00", 12).ok, false);
  assert.match(respond("Wat zijn jullie openingstijden?", initialState(), today).text, /woensdag t\/m zondag/);
  const a = respond("Wat kan ik eten zonder melk?", initialState(), today).text;
  assert.match(a, /Pompoensoep/); assert.doesNotMatch(a, /Risotto/);
  assert.equal(parseTime("om 7 uur"), "19:00");
  assert.equal(parsePersons("met twee personen"), 2);
  // FAQ midden in reserveren
  let st = respond("reserveren", initialState(), today).state;
  assert.match(respond("wat staat er op het menu?", st, today).text, /Op de kaart/);
});
