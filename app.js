const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    app.post("/failure", function(req, res) {
        res.redirect("/");
    });

    const jsonData = JSON.stringify(data);

    const url = "https://us10.api.mailchimp.com/3.0/lists/4307940cf5";

    const options = {
        method: "POST",
        auth: "angela1:580289fc995bed2369d110347e591cb6-us10"
    }

    const request = https.request(url, options, function(response) {


        response.on("data", function(data) {
            console.log(JSON.parse(data));
            if (JSON.parse(data).error_count === 0) {
                res.sendFile(__dirname + "/success.html");
            } else {
                res.sendFile(__dirname + "/failure.html");
            }
        })
    });

    request.write(jsonData);
    request.end();
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});

//API key
//580289fc995bed2369d110347e591cb6-us10

//List id
//4307940cf5
