import request from 'supertest';
import { app } from '../app';
import { EmployeesTest, EmployeeTest } from '@models/Employee';

beforeAll(async () => {
	await request(app).get('/refresh/dbTest').send();
	await request(app).post('/seed/dbTest').send();
})

afterAll(async () => { 
	await request(app).get('/drop/dbTest').send();
})

describe('Create employee', () => {

	it('should be able to create employee', async () => {
		const messageError: object = { message: 'Employee Created' }
		const employee: EmployeeTest = { name: 'Little Joseph', company: 'JosephBussiness' };

		const response = await request(app).post('/create').send(employee);

		expect(response.status).toBe(201);
		expect(response.body).toEqual(messageError);
	})

	it('should not be able to send missing name', async () => {
		const messageError: object = { message: 'Bad Request - Missing Name' }
		const employee: EmployeeTest = { company: 'JhonBussiness' };

		const response = await request(app).post('/create').send(employee);

		expect(response.status).toBe(400);
		expect(response.body).toEqual(messageError);
	})

	it('should not be able to send name when is not a string', async () => {
		const messageError: object = { message: 'Bad Request - Name Must Be String' }
		const employee: EmployeeTest = { name: 11111111 };

		const response = await request(app).post('/create').send(employee);

		expect(response.status).toBe(400);
		expect(response.body).toEqual(messageError);
	})

	it('should not be able to send company when is not a string or null', async () => {
		const messageError: object = { message: 'Bad Request - Company Must Be String Or Null' }
		const employee: EmployeeTest = { name: 'Little John', company: 11111111 };

		const response = await request(app).post('/create').send(employee);

		expect(response.status).toBe(400);
		expect(response.body).toEqual(messageError);
	})

	it('should not be able to create employee who already exists', async () => {
		const messageError: object = { message: 'Bad Request - Employee Already Exists' }
		const employee: EmployeeTest = { name: 'Little Joseph', company: 'JosephBussiness' };

		const response = await request(app).post('/create').send(employee);

		expect(response.status).toBe(400);
		expect(response.body).toEqual(messageError);
	})
});

describe('Get employees', () => {

	it('should be able to get all employees', async () => {
		const employees: EmployeesTest = [
			{
				name: 'Little Mary',
				company: 'MaryNails',
				id: 100,
			},{
				name: 'Peggy',
				company: 'MaryNails',
				id: 101,
			},{
				name: 'Little Joseph',
				company: 'JosephBussiness',
				id: 102,
			}
		]

		const body: object = { employees: employees }

		const response = await request(app).get('/allEmployees');

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject(body);
	})

	it('should not founded employee', async () => {
		const messageError: object = { message: 'Employee Not Found' }
		const employee: EmployeeTest = { name: 'Zezinho' };

		const response = await request(app).get(`/employee/${employee.name}`);

		expect(response.status).toBe(404);
		expect(response.body).toEqual(messageError);
	})

	it('should be able to get employee', async () => {
		const employee: EmployeeTest = {
			name: 'Little Mary',
			company: 'MaryNails',
			id: 100,
		}
		const messageError: object = { employee: employee }

		const response = await request(app).get(`/employee/${employee.name}`);

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject(messageError);
	})

	it('should be able to get employee by company', async () => {
		const company = 'MaryNails';
		const employees: EmployeesTest = [
			{
				name: 'Little Mary',
				company: company,
				id: 100,
			},{
				name: 'Peggy',
				company: company,
			}
		]
		const messageError: object = { employees: employees }

		const response = await request(app).get(`/company/${company}`);

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject(messageError);
	})

	it('should not be able to get employees by company missing company', async () => {
		const messageError: object = { message: 'Bad Request' }

		const response = await request(app).get(`/company/null`);

		expect(response.status).toBe(400);
		expect(response.body).toMatchObject(messageError);
	})

	it('should be not able to get employee by company which doesnt exist', async () => {
		const company = 'JohnsHopinks';
		
		const messageError: object = { message: 'Not Founded Employees For This Company' }

		const response = await request(app).get(`/company/${company}`);

		expect(response.status).toBe(404);
		expect(response.body).toMatchObject(messageError);
	})
});

describe('Import File', () => {

	it('should not be able to import csv missing a file', async () => {
		const messageError: object = { message: 'Bad Request' }
		
		const response = await request(app).post('/import');

		expect(response.status).toBe(400);
		expect(response.body).toMatchObject(messageError);
	})

	it('should be able to import csv file', async () => {
		const messageError: object = { message: 'Employees Imported' }
		
		const response = await request(app).post('/import').attach('csvFile', `${__dirname}/csvTestFile.csv`);

		expect(response.status).toBe(201);
		expect(response.body).toMatchObject(messageError);
	})

	it('should not be able to import data twice', async () => {
		const messageError: object = { message: 'There\' No Employees to Import' }
		
		const response = await request(app).post('/import').attach('csvFile', `${__dirname}/csvTestFile.csv`);

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject(messageError);
	})
});


describe('Delete Employee', () => {

	it('should not be able to delete missing a employee name', async () => {
		const messageError: object = { message: 'Bad Request' }
		
		const response = await request(app).delete(`/delete/null`);

		expect(response.status).toBe(400);
		expect(response.body).toMatchObject(messageError);
	})

	it('should be able to delete a employee', async () => {
		const employee: EmployeeTest = {
			name: 'Little Mary',
			company: 'MaryNails',
			id: 100,
		}
		const messageError: object = { message: 'Employee Deleted' }

		const response = await request(app).delete(`/delete/${employee.name}`);

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject(messageError);
	})

	it('should not be able to delete by company missing a company name', async () => {
		const messageError: object = { message: 'Bad Request' }
		
		const response = await request(app).delete(`/delete/company/null`);

		expect(response.status).toBe(400);
		expect(response.body).toMatchObject(messageError);
	})

	it('should be able to delete employees by company', async () => {
		const employee: EmployeeTest = {
			name: 'Little Mary',
			company: 'MaryNails',
			id: 100,
		}
		const messageError: object = { message: 'Employees Deleted' }

		const response = await request(app).delete(`/delete/company/${employee.company}`);

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject(messageError);
	})
});
