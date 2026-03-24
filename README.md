# Ekimedo Atelier

**Where luxury meets timeless designs**

Custom Bridal dresses, Robes, and Evening Gowns for your special occasions!

## Overview

Ekimedo Atelier is a premium ecommerce platform specializing in bespoke fashion items. The website offers customers the ability to browse collections, customize orders, schedule consultations, and purchase high-end fashion items online.

## Technology Stack

### Frontend Framework
- **Next.js 16** - React-based framework for production-ready applications with App Router
- **React 19** - Latest version of the popular JavaScript library for building user interfaces
- **TypeScript** - Strongly typed programming language that builds on JavaScript

### Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework for rapid UI development
- **Shadcn/ui** - Reusable component library built with Radix UI and Tailwind CSS
- **Radix UI** - Unstyled, accessible UI components
- **Lucide React** - Beautiful & consistent icon toolkit
- **Framer Motion** - Production-ready motion library for React

### Backend & Services
- **Sanity CMS** - Headless CMS for managing content, products, and site data
- **Stripe** - Payment processing for credit card transactions
- **PayPal** - Alternative payment processing option
- **Clerk** - Authentication and user management
- **Resend** - Email delivery service for transactional emails

### Development & Tooling
- **PNPM** - Fast, disk space efficient package manager
- **ESLint** - Code quality and linting
- **Prettier** - Code formatting
- **Vercel** - Deployment platform (inferred from Next.js configuration)

### Key Features
- Custom product browsing and filtering
- Shopping cart functionality with Zustand state management
- Secure checkout with multiple payment options
- Customer consultation scheduling
- Testimonial submission system
- Order management and tracking
- Responsive design for all device sizes
- Dark mode support

## Architecture Highlights

The application follows modern React best practices with a component-driven architecture. Key architectural decisions include:

- **Server Components** - Leveraging Next.js 16's RSC for optimal performance
- **Typed Routes** - Using Next.js typed routes for type-safe navigation
- **Environment Variables** - Secure configuration management with @t3-oss/env-nextjs
- **Zod Validation** - Form validation and data parsing
- **React Hook Form** - Performant, flexible forms with easy validation
- **Zustand** - Lightweight state management for the shopping cart

## Getting Started

To run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Environment Variables

The application requires several environment variables to be set. Refer to `.env.example` for the complete list of required variables.

## Deployment

The application is designed for deployment on Vercel, taking advantage of Next.js's seamless integration with the platform.