import csvtojson from "csvtojson";
import * as DB from '@config/migrations';
import { Request, Response } from 'express';
import { Op } from "sequelize";

export class EmployeesController {

	public static async list(request: Request, response: Response): Promise<Response> {

		const employees = await DB.employeesTable.findAll()

		if (employees) {
			return response.status(200).json({ employees: employees });
		}
		return response.status(500).json({ message: 'Internal Server Error' });
	}

	public static async find(request: Request, response: Response): Promise<Response> {

		const employee = await DB.employeesTable.findOne({where: { name: request.params.name }})

		if (employee) {
			return response.status(200).json({ employee: employee });
		}
		return response.status(404).json({ message: 'Employee Not Found' });
	}

	public static async findByCompany(request: Request, response: Response): Promise<Response> {
		
		if (request.params.company === 'null') {
			return response.status(400).json({ message: 'Bad Request' });
		}

		const employees = await DB.employeesTable.findAll({where: { company: request.params.company }})

		if (employees[0]) {
			return response.status(200).json({ employees: employees });
		}
		return response.status(404).json({ message: 'Not Founded Employees For This Company' });
	}

	public static async create(request: Request, response: Response): Promise<Response> {
		
		if (!request.body.name) {
			return response.status(400).json({ message: 'Bad Request - Missing Name' });
		}
		
		if (typeof request.body.name !== 'string' ) {
			return response.status(400).json({ message: 'Bad Request - Name Must Be String' });
		}
		
		if (request.body.company && typeof request.body.company !== 'string') {
			return response.status(400).json({ message: 'Bad Request - Company Must Be String Or Null' });
		}
		
		const foundedUser = await DB.employeesTable.findOne({where: { name: request.body.name }})
		
		if (foundedUser) {
			return response.status(400).json({ message: 'Bad Request - Employee Already Exists' });
		}

		const employeeCreated = await DB.employeesTable.create(
			{
				name: request.body.name,
				company: request.body.company
			}
		);

		if (employeeCreated) {
			return response.status(201).json({ message: 'Employee Created' });
		}
		return response.status(500).json({ message: 'Internal Server Error' });
	}

	public static async delete(request: Request, response: Response): Promise<Response> {
		
		if (request.params.name == 'null') {
			return response.status(400).json({ message: 'Bad Request' });
		}

		const employee = await DB.employeesTable.destroy({where: { name: request.params.name }})

		if (employee) {
			return response.status(200).json({ message: 'Employee Deleted' });
		}

		return response.status(500).json({ message: 'Internal Server Error' });
	}

	public static async deleteByCompany(request: Request, response: Response): Promise<Response> {
		
		if (request.params.company == 'null') {
			return response.status(400).json({ message: 'Bad Request' });
		}

		const employee = await DB.employeesTable.destroy({where: { company: request.params.company }})

		if (employee) {
			return response.status(200).json({ message: 'Employees Deleted' });
		}

		return response.status(500).json({ message: 'Internal Server Error' });
	}

	public static async import(request: Request, response: Response): Promise<Response> {
		
		if (!request.files) {
			return response.status(400).json({ message: 'Bad Request' });
		}

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		const csvFile = request.files.csvFile.data.toString('utf8');
		const importedEmployees = await csvtojson().fromString(csvFile);

		const employeesNames = importedEmployees.map((employee) => employee.name);
		const preFilter = await DB.employeesTable.findAll({where: { name: { [Op.in]: employeesNames }}})
		const filterEmployees = preFilter.map((employee) => employee.dataValues.name)

		const employeesToImport = importedEmployees.filter((employee) => {
			if(filterEmployees.indexOf(employee.name) >= 0){
				return false
			}
			return true
		})

		if(!employeesToImport[0]){
			return response.status(200).json({ message: 'There\' No Employees to Import' });
		}

		const employeesSaved = await DB.employeesTable.bulkCreate(employeesToImport);

		if (employeesSaved) {
			return response.status(201).json({ message: 'Employees Imported' });
		}
		return response.status(500).json({ message: 'Internal Server Error' });
	}
}