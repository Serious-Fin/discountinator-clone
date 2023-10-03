import nodemailer from "nodemailer";

const sendPriceChangeMail = async (receiver_email, item, new_price) => {
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: "augustasgri@gmail.com",
      pass: "k5KyXpDnAIjxZRN2",
    },
  });

  const mailOptions = {
    from: "DiscountinatorTeam@gmail.com",
    to: receiver_email,
    subject: "Price change alert",
    text: `Hey, an item you subscribed to became cheaper!\n
            Item name: ${item.name}\n 
            New Price: ${new_price}\n 
            Old Price: ${item.price}\n
            Link: ${item.site_link}\n`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent successfully");
    }
  });
};

export { sendPriceChangeMail };
