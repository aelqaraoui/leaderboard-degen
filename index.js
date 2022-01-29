const express = require('express')
const indexer = require('./api/indexer');
const app = express()
const port = 3000

const cors = require('cors');
app.use(cors({
    origin: '*'
}));

app.use('/', indexer);

app.listen(process.env.PORT || port, () => {
  console.log(`${port}`)
})