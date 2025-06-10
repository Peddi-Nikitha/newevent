# Database Setup Instructions

This directory contains scripts to set up the database for the Happy Happenings application.

## SQL Script Method (Recommended)

The simplest way to set up the database is to use the SQL script directly with a PostgreSQL client.

### Using the SQL Script (`setup_db.sql`)

1. **With pgAdmin:**
   - Open pgAdmin and connect to your PostgreSQL server
   - Create a new database called "happy_happenings"
   - Right-click on the database and select "Query Tool"
   - Open the `setup_db.sql` file
   - Click "Execute" to run the script

2. **With psql command line:**
   ```bash
   # First create the database
   createdb happy_happenings
   
   # Then run the script
   psql -d happy_happenings -f setup_db.sql
   ```

3. **With a cloud database like Neon DB:**
   - Create a new database in your dashboard
   - Find the SQL Editor or Query interface
   - Copy and paste the contents of `setup_db.sql`
   - Execute the script

## Python Script Method

There are also Python scripts available if you prefer a programmatic approach.

### Using `db_setup.py` (Environment Variable Method)

1. Create a `.env` file in the project root with your database connection:
   ```
   DATABASE_URL="postgresql://username:password@hostname:port/database"
   ```

2. Install required packages:
   ```bash
   pip install -r scripts/requirements.txt
   ```

3. Run the setup script:
   ```bash
   python scripts/db_setup.py
   ```

### Using `db_setup_direct.py` (Hardcoded Connection Method)

1. Edit `db_setup_direct.py` and update the `DB_URL` variable with your database connection string.

2. Install required packages:
   ```bash
   pip install -r scripts/requirements.txt
   ```

3. Run the direct setup script:
   ```bash
   python scripts/db_setup_direct.py
   ```

## Windows Batch Files

For Windows users, there are also batch files to run the scripts:

- `setup_db.bat` - Uses environment variables
- `setup_db_direct.bat` - Uses hardcoded connection string

## Table Structure

The database consists of the following tables:
- `users` - User accounts (customers, vendors, admins)
- `vendors` - Vendor business profiles
- `services` - Services offered by vendors
- `events` - Events created by customers
- `event_vendors` - Bookings connecting events with vendors' services
- `reviews` - Customer reviews for vendors

See the `SCHEMA.md` file in the project root for detailed table structures. 