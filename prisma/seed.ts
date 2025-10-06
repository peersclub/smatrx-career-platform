import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  // Create default skill categories
  const categories = [
    { name: 'Programming Languages', slug: 'programming-languages', color: '#8B5CF6' },
    { name: 'Frameworks & Libraries', slug: 'frameworks-libraries', color: '#EC4899' },
    { name: 'Databases', slug: 'databases', color: '#06B6D4' },
    { name: 'Cloud & DevOps', slug: 'cloud-devops', color: '#10B981' },
    { name: 'Data Science & ML', slug: 'data-science-ml', color: '#F59E0B' },
    { name: 'Design & UX', slug: 'design-ux', color: '#EF4444' },
    { name: 'Project Management', slug: 'project-management', color: '#3B82F6' },
    { name: 'Soft Skills', slug: 'soft-skills', color: '#6366F1' },
    { name: 'Tools & Software', slug: 'tools-software', color: '#8B5CF6' },
  ];

  for (const category of categories) {
    await prisma.skillCategory.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('✅ Skill categories seeded');

  // Create some common career roles
  const roles = [
    {
      title: 'Frontend Developer',
      slug: 'frontend-developer',
      description: 'Build user interfaces with modern web technologies',
      level: 'mid',
      typicalSalary: { min: 80000, max: 150000, median: 110000, currency: 'USD' },
      remoteAvailable: true,
    },
    {
      title: 'Backend Developer',
      slug: 'backend-developer',
      description: 'Design and implement server-side applications and APIs',
      level: 'mid',
      typicalSalary: { min: 90000, max: 160000, median: 120000, currency: 'USD' },
      remoteAvailable: true,
    },
    {
      title: 'Full Stack Developer',
      slug: 'full-stack-developer',
      description: 'Work on both frontend and backend of web applications',
      level: 'mid',
      typicalSalary: { min: 95000, max: 170000, median: 130000, currency: 'USD' },
      remoteAvailable: true,
    },
    {
      title: 'Data Scientist',
      slug: 'data-scientist',
      description: 'Analyze complex data and build predictive models',
      level: 'mid',
      typicalSalary: { min: 100000, max: 180000, median: 140000, currency: 'USD' },
      remoteAvailable: true,
    },
    {
      title: 'DevOps Engineer',
      slug: 'devops-engineer',
      description: 'Manage infrastructure and deployment pipelines',
      level: 'mid',
      typicalSalary: { min: 95000, max: 175000, median: 135000, currency: 'USD' },
      remoteAvailable: true,
    },
  ];

  for (const role of roles) {
    await prisma.careerRole.upsert({
      where: { slug: role.slug },
      update: {},
      create: role,
    });
  }

  console.log('✅ Career roles seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
