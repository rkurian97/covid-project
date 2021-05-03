const express= require('express'),
    cors= require('cors'),
    logger= require('morgan'),
    personRouter= require('./router/router')
    PORT= process.env.PORT || 3000

    require('./mongoosConnection')

const app= express()
app.use(logger('combined'))
app.use(cors())
app.use(express.json())
app.use(personRouter)


app.listen(PORT, ()=> {
    console.log(`http://localhost:${PORT}`)
})