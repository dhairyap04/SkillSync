export const splitSkills = (text: string) => [...new Set(text.split(',').map(value => value.trim()).filter(Boolean))]
