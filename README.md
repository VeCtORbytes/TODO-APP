# TaskFlow - Full Stack Todo Application

A modern, full-stack todo application built with React, Node.js, Express, and MongoDB. Organize your tasks efficiently with beautiful UI and powerful features.

## 🚀 Live Demo

**Frontend:** https://todo-app-flame-gamma-50.vercel.app/login  
**Backend API:** Deployed on Railway

## 📋 Features

### Authentication
- User registration with email validation
- Secure login with JWT authentication
- Password hashing with bcryptjs
- Protected routes and API endpoints
- Auto-logout on token expiry

### Board Management
- Create, read, update, delete boards
- Organize boards with titles and descriptions
- Color-coded board identification
- Board ownership verification

### Todo Management
- Create todos within boards
- Set priority levels (Low, Medium, High)
- Track todo status (Pending, In Progress, Completed)
- Filter todos by status
- Mark todos as complete/incomplete
- Delete todos with confirmation

### Additional Features
- Progress statistics and tracking
- Completion percentage visualization
- Responsive design (Desktop, Tablet, Mobile)
- Professional glassmorphism UI
- Real-time error handling
- Loading states for better UX

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Styling:** Custom CSS with Glassmorphism
- **State Management:** React Context API
- **Deployment:** Vercel

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Deployment:** Railway

### Database
- **MongoDB** with Mongoose ODM
- Collections: Users, Boards, Todos

## 📁 Project Structure

```
Todo-App/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── BoardPage.jsx
│   │   ├── components/
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── styles/
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   └── Board.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
└── backend/
    ├── models/
    │   ├── User.js
    │   ├── Board.js
    │   └── Todo.js
    ├── routes/
    │   ├── auth.js
    │   ├── boards.js
    │   └── todos.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── server.js
    ├── .env
    └── package.json
```

## 🔐 Authentication Flow

1. User registers with email, password, and name
2. Password is hashed using bcryptjs (10 salt rounds)
3. JWT token is generated and sent to client
4. Token is stored in localStorage
5. All subsequent requests include Authorization header with token
6. Protected routes verify token before allowing access
7. Token expires after 7 days

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
```

### Boards
```
GET    /api/boards           - Get all user's boards
POST   /api/boards           - Create new board
GET    /api/boards/:id       - Get specific board
PUT    /api/boards/:id       - Update board
DELETE /api/boards/:id       - Delete board (cascades todos)
```

### Todos
```
GET    /api/todos/:boardId   - Get todos for a board
POST   /api/todos            - Create new todo
PUT    /api/todos/:id        - Update todo (status, etc)
DELETE /api/todos/:id        - Delete todo
```

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  createdAt: Date
}
```

### Boards Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  color: String,
  createdAt: Date
}
```

### Todos Collection
```javascript
{
  _id: ObjectId,
  boardId: ObjectId (ref: Board),
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  status: String (pending, in-progress, completed),
  priority: String (low, medium, high),
  dueDate: Date (optional),
  createdAt: Date
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5001/api" > .env

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/todoapp
PORT=5001
JWT_SECRET=your_secret_key_here
NODE_ENV=development

# Start server
npm run dev
```

Backend will run on `http://localhost:5001`

## 🔑 Demo Credentials

Test the app with these credentials:

```
Email: test@example.com
Password: password123
```

Or create a new account by registering.

## 📊 Key Features Explained

### Authentication & Security
- JWT tokens for stateless authentication
- Bcryptjs for secure password hashing
- Protected API endpoints with middleware
- Protected frontend routes with context

### State Management
- React Context API for global auth state
- Custom hooks for easy access
- Persistent storage with localStorage

### Responsive Design
- Mobile-first approach
- Flexbox and CSS Grid layouts
- Media queries for different breakpoints
- Touch-friendly interface

### Error Handling
- Try-catch blocks in async operations
- User-friendly error messages
- Loading states during API calls
- Validation on both frontend and backend

## 🧪 Testing

### Manual Testing Steps

1. **Register:**
   - Go to register page
   - Fill in name, email, password
   - Should redirect to dashboard

2. **Login:**
   - Use demo credentials
   - Should redirect to dashboard
   - Token saved in localStorage

3. **Create Board:**
   - Enter board title
   - Click "Create Board"
   - Should appear in boards list

4. **Add Todo:**
   - Click on a board
   - Enter todo title
   - Set priority and description
   - Click "Add Todo"

5. **Manage Todos:**
   - Click checkbox to mark complete
   - Use filters (All, Active, Completed)
   - Delete todos with trash icon
   - View progress statistics

6. **Logout:**
   - Click Logout button
   - Should redirect to login
   - Token cleared from localStorage

## 📝 Git Commit History

The project has clean commit history showing incremental development:
- Initial project setup
- Backend authentication implementation
- Board CRUD operations
- Todo CRUD operations
- Frontend components creation
- UI styling and improvements
- Deployment

View commits: https://github.com/VeCtORbytes/TODO-APP/commits/main

## 🎓 Learning Outcomes

This project demonstrates understanding of:
- Full-stack web development
- RESTful API design
- Database modeling and relationships
- Authentication and security
- React component architecture
- State management with Context API
- Responsive UI design
- Error handling and validation
- Git version control

## 🔄 Future Enhancements

- Due date functionality with reminders
- Subtasks within todos
- Collaborative boards (share with other users)
- Dark/Light theme toggle
- Search and filter by keywords
- Drag and drop todo reorganization
- Export todos as PDF
- Email notifications

## 🐛 Known Issues

None at the moment. All core features are working as expected.

## 📞 Contact & Support

For questions or issues, feel free to reach out or open an issue on GitHub.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

Built as a comprehensive full-stack learning project demonstrating modern web development practices.

---

**GitHub:** https://github.com/VeCtORbytes/TODO-APP  
**Frontend:** https://todo-app-flame-gamma-50.vercel.app/login  
**Last Updated:** January 30, 2026
