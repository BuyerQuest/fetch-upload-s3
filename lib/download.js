var fs = require('fs'),
    got = require('got'),
    path = require('path');

function mkDirByPathSync(targetDir, {isRelativeToScript = false} = {}) {
  const sep = path.sep;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
    } catch (err) {
      if (err.code !== 'EEXIST') {
        throw err;
      }

    }

    return curDir;
  }, initDir);
}

module.exports = function(uri, filename, done) {
    //accounts for sub-folders in the file name for the key in S3
    let filepath = filename.substring(0, filename.lastIndexOf('/'))
    mkDirByPathSync('/tmp/fetch_upload_s3/'+filepath);
    var file =  fs.createWriteStream('/tmp/fetch_upload_s3/'+filename);

    var myrequest = got.stream(uri).pipe(file)
    .on('response', function(resp) {
        if (resp.statusCode === 200) {
            return done(null)
        }
        else {
            done(new Error('error: '+resp.statusCode));
        }
    })

    file.on('finish', function() {
      file.close(done);  // close() is async, call cb after close completes.
    });

    file.on('error', function(err) { // Handle errors
      fs.unlink('/tmp/fetch_upload_s3/'+filename); // Delete the file async. (But we don't check the result)
      return done(err.message);
    });
};
