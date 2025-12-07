# Aelvynor Frontend

Next.js 14 frontend application with TypeScript, Tailwind CSS, and App Router.

## Features

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Responsive Design** - Mobile-first approach
- **SEO Optimized** - Metadata and Open Graph tags
- **API Integration** - Connects to backend at `http://localhost:8000`
- **Error Handling** - Comprehensive error states
- **Loading States** - User-friendly loading indicators
- **Form Validation** - Client-side validation

## Project Structure

```
frontend/
├── app/                    # App Router pages
│   ├── layout.tsx         # Root layout with Navbar/Footer
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── projects/          # Projects listing and detail
│   ├── courses/           # Courses page
│   ├── internships/       # Internships and apply page
│   ├── products/          # Products page
│   ├── contact/           # Contact page
│   └── admin/             # Admin login
├── components/            # Reusable components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── ProjectCard.tsx
│   ├── ProjectGallery.tsx
│   ├── ContactForm.tsx
│   └── ApplyForm.tsx
├── lib/                   # Utilities
│   └── api.ts            # API client with error handling
└── public/               # Static assets
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Backend server running on `http://localhost:8000`

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm run start
```

### Type Checking

```bash
npm run type-check
```

### Linting

```bash
npm run lint
```

## Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Pages

- `/` - Home page with hero and featured projects
- `/about` - About page
- `/projects` - Projects listing
- `/projects/[id]` - Project detail page
- `/courses` - Courses listing
- `/internships` - Internships listing
- `/internships/apply` - Application form
- `/products` - Products listing
- `/contact` - Contact form
- `/admin` - Admin login

## Components

### Navbar
Responsive navigation bar with mobile menu.

### Footer
Site footer with links and copyright.

### Hero
Landing page hero section with call-to-action buttons.

### ProjectCard
Displays project information in a card format.

### ProjectGallery
Fetches and displays a grid of project cards with loading/error states.

### ContactForm
Contact form with client-side validation.

### ApplyForm
Application form with resume upload support.

## API Integration

All API calls are handled through `lib/api.ts` which provides:
- Type-safe API functions
- Error handling
- Loading states
- Centralized configuration

## Styling

- **Tailwind CSS** for utility-first styling
- **Custom colors** - Primary color palette defined in `tailwind.config.js`
- **Responsive breakpoints** - Mobile, tablet, desktop
- **Dark mode ready** - Can be extended with dark mode support

## SEO

Each page includes:
- Dynamic metadata
- Open Graph tags
- Twitter Card tags
- Proper heading hierarchy

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

[Add your license here]

