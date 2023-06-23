const express = require('express')
const cors = requires('cors')

const app = express();
app.use(cors())
app.use(express.json())