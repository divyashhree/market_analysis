# Contributing to Macro Market Analyzer

Thank you for your interest in contributing! This is an educational project, and we welcome contributions from the community.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow project guidelines

## How to Contribute

### Reporting Bugs

1. Check if the issue already exists
2. Use the issue template
3. Provide detailed information:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Environment details (OS, browser, Node version)

### Suggesting Features

1. Check existing feature requests
2. Describe the feature clearly
3. Explain the use case
4. Consider educational value
5. Discuss implementation approach

### Pull Requests

1. **Fork the repository**
```bash
git clone https://github.com/your-username/macro-market-analyzer.git
cd macro-market-analyzer
```

2. **Create a branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed
   - Test thoroughly

4. **Commit your changes**
```bash
git add .
git commit -m "Add: Brief description of changes"
```

Use conventional commits:
- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Changes to existing functionality
- `Docs:` Documentation changes
- `Style:` Code style changes
- `Refactor:` Code refactoring
- `Test:` Test-related changes

5. **Push to your fork**
```bash
git push origin feature/your-feature-name
```

6. **Create Pull Request**
   - Describe your changes
   - Reference related issues
   - Add screenshots if UI changes
   - Wait for review

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Setup
```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start development servers
cd backend && npm run dev
cd ../frontend && npm run dev
```

### Testing Your Changes

Before submitting:
- [ ] Code runs without errors
- [ ] No console warnings
- [ ] Features work as expected
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] No TypeScript errors
- [ ] Follows existing patterns

## Code Style Guidelines

### TypeScript/JavaScript
- Use TypeScript for frontend
- Use ES6+ features
- Async/await for promises
- Descriptive variable names
- Add JSDoc comments for functions

Example:
```typescript
/**
 * Calculate Pearson correlation coefficient
 * @param x - First array of numbers
 * @param y - Second array of numbers
 * @returns Correlation coefficient between -1 and 1
 */
function calculateCorrelation(x: number[], y: number[]): number {
  // Implementation
}
```

### React Components
- Use functional components
- Use TypeScript interfaces for props
- Implement proper error handling
- Add loading states

Example:
```typescript
interface ChartProps {
  data: DataPoint[];
  title: string;
  color: string;
}

export default function Chart({ data, title, color }: ChartProps) {
  if (!data || data.length === 0) {
    return <div>No data available</div>;
  }
  
  // Component logic
}
```

### CSS/Styling
- Use Tailwind utility classes
- Follow responsive-first approach
- Maintain dark mode compatibility
- Keep consistent spacing

### Backend
- Validate all inputs
- Use proper HTTP status codes
- Implement error handling
- Add request logging
- Cache expensive operations

## Project Structure

```
frontend/
├── app/              # Next.js pages
├── components/       # React components
└── lib/              # Utilities and types

backend/
├── src/
│   ├── controllers/  # Request handlers
│   ├── services/     # Business logic
│   ├── routes/       # API routes
│   └── data/         # CSV files
```

## Areas for Contribution

### High Priority
- [ ] Additional data visualizations
- [ ] More statistical analyses
- [ ] Enhanced mobile experience
- [ ] Performance optimizations
- [ ] Better error messages

### Medium Priority
- [ ] Unit tests
- [ ] Integration tests
- [ ] Accessibility improvements
- [ ] SEO enhancements
- [ ] Additional data sources

### Low Priority
- [ ] Animation improvements
- [ ] Additional themes
- [ ] Internationalization
- [ ] Print-friendly views
- [ ] PDF export

## Documentation

When adding features, update:
- README.md (if major feature)
- API_DOCUMENTATION.md (if API changes)
- Code comments
- TypeScript interfaces
- Component props documentation

## Questions?

- Open an issue for discussion
- Check existing documentation
- Review closed issues/PRs
- Ask in pull request comments

## Recognition

Contributors will be acknowledged in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Macro Market Analyzer! 🎉
