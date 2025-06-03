const express = require("express")
const app = express()
const pg = require("pg")
const client = new pg.Client("postgres://localhost/acme_hr_directory" || process.env.DATABASE)
app.use(express.json())
app.use(require("morgan")("dev"))

// CREATE
// READ
app.get('/api/departments', async (req,res,next)=>{
	try {
		const SQL = `
			SELECT *
			FROM departments
		`;
		const response = await client.query(SQL)
		res.send(response.rows)
	} catch (error) {
		next(error)
	}
})
app.get('/api/employees', async (req,res,next)=>{
	try {
		const SQL = `
			SELECT *
			FROM employees
		`;
		const response = await client.query(SQL)
		res.send(response.rows)
	} catch (error) {
		next(error)
	}
})

// UPDATE
app.put('/api/employees/:id', async (req,res,next)=>{
	try {
		const SQL = `
			UPDATE employees
			SET name=$1, updated_at=now(), department_id =$2
			WHERE id=$3
			RETURNING *;
		`
		const response = await client.query(SQL, [req.body.name, req.body.department_id, req.params.id])
		res.send(response.rows[0])
	} catch (error) {
		next(error)
	}
})


// DELETE


const init = async (req,res,next) => {
	// MAKE CONNECTION
	await client.connect()

	// CREATE & SEED TABLES
	const SQL = `

		DROP TABLE IF EXISTS employees;
		DROP TABLE IF EXISTS departments;

		CREATE TABLE departments(
			id SERIAL PRIMARY KEY,
			name VARCHAR(100)
		);
		
		CREATE TABLE employees(
			id SERIAL PRIMARY KEY,
			name VARCHAR(100),
			created_at TIMESTAMP DEFAULT now(),
			updated_at TIMESTAMP DEFAULT now(),
			department_id INTEGER REFERENCES departments(id) NOT NULL
		);

		INSERT INTO departments(name) VALUES ('Administration');
		INSERT INTO departments(name) VALUES ('Design');
		INSERT INTO departments(name) VALUES ('Development');
		INSERT INTO departments(name) VALUES ('Animation');

		INSERT INTO employees
		(name, department_id)
		VALUES
		('Weldon Franklin' , 1);
		
		INSERT INTO employees
		(name, department_id)
		VALUES
		('Leonardo Johnson' , 2);
		
		INSERT INTO employees
		(name, department_id)
		VALUES
		('Jerry Cobb' , 4);
		
		INSERT INTO employees
		(name, department_id)
		VALUES
		('Jami Liu' , 4);
		
		INSERT INTO employees
		(name, department_id)
		VALUES
		('Summer Mccormick' , 3);
		
		INSERT INTO employees
		(name, department_id)
		VALUES
		('Audrey Krueger', 3);
		
		INSERT INTO employees
		(name, department_id)
		VALUES
		('Kermit Hull' , 2);
		
		INSERT INTO employees
		(name, department_id)
		VALUES
		('Nick Alexander' , 1);
		
		INSERT INTO employees
		(name, department_id)
		VALUES
		('Chasity Garrett' , 2);
		
		INSERT INTO employees
		(name, department_id)
		VALUES
		('Frankie Crosby' , 4);
	`

	await client.query(SQL)

	// CREATE A PORT & LISTEN
	const PORT = 3000
	app.listen(PORT , ()=>{
		console.log(`Listening at PORT: ${PORT}`)
	})
}

init()