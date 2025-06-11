export type ProjectContext = {
  slug: string;
  title: string;
  role: string;
  techStack: string[];
  summary: string;
  challenges: string[];
  learnings?: string[];
};

export const projects: ProjectContext[] = [
  {
    slug: 'sample-project',
    title: 'Sample Project',
    role: 'Frontend Developer',
    techStack: ['Next.js', 'TypeScript', 'Emotion'],
    summary: 'An example project showcasing frontend skills.',
    challenges: ['Implementing dynamic UI', 'Ensuring responsiveness'],
    learnings: ['Better state management', 'Improved testing'],
  },
  {
    slug: 'awesome-app',
    title: 'Awesome App',
    role: 'Full Stack Developer',
    techStack: ['React', 'Node.js'],
    summary: 'A cool application that does awesome things.',
    challenges: ['API integrations', 'Performance tuning'],
  },
];

export function getProjectContext(slug: string): string {
  const project = projects.find(p => p.slug === slug);
  if (!project) return '';

  let context = `Title: ${project.title}\nRole: ${project.role}\nTech Stack: ${project.techStack.join(', ')}\nSummary: ${project.summary}\nChallenges: ${project.challenges.join('; ')}`;

  if (project.learnings && project.learnings.length > 0) {
    context += `\nLearnings: ${project.learnings.join('; ')}`;
  }

  return context;
}
