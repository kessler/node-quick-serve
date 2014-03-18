#!/usr/bin/env node
var fs = require('fs')
var http = require('http')
var path = require('path')
var mime = require('mime')
var util = require('util')

var filename = process.argv[2]
var port = process.argv[3] || 12345

if (!filename)
	throw new Error('must provide a file name')

var realFilename = path.resolve(process.cwd(), filename)

var contentType = mime.lookup(realFilename)
var contentDisposition = util.format('attachment; filename="%s"', path.basename(realFilename))

var server = http.createServer(function(request, response) {

	response.setHeader('content-disposition', contentDisposition)
	response.setHeader('content-type', contentType)
	fs.createReadStream(realFilename).pipe(response)

}).listen(port, function (err) {
	if (err) return console.error(err)

	console.log('serving %s on http://localhost:%s', realFilename, port)
})