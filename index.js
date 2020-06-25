var express= require('express')
var app = express();
const port = 8080

const path = require('path');

app.use(express.static(__dirname))

app.get('/', (req, res) => res.send('Please access by /public/index.html'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
