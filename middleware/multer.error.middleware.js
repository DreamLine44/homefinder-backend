import multer from "multer";

const multerErrorMiddleware =  (err, req, res, next) => {
    try {
    if (err instanceof multer.MulterError) {
    return res.status(400).json({ msg: err.message });
  }

  if (err.message === "Only image files are allowed") {
    return res.status(400).json({ msg: err.message });
  }

  return res.status(500).json({ msg: "Server error" });
    } catch (error) {
        next(error);
    }

}

export default multerErrorMiddleware;






















// app.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({ msg: err.message });
//   }

//   if (err.message === "Only image files are allowed") {
//     return res.status(400).json({ msg: err.message });
//   }

//   return res.status(500).json({ msg: "Server error" });
// });