import fileUpload from 'express-fileupload';
export const fileUploader = fileUpload({createParentPath: true, uriDecodeFileNames: true, abortOnLimit: true, limits: {fileSize: 4 * 1024 * 1024 * 1024}});