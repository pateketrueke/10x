module.exports.twice = n => n * 2;
module.exports.wait = ms => new Promise(ok => setTimeout(ok, ms));
