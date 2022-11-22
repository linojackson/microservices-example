import { Router } from 'express';
import { CompaniesController } from '@controllers/CompaniesController';
import { dbTestController } from '@controllers/dbTestController';

const routes = Router();

routes
	.get('/allCompanies', CompaniesController.list )
	.get('/company/:name', CompaniesController.find )
	.post('/create', CompaniesController.create )
	.delete('/delete/:name', CompaniesController.delete )
	// Routes for set dbTest
	.get('/refresh/dbTest', dbTestController.refreshDb )
	.get('/drop/dbTest', dbTestController.drop )
	.post('/seed/dbTest', dbTestController.seedDb );

export { routes }