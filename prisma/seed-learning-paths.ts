import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const curatedLearningPaths = [
  {
    name: 'Distributed Systems Fundamentals',
    title: 'Master Distributed Systems Architecture',
    description: 'Master the core concepts of distributed systems architecture, scaling, and reliability',
    targetRole: 'Senior Backend Engineer',
    estimatedDuration: 24, // weeks
    difficulty: 'advanced',
    status: 'draft',
    recommendations: {
      targetSkill: 'Distributed Systems',
      prerequisites: ['System Design', 'Backend Development', 'Networking Basics'],
      outcomes: [
        'Design scalable distributed systems from scratch',
        'Understand CAP theorem and consistency models',
        'Implement fault-tolerant microservices',
        'Master distributed data storage patterns',
      ],
      popularity: 1247,
      aiGenerated: true,
      resources: [
        {
          id: 'res-ds-1',
          title: 'Designing Data-Intensive Applications',
          type: 'book',
          provider: "O'Reilly Media",
          url: 'https://dataintensive.net/',
          duration: '40 hours',
          difficulty: 'advanced',
          rating: 4.8,
          reviewCount: 2340,
          isFree: false,
          price: { amount: 45, currency: 'USD' },
          skills: ['Distributed Systems', 'Database Design', 'System Architecture'],
          description: 'The definitive guide to designing reliable, scalable, and maintainable data systems',
        },
        {
          id: 'res-ds-2',
          title: 'MIT 6.824: Distributed Systems',
          type: 'course',
          provider: 'MIT OpenCourseWare',
          url: 'https://pdos.csail.mit.edu/6.824/',
          duration: '80 hours',
          difficulty: 'advanced',
          rating: 4.9,
          reviewCount: 856,
          isFree: true,
          skills: ['Distributed Systems', 'Consensus Algorithms', 'Fault Tolerance'],
          description: 'Graduate-level course covering distributed system fundamentals, including MapReduce, Raft, and more',
        },
        {
          id: 'res-ds-3',
          title: 'Build a Distributed Key-Value Store',
          type: 'project',
          provider: 'Real-World Projects',
          url: 'https://github.com/topics/distributed-key-value-store',
          duration: '30 hours',
          difficulty: 'advanced',
          isFree: true,
          skills: ['Distributed Systems', 'Golang', 'Raft Consensus'],
          description: 'Hands-on project to implement a distributed key-value store with consensus',
        },
        {
          id: 'res-ds-4',
          title: 'Apache Kafka for Beginners',
          type: 'course',
          provider: 'Udemy',
          url: 'https://www.udemy.com/course/apache-kafka/',
          duration: '25 hours',
          difficulty: 'intermediate',
          rating: 4.7,
          reviewCount: 12050,
          isFree: false,
          price: { amount: 89.99, currency: 'USD' },
          skills: ['Apache Kafka', 'Message Queues', 'Stream Processing'],
          description: 'Learn to build scalable, real-time data pipelines with Apache Kafka',
        },
      ],
    },
  },
  {
    name: 'Technical Leadership Track',
    title: 'Advance Your Engineering Leadership Skills',
    description: 'Develop the leadership and mentorship skills needed for principal engineering roles',
    targetRole: 'Principal Engineer',
    estimatedDuration: 16, // weeks
    difficulty: 'intermediate',
    status: 'draft',
    recommendations: {
      targetSkill: 'Engineering Leadership',
      prerequisites: ['3+ years experience', 'Team collaboration'],
      outcomes: [
        'Lead technical initiatives across multiple teams',
        'Effectively mentor junior and senior engineers',
        'Make architectural decisions with business impact',
        'Build technical roadmaps and drive execution',
      ],
      popularity: 983,
      aiGenerated: true,
      resources: [
        {
          id: 'res-tl-1',
          title: "The Staff Engineer's Path",
          type: 'book',
          provider: "O'Reilly Media",
          url: 'https://www.amazon.com/Staff-Engineers-Path-Individual-Contributors/dp/1098118731',
          duration: '20 hours',
          difficulty: 'intermediate',
          rating: 4.9,
          reviewCount: 567,
          isFree: false,
          price: { amount: 42, currency: 'USD' },
          skills: ['Technical Leadership', 'Career Development', 'Communication'],
          description: 'A guide for individual contributors navigating growth beyond senior roles',
        },
        {
          id: 'res-tl-2',
          title: 'Technical Leadership Masterclass',
          type: 'course',
          provider: 'LinkedIn Learning',
          url: 'https://www.linkedin.com/learning/paths/develop-your-technical-leadership-skills',
          duration: '15 hours',
          difficulty: 'intermediate',
          rating: 4.6,
          reviewCount: 892,
          isFree: false,
          price: { amount: 29.99, currency: 'USD' },
          skills: ['Leadership', 'Mentoring', 'Decision Making'],
          description: 'Develop the skills needed to lead technical teams and drive innovation',
        },
        {
          id: 'res-tl-3',
          title: 'Introduction to Software Product Management',
          type: 'course',
          provider: 'Coursera',
          url: 'https://www.coursera.org/learn/introduction-to-software-product-management',
          duration: '12 hours',
          difficulty: 'beginner',
          rating: 4.6,
          reviewCount: 5423,
          isFree: true,
          skills: ['Management', 'Communication', 'Project Planning'],
          description: 'Learn the fundamentals of leading engineering teams and product development',
        },
        {
          id: 'res-tl-4',
          title: 'System Design for Interviews and Beyond',
          type: 'course',
          provider: 'Udemy',
          url: 'https://www.udemy.com/course/system-design-interview-prep/',
          duration: '10 hours',
          difficulty: 'advanced',
          isFree: false,
          price: { amount: 94.99, currency: 'USD' },
          skills: ['Architecture Review', 'Technical Communication', 'Decision Making'],
          description: 'Master system design and architectural decision-making',
        },
      ],
    },
  },
  {
    name: 'Full-Stack Mastery Path',
    title: 'Become a Complete Full-Stack Developer',
    description: 'Build production-ready applications with modern front-end and back-end technologies',
    targetRole: 'Full Stack Engineer',
    estimatedDuration: 20, // weeks
    difficulty: 'intermediate',
    status: 'draft',
    recommendations: {
      targetSkill: 'Full-Stack Development',
      prerequisites: ['JavaScript fundamentals', 'Basic HTML/CSS'],
      outcomes: [
        'Build full-stack applications with React and Node.js',
        'Design and implement RESTful APIs',
        'Work with both SQL and NoSQL databases',
        'Deploy and maintain production applications',
      ],
      popularity: 2153,
      aiGenerated: true,
      resources: [
        {
          id: 'res-fs-1',
          title: 'The Complete Web Developer Bootcamp',
          type: 'course',
          provider: 'Udemy',
          url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
          duration: '65 hours',
          difficulty: 'beginner',
          rating: 4.7,
          reviewCount: 243567,
          isFree: false,
          price: { amount: 89.99, currency: 'USD' },
          skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
          description: 'Learn full-stack web development from scratch with hands-on projects',
        },
        {
          id: 'res-fs-2',
          title: 'Full Stack Open',
          type: 'course',
          provider: 'University of Helsinki',
          url: 'https://fullstackopen.com/',
          duration: '150 hours',
          difficulty: 'intermediate',
          rating: 4.9,
          reviewCount: 5632,
          isFree: true,
          skills: ['React', 'Node.js', 'MongoDB', 'GraphQL', 'TypeScript'],
          description: 'Deep dive into modern web application development',
        },
        {
          id: 'res-fs-3',
          title: 'Build a Full-Stack E-Commerce Platform',
          type: 'project',
          provider: 'Real-World Projects',
          url: 'https://github.com/topics/ecommerce-project',
          duration: '40 hours',
          difficulty: 'advanced',
          isFree: true,
          skills: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
          description: 'Build and deploy a production-ready e-commerce application',
        },
        {
          id: 'res-fs-4',
          title: 'System Design Interview Vol 1 & 2',
          type: 'book',
          provider: 'ByteByteGo',
          url: 'https://www.amazon.com/System-Design-Interview-insiders-Second/dp/B08CMF2CQF',
          duration: '15 hours',
          difficulty: 'intermediate',
          rating: 4.6,
          reviewCount: 3421,
          isFree: false,
          price: { amount: 35, currency: 'USD' },
          skills: ['System Design', 'Architecture', 'Scalability'],
          description: 'Insider guide to system design interviews for software engineers',
        },
      ],
    },
  },
];

