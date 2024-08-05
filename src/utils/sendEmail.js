const { google } = require("googleapis");
const nodemailer = require("nodemailer");

// constants
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const oAuthRefreshToken = process.env.REFRESH_TOKEN;
const redirectUri = process.env.REDIRECT_URI;

//Set oAuth client
const oAuth2Client = new google.auth.OAuth2(
  clientId,
  clientSecret,
  redirectUri
);

oAuth2Client.setCredentials({ refresh_token: oAuthRefreshToken });

//we can send subject of email and body
async function sendMail({ mailTo, subject, text }) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "aveshraza010+game.poll@gmail.com",
        clientId,
        clientSecret,
        refreshToken: oAuthRefreshToken,
        accessToken: accessToken,
      },
    });

    //Email object
    const mailOptions = {
      from: "PLAY-O-TIME SUPPORT TEAM <aveshraza010+game.poll@gmail.com>",
      to: mailTo || "aveshraza010@gmail.com",
      subject: subject || "Game poll service",
      text,
      //   html: '<h1>Hello user we are back</h1>',
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    return { error };
  }
}

module.exports = { sendMail };
