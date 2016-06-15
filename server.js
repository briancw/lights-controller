const express = require('express');
const Milight = require('node-milight-promise').MilightController;
const commands = require('node-milight-promise').commands;
const schedule = require('node-schedule');
const app = express();
const sun_calc = require('suncalc');

var light = new Milight({
    ip: '192.168.0.103',
    delayBetweenCommands: 35,
    commandRepeat: 3,
});
var zone = 1;

// Second, Minute, Hour, day of month, month, day of week
schedule.scheduleJob('0 26 21 * * *', () => {
    let times = sun_calc.getTimes(new Date(), 42.2, -122.7);
    let sunrise = times.sunrise;
    let sunset = times.sunset;

    console.log(sunrise);
    console.log(sunset);

    // 1 hour before sunrise
    schedule.scheduleJob(new Date(sunrise - (1000 * 60 * 60)), () => {
        console.log('Pre sunrise turn on', new Date());
        turn_on();
    });
    // 45 Minutes after sunrise
    schedule.scheduleJob(new Date(sunrise + (1000 * 60 * 45)), () => {
        console.log('Post sunrise turn off', new Date());
        turn_off();
    });

    // 30 minutes before sunset
    schedule.scheduleJob(new Date(sunset - (1000 * 60 * 30)), () => {
        console.log('Sunset turn on', new Date());
        turn_on();
    });
    // Midnight
    schedule.scheduleJob(new Date(new Date().setHours(23, 59)), () => {
        console.log('End of day turn off', new Date());
        turn_off();
    });
});
light.close();

function turn_off() {
    light.sendCommands(
        commands.rgbw.off(zone)
    );
}

function turn_on() {
    light.sendCommands(
        commands.rgbw.on(zone),
        commands.rgbw.whiteMode(zone),
        commands.rgbw.brightness(100)
    );
    light.close();
}

app.get("/on", function(req, res) {
    light.sendCommands(
        commands.rgbw.on(zone),
        commands.rgbw.brightness(100)
    );
    light.close();

    res.status(200);
    res.end();
});

app.get("/off", function(req, res) {
    light.sendCommands(
        commands.rgbw.off(zone)
    );
    light.close();

    res.status(200);
    res.end();
});

app.get("/white", function(req, res) {
    light.sendCommands(
        commands.rgbw.whiteMode(zone)
    );
    light.close();

    res.status(200);
    res.end();
});

app.get("/color", function(req, res) {
    if( req.query.color ) {
        var tmp_rgb = hex_to_rgb(req.query.color);

        light.sendCommands(
            commands.rgbw.rgb255(tmp_rgb.r, tmp_rgb.g, tmp_rgb.b)
        );
    }

    if (req.query.brightness) {
        light.sendCommands(
            commands.rgbw.brightness(req.query.brightness)
        );
    }

    light.close();

    res.status(200);
    res.end();
});

function hex_to_rgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : null;
}

app.listen(8090);
console.log('Listening on 8090');
