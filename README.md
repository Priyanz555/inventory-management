# InvMgmt - Inventory Management System

A modern inventory management system built with Next.js 14, TypeScript, Tailwind CSS, and Shadcn UI.

## Features

- 🎨 **Modern UI**: Beautiful and responsive design using Shadcn UI components
- 📱 **Mobile Responsive**: Works perfectly on desktop, tablet, and mobile devices
- 🧭 **Side Navigation**: Collapsible sidebar with navigation menu
- 📊 **Dashboard**: Comprehensive dashboard with stats, recent activity, and alerts
- ⚡ **Fast Performance**: Built with Next.js 14 App Router for optimal performance
- 🎯 **TypeScript**: Full TypeScript support for better development experience

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd InvMgmt
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
InvMgmt/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles and Tailwind directives
│   │   ├── layout.tsx           # Root layout with navigation
│   │   └── page.tsx             # Landing page (Dashboard)
│   ├── components/
│   │   ├── ui/                  # Shadcn UI components
│   │   │   ├── button.tsx
│   │   │   └── card.tsx
│   │   └── layout.tsx           # Main layout component
│   └── lib/
│       └── utils.ts             # Utility functions
├── public/                      # Static assets
├── tailwind.config.js           # Tailwind configuration
├── next.config.js               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Navigation

The application includes a responsive sidebar navigation with the following sections:

- **Dashboard** - Main landing page with overview
- **Inventory** - Manage inventory items
- **Customers** - Customer management
- **Reports** - Analytics and reports
- **Documents** - Document management
- **Settings** - Application settings

## Customization

### Adding New Pages

1. Create a new file in `src/app/` (e.g., `src/app/inventory/page.tsx`)
2. Add the route to the navigation array in `src/components/layout.tsx`

### Styling

The application uses Tailwind CSS with custom CSS variables for theming. You can customize:

- Colors in `src/app/globals.css`
- Tailwind configuration in `tailwind.config.js`
- Component styles in individual component files

### Adding New Components

1. Create new components in `src/components/`
2. For UI components, use the existing Shadcn UI components as a base
3. Import and use in your pages

## Deployment

The application can be deployed to various platforms:

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Deploy the .next folder
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Support

For support and questions, please open an issue in the repository. 