async function seedLearningPaths() {
  console.log('🌱 Starting to seed curated learning paths...');

  try {
    // Note: Since userId is required, we'll create a system user for curated paths
    const SYSTEM_USER_ID = 'system-curated-paths';

    // Create or get system user
    let systemUser = await prisma.user.findUnique({
      where: { id: SYSTEM_USER_ID },
    });

    if (!systemUser) {
      systemUser = await prisma.user.create({
        data: {
          id: SYSTEM_USER_ID,
          name: 'Credably Curated',
          email: 'system@credably.internal',
          emailVerified: new Date(),
        },
      });
      console.log('✅ Created system user for curated paths');
    }

    // Delete existing curated learning paths
    const deleted = await prisma.learningPath.deleteMany({
      where: { 
        userId: SYSTEM_USER_ID,
      },
    });
    console.log(`🗑️  Deleted ${deleted.count} existing curated learning paths`);

    // Create new curated learning paths
    for (const pathData of curatedLearningPaths) {
      const createdPath = await prisma.learningPath.create({
        data: {
          ...pathData,
          userId: SYSTEM_USER_ID, // System user for curated paths
        },
      });
      console.log(`✅ Created learning path: ${createdPath.name}`);
    }

    console.log(`\n🎉 Successfully seeded ${curatedLearningPaths.length} curated learning paths!`);
  } catch (error) {
    console.error('❌ Error seeding learning paths:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedLearningPaths()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

