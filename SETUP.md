# Lunagram Setup Guide

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (v4.4 or higher)
   - Install MongoDB from https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud) for free

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

Or use the convenience script:
```bash
npm run install-all
```

### 2. Set Up MongoDB

**Option A: Local MongoDB**
- Make sure MongoDB is running on your system
- Default connection: `mongodb://localhost:27017/lunagram`

**Option B: MongoDB Atlas (Cloud)**
- Create a free account at https://www.mongodb.com/cloud/atlas
- Create a cluster and get your connection string
- Update `server/.env` with your connection string

### 3. Configure Environment Variables

Create `server/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lunagram
JWT_SECRET=your_secret_key_here_change_in_production
```

### 4. Start the Application

**Development mode (runs both server and client):**
```bash
npm run dev
```

**Or run separately:**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## First Steps

1. Open http://localhost:3000
2. Click "Sign up" to create an account
3. Upload a profile picture (optional)
4. Create your first post!
5. Follow other users to see their posts in your feed

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running: `mongod` or check MongoDB service
- Verify connection string in `server/.env`
- Check MongoDB logs for errors

### Port Already in Use
- Change PORT in `server/.env` if 5000 is taken
- Change React port: `PORT=3001 npm start` in client folder

### Image Upload Issues
- Make sure `server/uploads/` directory exists (created automatically)
- Check file permissions
- Verify image file size (max 10MB for posts, 5MB for avatars)

### CORS Errors
- Make sure backend is running on port 5000
- Check `client/package.json` has `"proxy": "http://localhost:5000"`

## Production Deployment

For production:
1. Set strong `JWT_SECRET` in environment variables
2. Use cloud storage (AWS S3, Cloudinary) for images
3. Set up proper MongoDB connection with authentication
4. Build React app: `cd client && npm run build`
5. Serve built files with Express or use a CDN

