import { v4 as uuidv4 } from 'uuid';

const publicPath = './public';
let path = publicPath;
export class HelperFileLoader {
  set path(_path) {
    path = publicPath + _path;
  }

  public customFileName(req, file, cb) {
    const originalName = file.originalname.split('.');
    const fileExtension = originalName[originalName.length - 1];
    cb(null, `${uuidv4()}.${fileExtension}`);
  }

  public destinationPath(req, file, cb) {
    cb(null, path);
  }

  public fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
}
