/* 
* @Author: Geoffrey Bauduin <bauduin.geo@gmail.com>
* @Date:   2014-11-26 10:22:45
* @Last Modified by:   Geoffrey Bauduin
* @Last Modified time: 2014-11-26 10:29:11
*/

(function () {
	
	var express = require("express");
	var OpenTok = require("opentok");

	var apiKey = "";
	var apiSecret = "";
	var opentok = new OpenTok(apiKey, apiSecret);

	var app = express();

	app.use(function (req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET");
		res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
		res.setHeader("Access-Control-Allow-Credentials", true);
		res.setHeader("Content-Type", "application/json");
		next();
	});

	app.get("/api/opentok", function (req, res) {
		opentok.createSession(function (error, OTSession) {
			if (error) {
				Logger.error(error);
				res.status(500).send({
					error: error
				})
			}
			else {
				res.status(200).send({
					sessionId: OTSession.sessionId,
					token: opentok.generateToken(OTSession.sessionId),
					apiKey: apiKey
				})
			}
		})
	})

	var server = app.listen(9876, function () {
		console.log("Server is listening on port 9876");
	})

}).call(this);
