const nodemailer = require('nodemailer');
const AES = require('crypto-js/aes');
const { SERVER_ID }  = require('@src/config');
const { MAIL_SMTP, AES_SECRET } = process.env;


const tranSport = nodemailer.createTransport({
  service: 'qq', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
  port: 465, // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
    user: '1969533391@qq.com',
    // 这里密码不是qq密码，是你设置的smtp授权码
    pass: MAIL_SMTP,
  }
})

exports.setVertify = async ({ username, email }) => {
  const vertifyKey = AES.encrypt(`username:${username}`, AES_SECRET).toString();
  return tranSport.sendMail({
    from: 'shuangz1011@qq.com', // sender address
    to: email, // list of receivers
    subject: `Hello ${username}! 请验证你的账户 @_@`, // Subject line
    html: `
          <h1>Click blow link to vertify your account:</h1>
          <a style="word-break: break-all;" 
              href='http://${SERVER_ID}/api/vertify/${vertifyKey}'
              target="_blank"
              rel="noopener"
              >http://${SERVER_ID}/api/vertify/${vertifyKey}</a> 
          <div> from chat app </div>
          `
  })
}