# Convex Backend for PitchLink Owner App

This directory contains the Convex backend for the PitchLink Owner application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Initialize Convex project:
```bash
npx convex dev
```

## Structure

- `convex/` - Convex functions and schema
- `convex/schema.ts` - Database schema definition
- `convex/auth.ts` - Authentication functions
- `convex/pitches.ts` - Pitch management functions
- `convex/bookings.ts` - Booking management functions
- `convex/payments.ts` - Payment processing functions
- `convex/analytics.ts` - Analytics functions