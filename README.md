fetch-upload-s3
===============

Fetches an asset (picture for instance) from a remote URL (or a local file) and uploads it to Amazon S3.

## Install

```javascript
npm install --save Buyerquest/fetch-upload-s3
```

## Setup

### Credentials

#### AWS Lambda

If you're running on Lambda, the AWS SDK will automatically use the IAM role. This behavior cannot be configured.

#### Elsewhere

Create app environment variables and set

`AWS_ACCESS_KEY_ID`

`AWS_SECRET_ACCESS_KEY`

`AWS_REGION`

## Example

```javascript
// To fetch the file at URL: http://nodejs.org/images/logo.png
// And then upload it to S3 at the path: s3://my-s3-bucket/path/inside/bucket/file.ext
var FUS3 = require('fetch-upload-s3');
var fus3 = new FUS3('my-s3-bucket');

fus3.init(function() {
  fus3.do('http://nodejs.org/images/logo.png', 'path/inside/bucket/file.ext', function(err, data) {
    console.log('file fetched and uploaded to S3!');
    console.log(data);
    console.log(err);
  });
});
};
```

```javascript
// To upload a file that already exists on your local file system to S3 at the path: s3://my-s3-bucket/path/inside/bucket/file.ext
var FUS3 = require('fetch-upload-s3');
var fus3 = new FUS3('my-s3-bucket');

fus3.init(function(){
  fus3.uploadFile('/path/to/local/file', 'path/inside/bucket/file.ext',
    function(err, data){
    console.log('file uploaded to S3!');
    console.log(data);
  });
});
```

## Notes

A temp folder '/tmp/fetch_upload_s3' is used as a proxy.
Temporary and source files are deleted locally as soon as they have been uploaded to S3
