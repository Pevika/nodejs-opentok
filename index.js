/* 
* @Author: Geoffrey Bauduin <bauduin.geo@gmail.com>
* @Date:   2014-11-26 10:22:45
* @Last Modified by:   Geoffrey Bauduin
* @Last Modified time: 2014-11-26 10:41:13
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
		res.setHeader("Access-Control-Allow-Methods", "GET, POST");
		res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
		res.setHeader("Access-Control-Allow-Credentials", true);
		res.setHeader("Content-Type", "application/json");
		next();
	});

	var lastSession = {};

	app.post("/api/opentok", function (req, res) {
		opentok.createSession(function (error, OTSession) {
			if (error) {
				Logger.error(error);
				res.status(500).send({
					error: error
				})
			}
			else {
				lastSession = {
					sessionId: OTSession.sessionId,
					token: opentok.generateToken(OTSession.sessionId),
					apiKey: apiKey
				}
				res.status(200).send(lastSession)
			}
		})
	})

	app.get("/api/opentok", function (req, res) {
		if (lastSession.sessionId) {
			res.status(200).send(lastSession);
		}
		else {
			res.status(403).send({
				error: "must POST /api/opentok before GET /api/opentok"
			})
		}
	})

	var server = app.listen(9876, function () {
		console.log("Server is listening on port 9876");
	})

}).call(this);