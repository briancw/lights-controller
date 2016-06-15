var Milight = require('node-milight-promise').MilightController;
var commands = require('node-milight-promise').commands;

var light = new Milight({
    ip: '192.168.0.103',
    delayBetweenCommands: 35,
    commandRepeat: 3,
});

var zone = 1;

// light.sendCommands(
//  // commands.rgbw.on(zone)
//  commands.rgbw.brightness(100),
// commands.rgbw.hue(10)
//  commands.rgbw.rgb255(0, 0, 255)
// );

light.sendCommands(
    // commands.rgbw.brightness(0)
    commands.rgbw.brightness(100)
    // commands.rgbw.hue(255)
    // commands.rgbw.rgb255(255, 255, 255)
    // commands.rgbw.whiteMode(zone)
);

var hue = 0;

// light.sendCommands(commands.rgbw.on(zone), commands.rgbw.whiteMode(zone));

light.close();
