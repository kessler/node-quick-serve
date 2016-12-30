#!/usr/bin/env node

var fs = require('fs')
var http = require('http')
var path = require('path')
var ecstatic = require('ecstatic')
var util = require('util')
var mime = require('mime')

var filename = process.argv[2] || '.'
var port = process.argv[3] || 12345

var realFilename = path.resolve(process.cwd(), filename)

var stat = fs.statSync(realFilename)

var app

if (stat.isFile()) {
	var contentType = mime.lookup(realFilename)
	var contentDisposition = util.format('attachment; filename="%s"', path.basename(realFilename))

	app = function(request, response) {
		response.setHeader('content-disposition', contentDisposition)
		response.setHeader('content-type', contentType)
		fs.createReadStream(realFilename).pipe(response)
	}

} else if (stat.isDirectory()) {
	app = ecstatic({ root: realFilename })
} else {
	throw new Error('unsupported ' + realFilename)
}

var server = http.createServer(app).listen(port, function(err) {
	if (err) return console.error(err)
	console.log('serving %s on http://localhost:%s', realFilename, port)
})
