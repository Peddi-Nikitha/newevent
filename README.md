# Happy Happenings

Happy Happenings is a full-stack Next.js application that connects customers with vendors for event planning, such as weddings, birthdays, corporate events, and more.

## Features

- **User Authentication**: Sign up and log in as a customer or vendor
- **Vendor Profiles**: Browse and filter vendors by category, location, and price range
- **Event Planning**: Create events and browse vendors for your specific event needs
- **Reviews and Ratings**: Read and leave reviews for vendors
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel (planned)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/happy-happenings.git
   cd happy-happenings
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/happy_happenings"
   NEXTAUTH_SECRET="your-secret-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Set up the database:
   ```bash
   # Run migrations
   npx prisma migrate dev
   
   # Or use the Python script for custom setup
   cd scripts
   pip install -r requirements.txt
   python db_setup.py
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Project Structure

- `/app`: App Router pages and API routes
- `/components`: Reusable UI components
- `/lib`: Utility functions and custom hooks
- `/prisma`: Database schema and migrations
- `/public`: Static assets
- `/scripts`: Database setup and seed scripts
- `/styles`: Global styles

## Database Schema

The application uses a PostgreSQL database with the following main models:
- Users (customers, vendors, admins)
- Vendors (business profiles)
- Services (offered by vendors)
- Events (created by customers)
- Event Vendors (bookings/connections between events and vendors)
- Reviews

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Next.js team for the amazing framework
- Vercel for the deployment platform
- All the open-source projects that made this possible
