# @path-to-glory/frontend

Mobile-first React frontend for Path to Glory Campaign Tracker.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and builds
- **Apollo Client** for GraphQL data fetching
- **TailwindCSS** for mobile-first responsive UI
- **React Router** for navigation

## Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint
npm run lint

# Generate GraphQL types
npm run codegen
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `VITE_GRAPHQL_ENDPOINT` - GraphQL API endpoint
- `VITE_AWS_REGION` - AWS region for Cognito
- `VITE_COGNITO_USER_POOL_ID` - Cognito User Pool ID
- `VITE_COGNITO_CLIENT_ID` - Cognito App Client ID

## Features

### Phase 1: Roster Management

- ✅ View all armies
- ✅ Create new army with faction selection
- ✅ View army roster (Order of Battle)
- ⏳ Add/edit units
- ⏳ Track Glory Points and Renown
- ⏳ Manage enhancements and path abilities

### Future Phases

- Campaign management
- Battle recording
- Quest tracking
- Google OAuth authentication

## Mobile-First Design

All components are designed mobile-first with responsive breakpoints:
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components (routes)
├── lib/            # Utilities (Apollo Client, etc.)
├── hooks/          # Custom React hooks
├── styles/         # Global styles and Tailwind config
└── gql/            # Generated GraphQL types (from codegen)
```
