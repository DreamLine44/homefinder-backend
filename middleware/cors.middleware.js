import cors from "cors";

app.use(cors({
  origin: [
    "http://localhost:5000",
    "https://your-frontend-domain.com"
  ],
  credentials: true,
}));
