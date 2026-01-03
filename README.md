# 🏠 HomeFinder Backend API

Backend REST API for the HomeFinder application.

This API handles:
- User authentication (JWT)
- User profiles
- Property posts
- Image uploads (Cloudinary)
- Comments and reports (moderation-ready)

---

## 🚀 Live API

Base URL:
https://homefinder-backend-jr5j.onrender.com

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- JWT Authentication
- Cloudinary (image storage)
- Multer
- Render (deployment)

---

## 📦 Installation (Local Setup)

```bash
git clone https://github.com/DreamLine44/homefinder-backend.git
cd homefinder-backend
npm install
```

Create a `.env.development.local` file:

```env
PORT=5000
DB_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_EXPIRES_IN=1d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

Run the server:
```bash
npm run dev
```

---

## 🔐 Authentication Routes

| Method | Endpoint | Description |
|------|---------|------------|
| POST | /api/users/signup | Register user |
| POST | /api/users/signin | Login user |
| GET | /api/users | Get current user (JWT) |

---

## 🏘 Posts Routes

| Method | Endpoint | Description |
|------|---------|------------|
| POST | /api/posts | Create post |
| PUT | /api/posts/:postId/update | Update post |
| DELETE | /api/posts/:postId/delete | Delete post |
| GET | /api/posts | Get all posts |
| GET | /api/posts/:postId | Get single post |
| GET | /api/posts/search?q= | Search posts |

---

## 🧪 Testing

You can test the API using:
- Bruno
- Postman
- Swagger UI (coming soon)

---

## 📄 License

MIT License
