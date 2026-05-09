# NeuralNexus

A modern hackathon management platform built with Next.js and Supabase.

## Features

- **Multi-role Access**: Admin, Judge, and User dashboards.
- **Team Management**: Create teams, join with invite codes.
- **Submissions**: Track project submissions and judging scores.
- **Payments**: Integrated with Razorpay for registrations.

## Prerequisites

- Node.js (v18 or higher)
- Supabase Account
- Razorpay Account (optional for testing payments)

## Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd NeuralNexus
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Variables**:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Supabase Setup**:
   - Create a new project in Supabase.
   - Run the SQL schema found in `docs/supabase_schema.md` in the Supabase SQL Editor.
   - Enable Email Auth or any other providers you wish to use.

5. **Run the development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Documentation

- [Supabase Schema](docs/supabase_schema.md)
- [Architecture & Safeguards](docs/architecture%20and%20safeguards.pdf)

