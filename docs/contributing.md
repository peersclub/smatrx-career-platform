# Contributing Guide

## Welcome Contributors! 🎉

Thank you for your interest in contributing to SMATRX V3. This guide will help you get started with contributing to our AI-powered career development platform.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Development Workflow](#development-workflow)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- PostgreSQL 14+
- Git
- Docker (optional)

### Fork and Clone

1. **Fork the repository**
   - Click the "Fork" button on GitHub
   - Clone your fork: `git clone https://github.com/your-username/smatrx-v3.git`
   - Add upstream: `git remote add upstream https://github.com/original-org/smatrx-v3.git`

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

### 1. Install Dependencies

```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install project dependencies
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment file
cp apps/web/.env.example apps/web/.env

# Configure your environment variables
# See Environment Variables section below
```

### 3. Database Setup

```bash
# Start PostgreSQL with Docker
docker run --name smatrx-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=smatrx_db \
  -p 5432:5432 \
  -d postgres:15

# Run database migrations
pnpm db:migrate

# (Optional) Seed development data
pnpm db:seed
```

### 4. Start Development Server

```bash
# Start the development server
pnpm dev

# The application will be available at http://localhost:3002
```

## Environment Variables

### Required for Development

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/smatrx_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3002"
NEXTAUTH_SECRET="your-development-secret"

# OAuth Providers (get from respective platforms)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
LINKEDIN_CLIENT_ID="your-linkedin-client-id"
LINKEDIN_CLIENT_SECRET="your-linkedin-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI (for AI features)
OPENAI_API_KEY="your-openai-api-key"
```

### Getting OAuth Credentials

#### GitHub
1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL: `http://localhost:3002/api/auth/callback/github`

#### LinkedIn
1. Go to LinkedIn Developer Portal
2. Create a new app
3. Add redirect URL: `http://localhost:3002/api/auth/callback/linkedin`

#### Google
1. Go to Google Cloud Console
2. Create credentials → OAuth 2.0 Client ID
3. Add authorized redirect URI: `http://localhost:3002/api/auth/callback/google`

## Project Structure

```
smatrx-v3/
├── apps/
│   └── web/                    # Next.js application
│       ├── app/               # App Router pages
│       ├── components/        # React components
│       ├── lib/              # Utilities and configurations
│       ├── hooks/            # Custom React hooks
│       └── types/            # TypeScript definitions
├── packages/
│   ├── core/                 # Business logic and types
│   └── ui/                   # Shared UI components
├── prisma/                   # Database schema and migrations
├── docs/                     # Documentation
└── .github/                  # GitHub workflows and templates
```

## Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes**
- ✨ **New features**
- 📚 **Documentation improvements**
- 🎨 **UI/UX enhancements**
- ⚡ **Performance optimizations**
- 🧪 **Tests**
- 🔧 **Tooling improvements**

### Before You Start

1. **Check existing issues** - Look for similar issues or feature requests
2. **Discuss major changes** - Open an issue for significant features
3. **Follow the coding standards** - See [Coding Standards](#coding-standards)

### Coding Standards

#### TypeScript

```typescript
// Use explicit types
interface UserProps {
  id: string;
  name: string;
  email?: string;
}

// Use proper error handling
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error('API call failed:', error);
  throw new Error('Failed to fetch data');
}

// Use meaningful variable names
const userSkills = await getUserSkills(userId);
const isAuthenticated = !!session?.user;
```

#### React Components

```typescript
// Use functional components with TypeScript
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
```

#### Database Operations

```typescript
// Use Prisma with proper error handling
export async function getUserSkills(userId: string) {
  try {
    const skills = await prisma.userSkill.findMany({
      where: { userId },
      include: {
        skill: {
          include: {
            category: true,
          },
        },
      },
    });
    return skills;
  } catch (error) {
    console.error('Failed to fetch user skills:', error);
    throw new Error('Database query failed');
  }
}
```

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(auth): add LinkedIn OAuth integration
fix(api): resolve skill import timeout issue
docs(api): update authentication endpoints
style(ui): improve button component styling
```

## Pull Request Process

### Before Submitting

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run tests and linting**
   ```bash
   pnpm test
   pnpm lint
   pnpm type-check
   ```

3. **Test your changes**
   - Test the feature thoroughly
   - Check for edge cases
   - Verify responsive design
   - Test accessibility

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Manual testing completed
- [ ] Accessibility tested

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Responsive design verified
```

### Review Process

1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** by QA team (for major changes)
4. **Approval** from at least one maintainer

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Version: [e.g., 1.0.0]

## Additional Context
Any other relevant information
```

### Feature Requests

Use the feature request template:

```markdown
## Feature Description
Clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this be implemented?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Any other relevant information
```

## Development Workflow

### Feature Development

1. **Create issue** - Document the feature
2. **Assign yourself** - Comment on the issue
3. **Create branch** - `feature/issue-number-description`
4. **Develop** - Implement the feature
5. **Test** - Write tests and test manually
6. **Document** - Update documentation if needed
7. **Submit PR** - Create pull request

### Bug Fixes

1. **Create issue** - Document the bug
2. **Create branch** - `fix/issue-number-description`
3. **Fix** - Implement the fix
4. **Test** - Verify the fix works
5. **Submit PR** - Create pull request

### Documentation

1. **Identify need** - Missing or outdated docs
2. **Create branch** - `docs/description`
3. **Update** - Improve documentation
4. **Review** - Check for accuracy
5. **Submit PR** - Create pull request

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test components/Button.test.tsx
```

### Writing Tests

```typescript
// Component testing
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### API Testing

```typescript
// API route testing
import { createMocks } from 'node-mocks-http';
import handler from '@/app/api/skills/route';

describe('/api/skills', () => {
  it('returns skills for authenticated user', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      headers: {
        cookie: 'next-auth.session-token=valid-token',
      },
    });

    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
  });
});
```

## Performance Guidelines

### Code Splitting

```typescript
// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Use dynamic imports for routes
const SkillsPage = dynamic(() => import('./SkillsPage'), {
  loading: () => <LoadingState />,
});
```

### Database Optimization

```typescript
// Use proper indexes
// Add indexes in Prisma schema
model UserSkill {
  @@index([userId])
  @@index([skillId])
}

