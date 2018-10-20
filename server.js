const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
require("dotenv").config();
const axios = require("axios");

//Check for valid MailChimp API Key
const password = process.env.MAILCHIMP_API_KEY;
if (!password) {
  console.error("No MailChimp API Key include in environment variables");
  process.exit(1);
}

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(express.static("public"));

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/subscribe", (req, res) => {
  const email = req.body.email;

  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!re.test(email)) {
    console.error(`Invalid Email: ${email}`);
    return res.status(400).send(`Invalid Email: ${email}`);
  }

  const body = { email_address: email, status: "subscribed" };

  const username = process.MAILCHIMP_USERNAME;
  const listId = process.env.MAILCHIMP_LIST_ID;
  axios({
    method: "post",
    url: `https://us15.api.mailchimp.com/3.0/lists/${listId}/members/`,
    data: body,
    auth: {
      username,
      password
    }
  })
    .then(response => {
      res.send("Thanks for subscribing!");
    })
    .catch(({ response }) => {
      console.error(`Error trying to subscribe ${email}`);
      res.status(500).send(`Error trying to subscribe ${email}`);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
