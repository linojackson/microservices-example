import { db } from "@config/db";
import * as DB from '@config/migrations';
import { Request, Response } from 'express';

export class dbTestController {

	public static async refreshDb(request: Request, response: Response): Promise<Response> {
		const dropDb = await db.drop();
		const syncDb = await db.sync({ force: true });

		if (dropDb && syncDb) {
			return response.status(200).json({ message: 'Database Refreshed' });
		}
		return response.status(500).json({ message: 'Internal Server Error' });
	}

	public static async seedDb(request: Request, response: Response): Promise<Response> {
		const employeeCreated = await DB.companiesTable.create(
			{
				name: 'MaryNails',
				createdAt: new Date(),
				id: 100,
				updatedAt: new Date(),
			}
		);

		if (employeeCreated) {
			return response.status(200).json({ message: 'Database Seeded' });
		}
		return response.status(500).json({ message: 'Internal Server Error' });
	}

	public static async drop(request: Request, response: Response): Promise<Response> {
		const dropDb = await db.drop();
		const closedDb = db.close();

		if (dropDb && closedDb) {
			return response.status(200).json({ message: 'Database Dropped' });
		}
		return response.status(500).json({ message: 'Internal Server Error' });
	}
}