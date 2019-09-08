const app = require('./app')
const port = process.env.PORT || 3000
const db = require('./db')


db.setup()
.then(()=>app.listen(port, ()=> console.log('listening on port ', port)))
.catch(ex => console.log(ex))
