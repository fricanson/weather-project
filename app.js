const express = require("express");

const https = require("https");

const app = express();

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));

require('dotenv').config();

console.log(process.env);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");

});
app.post("/", function (req, res) {
    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

    https.get(url, function (response) {
        console.log(response.statusCode);

        response.on("data", function (data) {
            const weatherData = JSON.parse(data)
            const temp = weatherData.main.temp
            const weatherDescription = weatherData.weather[0].description
            const icon = weatherData.weather[0].icon
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"
            res.write("<p>The weather is currently " + weatherDescription + "<p>")
            res.write("<h1> The temperature in " + query + " is " + temp + " degrees celcius.</h1>")
            res.write("<img src=" + imageURL + ">")
            res.send()
        });
    });
});
// res.send("server is app and running");


app.listen(3000, function () {
    console.log("server is running on port 3000");
});