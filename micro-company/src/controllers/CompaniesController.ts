import * as DB from '@config/migrations';
import { Request, Response } from 'express';

export class CompaniesController {

	public static async list(request: Request, response: Response): Promise<Response> {

		const companies = await DB.companiesTable.findAll()

		if (companies) {
			return response.status(200).json({ companies: companies });
		}
		return response.status(500).json({ message: 'Internal Server Error' });
	}

	public static async find(request: Request, response: Response): Promise<Response> {
		
		if (request.params.name == 'null') {
			return response.status(400).json({ message: 'Bad Request' });
		}

		const company = await DB.companiesTable.findOne({ where: { name: request.params.name }})

		if (company) {
			return response.status(200).json({ company: company });
		}
		return response.status(404).json({ message: 'Company Not Found' });
	}

	public static async create(request: Request, response: Response): Promise<Response> {
		
		if (!request.body.name) {
			return response.status(400).json({ message: 'Bad Request - Missing Name' });
		}
		
		if (typeof request.body.name !== 'string' ) {
			return response.status(400).json({ message: 'Bad Request - Name Must Be String' });
		}
		
		const foundedCompany = await DB.companiesTable.findOne({where: { name: request.body.name }})
		
		if (foundedCompany) {
			return response.status(400).json({ message: 'Bad Request - Company Already Exists' });
		}
		
		const companyCreated = await DB.companiesTable.create(
			{
				name: request.body.name
			}
		);

		if (companyCreated) {
			return response.status(201).json({ message: 'Company Created' });
		}
		return response.status(500).json({ message: 'Internal Server Error' });
	}

	public static async delete(request: Request, response: Response): Promise<Response> {
		
		if (request.params.name == 'null') {
			return response.status(400).json({ message: 'Bad Request' });
		}

		const company = await DB.companiesTable.destroy({where: { name: request.params.name }})

		if (company) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			await request.producer.send({
				topic: 'microservices-topic',
				messages: [
					{ value: request.params.name }
				],
			})
			return response.status(200).json({ message: 'Company Deleted' });
		}

		return response.status(500).json({ message: 'Internal Server Error' });
	}
}