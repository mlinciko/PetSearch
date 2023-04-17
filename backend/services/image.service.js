import path from 'path';

export const getImageByName = async(req, res, next) => {
  const fileName = req.query?.file_name;
  const type = req.query?.type;

  if (!fileName) {
    return res.status(400).json({ message: "File name must be provided" })
  }
  if (!type) {
    return res.status(400).json({ message: "Type must be provided" })
  }
  try {
    const __dirname = path.resolve();
    res.sendFile(path.join(__dirname, `media/${type}/${fileName}`))

  } catch (e) {
    console.log('*getImageByName service')
    next(e)
  }
}