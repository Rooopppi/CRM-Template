import _ from 'lodash';
import path from 'path';
import glob from 'glob';
import fs from 'fs/promises';
import formidable from 'formidable';

const __dirname = path.resolve();

const getFilePath = (filePath) => path.join(__dirname, filePath);

const globFiles = (globPath) => glob.sync(getFilePath(globPath));

const readFile = (path) => fs.readFile(path);

const resolveRequestWithFile = async (request) => {
  if (!request.is('multipart/form-data')) {
    return request;
  }

  return new Promise((resolve, reject) => {
    const form = formidable({
      multiples: true,
      maxFileSize: 250 * 1024 * 1024
    });
    form.parse(request, (err, _fields, files) => {
      if (err) {
        reject(err);
        return;
      }

      const attachedFiles = _.transform(
        files,
        (attachments, file, fileName) => {
          attachments.push({ ...file, fileName });
        },
        []
      );
      resolve({ files: attachedFiles, body: _fields });
    });
  });
};

export default { globFiles, getFilePath, resolveRequestWithFile, readFile };
