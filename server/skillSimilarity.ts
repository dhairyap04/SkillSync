// Curated aliases and related skills; these do not assert equivalent proficiency.
const concepts: Record<string, string[]> = {
  react: ['react', 'react.js', 'reactjs', 'react development'],
  javascript: ['javascript', 'js', 'ecmascript', 'javascript development'],
  typescript: ['typescript', 'ts', 'typescript development'],
  nodejs: ['node.js', 'nodejs', 'node js'],
  python: ['python', 'python3', 'python programming'],
  java: ['java', 'java programming'],
  sql: ['sql', 'structured query language'],
  postgresql: ['postgresql', 'postgres'],
  dataanalysis: ['data analysis', 'data analytics', 'data analyst', 'data analyst career'],
  datascience: ['data science', 'data scientist'],
  machinelearning: ['machine learning', 'ml'],
  frontend: ['frontend', 'front-end', 'front end', 'frontend developer', 'front end developer', 'frontend development'],
  backend: ['backend', 'back-end', 'back end', 'backend development'],
  accessibility: ['accessibility', 'a11y', 'web accessibility', 'accessible design'],
  ux: ['ux', 'ux design', 'user experience', 'user experience design'],
  ui: ['ui', 'ui design', 'user interface', 'user interface design'],
  uiux: ['ui/ux', 'ui/ux design', 'ui ux design'],
  figma: ['figma'], html: ['html', 'html5'], css: ['css', 'css3'],
  pandas: ['pandas'], reactnative: ['react native', 'react-native'],
  cpp: ['c++', 'cpp'], csharp: ['c#', 'csharp'], c: ['c'],
}
export const normalizeText = (value: string) => value.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}+#]+/gu, ' ').trim().replace(/\s+/g, ' ')
const aliases = new Map(Object.entries(concepts).flatMap(([concept, labels]) => labels.map(label => [normalizeText(label), concept] as const)))
export const canonicalSkill = (value: string) => {
  const normalized = normalizeText(value)
  return aliases.get(normalized) ?? normalized
}
const related: [string, string, number][] = [
  ['react', 'javascript', .5], ['react', 'typescript', .45], ['react', 'frontend', .55], ['react', 'reactnative', .55],
  ['nodejs', 'javascript', .55], ['nodejs', 'backend', .55], ['typescript', 'javascript', .6],
  ['frontend', 'html', .5], ['frontend', 'css', .5], ['frontend', 'javascript', .5],
  ['sql', 'postgresql', .65], ['dataanalysis', 'sql', .5], ['dataanalysis', 'pandas', .6],
  ['dataanalysis', 'python', .45], ['datascience', 'dataanalysis', .6], ['datascience', 'python', .5],
  ['datascience', 'machinelearning', .55], ['pandas', 'python', .6],
  ['ux', 'uiux', .75], ['ui', 'uiux', .75], ['ux', 'figma', .4], ['ui', 'figma', .5],
  ['ux', 'accessibility', .4], ['uiux', 'figma', .5],
]
export function skillSimilarity(a: string, b: string): number {
  const left = canonicalSkill(a), right = canonicalSkill(b)
  if (!left || !right) return 0
  if (left === right) return 1
  return related.find(([x, y]) => (x === left && y === right) || (y === left && x === right))?.[2] ?? 0
}
export function matchSkills(wanted: string[], offered: string[]) {
  // Aliases in preferences cannot inflate the denominator or the score.
  const unique = [...new Map(wanted.map(skill => [canonicalSkill(skill), skill])).values()]
  const matches = unique.map(skill => {
    const best = offered.map(expertise => ({ offered: expertise, similarity: skillSimilarity(skill, expertise) }))
      .sort((a, b) => b.similarity - a.similarity || a.offered.localeCompare(b.offered))[0]
    return { wanted: skill, offered: best?.offered ?? '', similarity: best?.similarity ?? 0 }
  })
  return { score: matches.length ? matches.reduce((sum, m) => sum + m.similarity, 0) / matches.length : 0, matches }
}
const stopWords = new Set('a an and are as at be become by can developer engineer for from i in is it learn learning my of on or professional role the to want with work working'.split(' '))
function terms(text: string) {
  let normalized = ` ${normalizeText(text)} `
  for (const [alias, concept] of [...aliases].sort((a, b) => b[0].length - a[0].length)) normalized = normalized.split(` ${alias} `).join(` ${concept} `)
  return normalized.trim().split(/\s+/).filter(term => term && !stopWords.has(term))
}
// TF-IDF corpus fitting + cosine similarity. No network or credential is needed.
export function semanticScores(query: string, corpus: string[]): number[] {
  const documents = corpus.map(terms), queryTerms = terms(query)
  if (!queryTerms.length) return corpus.map(() => 0)
  const frequencies = new Map<string, number>()
  for (const doc of documents) for (const term of new Set(doc)) frequencies.set(term, (frequencies.get(term) ?? 0) + 1)
  function vector(tokens: string[]) {
    const counts = new Map<string, number>()
    for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1)
    return new Map([...counts].map(([term, count]) => [term, (1 + Math.log(count)) * (1 + Math.log((corpus.length + 1) / ((frequencies.get(term) ?? 0) + 1)))]))
  }
  const q = vector(queryTerms), qNorm = Math.sqrt([...q.values()].reduce((sum, v) => sum + v * v, 0))
  return documents.map(doc => {
    const v = vector(doc), norm = Math.sqrt([...v.values()].reduce((sum, n) => sum + n * n, 0))
    if (!norm) return 0
    const dot = [...q].reduce((sum, [term, weight]) => sum + weight * (v.get(term) ?? 0), 0)
    return Math.min(1, dot / (norm * qNorm))
  })
}
