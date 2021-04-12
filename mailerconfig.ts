export default {
  transport: {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: 'activity.progress.app@gmail.com',
      pass: '3vc8udqr3vc8udqr',
    },
  },
  defaults: {
    forceEmbeddedImages: true,
    from: '"nest-modules" <activity.progress.app@gmail.com>',
  },
  templateDir: './src/common/email-templates',
  templateOptions: {
    engine: 'handlebars',
  },
};