// Use select to limit fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});
```

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/avatar.jpg"
  alt="User avatar"
  width={100}
  height={100}
  priority={false}
/>
```

## Accessibility Guidelines

### ARIA Support

```typescript
// Use proper ARIA attributes
<button
  aria-label="Close dialog"
  aria-describedby="dialog-description"
>
  <X className="w-4 h-4" />
</button>
```

### Keyboard Navigation

```typescript
// Handle keyboard events
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleClick();
  }
};
```

### Screen Reader Support

```typescript
// Use semantic HTML
<main>
  <h1>Page Title</h1>
  <section aria-labelledby="skills-heading">
    <h2 id="skills-heading">Skills</h2>
    {/* Skills content */}
  </section>
</main>
```

## Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Notes

Include in PR description:

```markdown
## What's Changed
- Added LinkedIn OAuth integration
- Fixed skill import timeout issue
- Improved button component styling

## Breaking Changes
- None

## Migration Guide
- No migration required
```

## Getting Help

### Resources

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/your-org/smatrx-v3/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-org/smatrx-v3/discussions)
- **Discord**: [Join our Discord](https://discord.gg/smatrx)

### Community Guidelines

1. **Be respectful** - Treat everyone with respect
2. **Be constructive** - Provide helpful feedback
3. **Be patient** - Maintainers are volunteers
4. **Be inclusive** - Welcome newcomers

## Recognition

Contributors will be recognized in:

- **README.md** - Contributor list
- **Release notes** - Feature contributors
- **GitHub** - Contributor graphs
- **Documentation** - Code examples

## Questions?

If you have any questions about contributing, please:

1. Check the [FAQ](./docs/faq.md)
2. Search existing [issues](https://github.com/your-org/smatrx-v3/issues)
3. Start a [discussion](https://github.com/your-org/smatrx-v3/discussions)
4. Join our [Discord](https://discord.gg/smatrx)

Thank you for contributing to SMATRX V3! 🚀
