# Step-by-Step Setup & Running Instructions
1. Prerequisites

Node.js (v20+): Download from nodejs.org.
PostgreSQL DB on Neon:
Sign up at neon.tech (free tier).
Create a project/database.
Get the connection string (e.g., postgres://user:pass@ep-neon-host.neon.tech/neondb?sslmode=require).

Cloudinary Account:
Sign up at cloudinary.com (free).
Get Cloud Name, API Key, API Secret from dashboard.

Git (optional) for version control.

2. Installation

Create the project folder: mkdir domfin-backend && cd domfin-backend.
Create .env from .env.example and fill in values (see below).
Install dependencies: npm install (or yarn install if you prefer Yarn).

3. Configure Environment (.env)
Copy .env.example to .env and edit:
text# Database (Neon PostgreSQL)
DATABASE_URL=postgres://your_neon_user:your_neon_pass@your-neon-host.neon.tech/your_db_name?sslmode=require

# JWT for auth
JWT_SECRET=your_super_secret_key_here  # Generate a strong one, e.g., via openssl rand -hex 32

# Cloudinary for images
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# App
PORT=3000
ADMIN_EMAIL=admin@domfin.co.ke
ADMIN_PASSWORD=supersecurepassword123  # CHANGE THIS IMMEDIATELY!

# Optional: IP whitelist (comma-separated, e.g., 192.168.1.1,8.8.8.8)
ALLOWED_IPS=
Security Note: Never commit .env to git. Change the admin password ASAP. For extra security, add your IP to ALLOWED_IPS and enable IP check in middleware.
4. Database Setup

Connect to your Neon DB (via psql or Neon's console).
Run the SQL schema from below (in README.md or directly).
Insert initial admin user (or handle in code on first run).

5. Running Locally

Start the server: npm start (or nodemon src/app.js for dev with auto-reload — install nodemon globally).
API available at http://localhost:3000/api/*.
Admin Panel: http://localhost:3000/admin (login with admin credentials).
Test: Use Postman or curl for endpoints.

6. Deployment

Recommended: Render.com (free tier for Node.js):
Create a Web Service.
Connect Git repo.
Set env vars in dashboard.
Build command: npm install.
Start command: node src/app.js.

Vercel: For serverless, but adjust for AdminJS (it's stateful).
Neon DB scales automatically.
Domain: Use a custom domain if needed; secure with HTTPS (Render provides free SSL).

7. Usage Guide

Admin Panel (AdminJS):
Login at /admin.
Manage properties, images, amenities, inquiries.
Upload images directly in property forms.

API Usage (for your frontend):
Fetch properties: GET /api/properties?neighborhood=westlands&bedrooms=2.
Submit inquiry: POST /api/inquiries with JSON body.
Auth: Login POST /api/auth/login to get JWT, then use in headers for protected routes.

Adding Properties: Via admin panel or API (protected).
Images: Uploaded to Cloudinary; URLs stored in DB.
Logging: Errors/info logged to console (extend with Winston if needed).
Testing: Add your own tests with Jest (not included).

8. Troubleshooting

DB Connection: Check DATABASE_URL if errors.
Cloudinary: Verify keys if uploads fail.
Auth: If token issues, check JWT_SECRET.
Neon Pooling: Handled via pg.Pool.
Scale: For more users later, expand users table