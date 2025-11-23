# Lunagram - Instagram Clone

A full-featured Instagram clone built with React and Node.js/Express.

## Features

- 🔐 User Authentication (Sign up, Login, Logout)
- 📸 Create and share posts with images
- ❤️ Like and comment on posts
- 👥 Follow/Unfollow users
- 🔍 Search and explore users
- 📱 Responsive design
- 👤 User profiles with posts grid
- 💬 Real-time comments and likes

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- bcryptjs for password hashing

### Frontend
- React 18
- React Router for navigation
- Axios for API calls
- React Icons
- CSS3 for styling

## Installation

See [SETUP.md](SETUP.md) for detailed setup instructions.

**Quick Start:**
1. Install dependencies: `npm run install-all`
2. Set up MongoDB (local or Atlas)
3. Create `server/.env` with your configuration
4. Run: `npm run dev`

This will start both the backend server (port 5000) and frontend (port 3000).

## Project Structure

```
lunagram/
├── server/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── uploads/         # Uploaded images
│   └── index.js         # Server entry point
├── client/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   └── App.js       # Main app component
│   └── public/          # Static files
└── package.json         # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/me` - Update user profile
- `GET /api/users/search/:query` - Search users

### Posts
- `POST /api/posts` - Create new post
- `GET /api/posts/feed` - Get feed posts
- `GET /api/posts/explore` - Get explore posts
- `GET /api/posts/:id` - Get post by ID
- `GET /api/posts/user/:userId` - Get user's posts
- `DELETE /api/posts/:id` - Delete post

### Comments
- `POST /api/comments` - Create comment
- `DELETE /api/comments/:id` - Delete comment
- `GET /api/comments/post/:postId` - Get post comments

### Likes
- `POST /api/likes/:postId` - Like/Unlike post
- `GET /api/likes/:postId` - Check if liked

### Follow
- `POST /api/follow/:userId` - Follow/Unfollow user

## Usage

1. Sign up for a new account
2. Upload your profile picture
3. Create posts with images
4. Follow other users
5. Like and comment on posts
6. Explore and discover new content

## Notes

- Images are stored locally in `server/uploads/`
- For production, consider using cloud storage (AWS S3, Cloudinary)
- Make sure to set a strong JWT_SECRET in production
- MongoDB connection string can be configured in `.env`

## License

MIT

