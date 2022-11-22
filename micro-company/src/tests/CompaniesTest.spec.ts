import request from 'supertest';
import { app } from '../app';
import { CompaniesTest, CompanyTest } from '@models/Company';

beforeAll(async () => {
	await request(app).get('/refresh/dbTest').send();
	await request(app).post('/seed/dbTest').send();
})

afterAll(async () => { 
	await request(app).get('/drop/dbTest').send();
})

describe('Create company', () => {

	it('should be able to create company', async () => {
		const messageError: object = { message: 'Company Created' }
		const company: CompanyTest = { name: 'JosephBussiness' };

		const response = await request(app).post('/create').send(company);

		expect(response.status).toBe(201);
		expect(response.body).toEqual(messageError);
	})

	it('should not be able to send missing name', async () => {
		const messageError: object = { message: 'Bad Request - Missing Name' }

		const response = await request(app).post('/create');

		expect(response.status).toBe(400);
		expect(response.body).toEqual(messageError);
	})

	it('should not be able to send name when is not a string', async () => {
		const messageError: object = { message: 'Bad Request - Name Must Be String' }
		const company: CompanyTest = { name: 11111111 };

		const response = await request(app).post('/create').send(company);

		expect(response.status).toBe(400);
		expect(response.body).toEqual(messageError);
	})

	it('should not be able to create company who already exists', async () => {
		const messageError: object = { message: 'Bad Request - Company Already Exists' }
		const company: CompanyTest = { name: 'JosephBussiness' };

		const response = await request(app).post('/create').send(company);

		expect(response.status).toBe(400);
		expect(response.body).toEqual(messageError);
	})
});

describe('Get companies', () => {

	it('should be able to get all companies', async () => {
		const companies: CompaniesTest = [
			{
				name: 'MaryNails',
				id: 100,
			},{
				name: 'JosephBussiness',
				id: 101,
			}
		]

		const body: object = { companies: companies }

		const response = await request(app).get('/allCompanies');

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject(body);
	})

	it('should not founded company', async () => {
		const messageError: object = { message: 'Company Not Found' }
		const company: CompanyTest = { name: 'ZezinhoOficina' };

		const response = await request(app).get(`/company/${company.name}`);

		expect(response.status).toBe(404);
		expect(response.body).toEqual(messageError);
	})

	it('should be able to get company', async () => {
		const company: CompanyTest = {
			name: 'MaryNails',
			id: 100,
		}
		const messageError: object = { company: company }

		const response = await request(app).get(`/company/${company.name}`);

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject(messageError);
	})
});

describe('Delete Company', () => {

	it('should not be able to delete missing a company name', async () => {
		const messageError: object = { message: 'Bad Request' }
		
		const response = await request(app).delete(`/delete/null`);

		expect(response.status).toBe(400);
		expect(response.body).toMatchObject(messageError);
	})

	it('should be able to delete a company', async () => {
		const company: CompanyTest = {
			name: 'MaryNails',
			id: 100,
		}
		const messageError: object = { message: 'Company Deleted' }

		const response = await request(app).delete(`/delete/${company.name}`);

		expect(response.status).toBe(200);
		expect(response.body).toMatchObject(messageError);
	})
});
