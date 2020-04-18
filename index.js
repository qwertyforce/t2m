const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')
const https = require('https');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const bencode = require('bencode')
const sha1 = require('simple-sha1')

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload({
    limits: {
        fileSize: 100 * 1024 * 1024
    },
    abortOnLimit: true
}));
app.disable('x-powered-by');
const port = 8082;
//  https.createServer({                                      //Uncomment if you want to use https 
//       key: fs.readFileSync('key.pem'),
//       cert: fs.readFileSync('cert.pem')
//     }, app).listen(port);
// console.log(`Server is listening on port ${port}`);
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
app.use(function(req, res, next) {
    if (req.originalUrl && req.originalUrl.split("/").pop() === 'favicon.ico') {
        return res.sendStatus(204);
    }
    return next();
});


app.use(express.static('public'))

app.post('/upload', (req, res) => {
    console.log("hit")
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    let sampleFile = req.files.data;
    let torrent = bencode.decode(sampleFile.data)
    let infoBuffer=bencode.encode(torrent.info)
    let infoHash = sha1.sync(infoBuffer)
    const uri ='magnet:?xt=urn:btih:' + infoHash
    res.send(uri);
    console.log(uri)
});
