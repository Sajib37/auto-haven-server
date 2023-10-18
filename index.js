const express = require('express')
const app = express();
const cors=require('cors')
const port = process.env.PORT || 5000

// middleWares
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send(`Server is running on port : ${port}`)
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
})