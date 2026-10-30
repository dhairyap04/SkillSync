import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import ts from 'typescript'

// Exercise the actual TypeScript implementation without a second test toolchain.
const source = readFileSync(new URL('../src/lib/mentorFilters.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 },
})
const { filterMentors } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)

const mentors = [
  { name: 'Alex', company: 'Google', skills: ['Leadership'], experienceYears: 8, availabilityValue: 'this-week', hourlyRate: 120 },
  { name: 'Sarah', company: 'Figma', skills: ['UI/UX Design'], experienceYears: 6, availabilityValue: 'immediate', hourlyRate: 95 },
  { name: 'Michael', company: 'Microsoft', skills: ['React', 'TypeScript'], experienceYears: 10, availabilityValue: 'next-week', hourlyRate: 110 },
  { name: 'Emily', company: 'Netflix', skills: ['Python'], experienceYears: 7, availabilityValue: 'flexible', hourlyRate: 130 },
]
const defaults = { searchTerm: '', selectedSkills: [], selectedExperience: '', selectedAvailability: '', priceRange: [0, 200] }
const find = (overrides = {}, data = mentors) => filterMentors(data, { ...defaults, ...overrides }).map(mentor => mentor.name)

test('empty filters preserve all mentors and input order', () => {
  assert.deepEqual(find(), ['Alex', 'Sarah', 'Michael', 'Emily'])
})
test('experience selections match years instead of display text', () => {
  assert.deepEqual(find({ selectedExperience: 'mid' }), ['Sarah', 'Emily'])
  assert.deepEqual(find({ selectedExperience: 'senior' }), ['Alex', 'Michael', 'Emily'])
  assert.deepEqual(find({ selectedExperience: 'executive' }), ['Michael'])
  assert.deepEqual(find({ selectedExperience: 'junior' }), [])
})
test('experience boundaries follow the displayed inclusive ranges', () => {
  const data = [0, 1, 3, 7, 10].map(years => ({ ...mentors[0], name: String(years), experienceYears: years }))
  assert.deepEqual(find({ selectedExperience: 'junior' }, data), ['1', '3'])
  assert.deepEqual(find({ selectedExperience: 'mid' }, data), ['3', '7'])
  assert.deepEqual(find({ selectedExperience: 'senior' }, data), ['7', '10'])
  assert.deepEqual(find({ selectedExperience: 'executive' }, data), ['10'])
})
test('each availability selection returns its matching mentor', () => {
  for (const mentor of mentors) {
    assert.deepEqual(find({ selectedAvailability: mentor.availabilityValue }), [mentor.name])
  }
})
test('search matches names, skills and companies regardless of case or outer spaces', () => {
  assert.deepEqual(find({ searchTerm: ' aLeX ' }), ['Alex'])
  assert.deepEqual(find({ searchTerm: 'typescript' }), ['Michael'])
  assert.deepEqual(find({ searchTerm: ' FIGMA ' }), ['Sarah'])
  assert.deepEqual(find({ searchTerm: '   ' }), find())
})
test('skills accept any selected skill', () => {
  assert.deepEqual(find({ selectedSkills: ['React', 'Python'] }), ['Michael', 'Emily'])
  assert.deepEqual(find({ selectedSkills: ['Java'] }), [])
})
test('price range includes endpoints and excludes out of range mentors', () => {
  assert.deepEqual(find({ priceRange: [110, 120] }), ['Alex', 'Michael'])
  assert.deepEqual(find({ priceRange: [0, 90] }), [])
})
test('all active filters combine and clearing them restores results', () => {
  assert.deepEqual(find({ searchTerm: 'Microsoft', selectedSkills: ['React'], selectedExperience: 'senior', selectedAvailability: 'next-week', priceRange: [100, 110] }), ['Michael'])
  assert.deepEqual(find({ selectedExperience: 'executive', selectedAvailability: 'immediate' }), [])
  assert.equal(find().length, 4)
})
