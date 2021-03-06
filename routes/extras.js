require('js-yaml');
var oauth   = require('../lib/oauth');
var commaIt = require('comma-it').commaIt;
var fs      = require('fs');

function render(template, req, res, data) {
    var maxSize = 0;
    try {
        maxSize   = data.sort(function(a,b) { return b.size-a.size; })[0].size;
    } catch (e) { }
    res.render(template, {
                    title: 'Bootstrap CDN',
                    theme: req.query.theme,
                    commaIt: commaIt,
                    data: data,
                    maxSize: maxSize,
                });
}

function popular(req, res) {
    if (req.config.stats === "stub") {
        oauth.fallback(null, '../tests/stubs/popular.json', function(data) {
            render('extras_popular', req, res, data);
        });
    } else {
        oauth.fetch('/tmp/.popular.json', function (data) {
            render('extras_popular', req, res, data);
            if (data && data.length !== 0) {
                fs.writeFile('/tmp/.popular.json', JSON.stringify({ data: { popularfiles: data } }, null, 2));
            }
        });
    }
}

function app(req, res) {
    render('extras_app', req, res);
}

function birthday(req, res) {
    res.render('extras_birthday', { title: 'Bootstrap CDN', theme: req.query.theme });
}

module.exports = {
    popular: popular,
    birthday: birthday,
    app: app
};

// vim: ft=javascript sw=4 sts=4 et:
