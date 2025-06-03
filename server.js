const express = require("express")
const app = express()
const pg = require("pg")
app.use(express.json())

const init = () => {
	// MAKE CONNECTION
	// CREATE & SEED TABLES
	// CREATE A PORT & LISTEN
	const PORT = 3000
	app.listen(PORT , ()=>{
		console.log(`Listening at PORT: ${PORT}`)
	})


}

init()