import koaBody from 'koa-body';

export default () => koaBody({
  multipart: true,
  formidable: {
    hash: 'md5',
    maxFileSize: 20 * 1024 * 1024, // 限制上传文件大小
    // onFileBegin: (name, file) => {
    //   console.log('------0------')
    //   console.log(name)
    //   console.log(file)
    // },
  },
});
