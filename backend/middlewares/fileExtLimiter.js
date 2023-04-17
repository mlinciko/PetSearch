import path from 'path';

export const fileExtLimiter = (allowedExtArray) => {
  return (req, res, next) => {
    const files = req.files;

    const fileExtensions = [];
    Object.keys(files).forEach(key => {
      fileExtensions.push(path.extname(files[key].name))
    })

    const allowed = fileExtensions.every(ext => allowedExtArray.includes(ext))
    if (!allowed) {
      return res.status(400).json({ message: 'Wrong file extension' })
    }

    next()
  }
}