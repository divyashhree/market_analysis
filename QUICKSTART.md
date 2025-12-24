# Quick Start Guide

## Prerequisites
- Node.js 18 or higher
- npm or yarn package manager

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start the backend server
npm start
```

The backend will run on **http://localhost:5000**

### 2. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file (optional)
cp .env.example .env.local

# Start the development server
npm run dev
```

The frontend will run on **http://localhost:3000**

### 3. Access the Application

Open your browser and navigate to:
- **Application:** http://localhost:3000
- **API Health Check:** http://localhost:5000/health

## Common Commands

### Backend
```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm start          # Start production server (after build)
npm run lint       # Run ESLint
```

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:

**Backend:** Edit `backend/.env` and change `PORT=5000` to another port

**Frontend:** The Next.js dev server will automatically try the next available port

### Module Not Found
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### API Connection Error
Ensure:
1. Backend is running on port 5000
2. Frontend `.env.local` has correct `NEXT_PUBLIC_API_URL=http://localhost:5000`
3. No CORS issues (check browser console)

### Data Not Loading
The application will automatically fallback to CSV data if APIs fail. Check:
- CSV files exist in `backend/src/data/`
- Files are properly formatted
- Backend logs for any errors

## Development Tips

### Hot Reload
- Frontend: Changes auto-reload
- Backend: Use `npm run dev` with nodemon for auto-reload

### Testing API Endpoints
Use curl, Postman, or browser:
```bash
# Test health endpoint
curl http://localhost:5000/health

# Get all data
curl http://localhost:5000/api/data/all

# Get correlations
curl http://localhost:5000/api/analysis/correlations
```

### Clearing Cache
Backend uses in-memory caching. Restart server to clear cache.

## Next Steps

1. Explore the Dashboard at `/dashboard`
2. View correlations at `/analysis`
3. Check insights at `/insights`
4. Read methodology at `/about`

For detailed documentation, see the main README.md
