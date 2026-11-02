import type { RoadmapTemplate } from '../src/types/growth.js'
export const roadmapTemplates: RoadmapTemplate[] = [
  { id: 'frontend', title: 'Frontend developer', description: 'Build, test, and present a usable web application.', steps: [
    { title: 'Build the foundations', description: 'Create an accessible page with semantic HTML and responsive CSS.', milestones: ['Build a responsive page', 'Check keyboard navigation'] },
    { title: 'Ship an interactive project', description: 'Build a React application with state, forms, and an API.', milestones: ['Implement a form with validation', 'Connect an API and handle errors'] },
    { title: 'Get mentor feedback', description: 'Ask your mentor for a practical challenge and revise your project.', milestones: ['Submit a working project', 'Address mentor feedback'] },
    { title: 'Present your evidence', description: 'Explain decisions, test the project, and publish reviewed work.', milestones: ['Write a project explanation', 'Publish your skill passport'] },
  ] },
  { id: 'data', title: 'Data analyst', description: 'Turn a dataset into a reproducible analysis and clear recommendations.', steps: [
    { title: 'Explore and clean data', description: 'Choose a public dataset and document quality issues.', milestones: ['Define an analysis question', 'Document cleaning decisions'] },
    { title: 'Analyze and visualize', description: 'Use SQL or Python to answer the question with clear charts.', milestones: ['Write reproducible queries', 'Create an accessible chart'] },
    { title: 'Validate with a mentor', description: 'Review assumptions and address analytical feedback.', milestones: ['Submit the analysis', 'Revise the conclusions'] },
    { title: 'Share your findings', description: 'Publish a concise case study supported by reviewed evidence.', milestones: ['Explain limitations', 'Publish your skill passport'] },
  ] },
  { id: 'product', title: 'Product designer', description: 'Research a problem, prototype a solution, and validate the design.', steps: [
    { title: 'Understand the problem', description: 'Define a user group and gather observations with consent.', milestones: ['Write a problem statement', 'Summarize user needs'] },
    { title: 'Prototype a solution', description: 'Explore alternatives and create an accessible prototype.', milestones: ['Sketch alternatives', 'Build a prototype'] },
    { title: 'Test and iterate', description: 'Collect usability feedback and request a mentor review.', milestones: ['Run a usability walkthrough', 'Address review feedback'] },
    { title: 'Publish a case study', description: 'Explain your decisions and attach reviewed evidence.', milestones: ['Document design decisions', 'Publish your skill passport'] },
  ] },
]
