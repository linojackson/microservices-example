import { Router } from 'express';
import { EmployeesController } from '@controllers/EmployeesController';
import { dbTestController } from '@controllers/dbTestController';

const routes = Router();

routes
	.get('/allEmployees', EmployeesController.list )
	.get('/employee/:name', EmployeesController.find )
	.get('/company/:company', EmployeesController.findByCompany )
	.post('/create', EmployeesController.create )
	.delete('/delete/:name', EmployeesController.delete )
	.delete('/delete/company/:name', EmployeesController.deleteByCompany )
	.post('/import', EmployeesController.import )
	// Routes for set dbTest
	.get('/refresh/dbTest', dbTestController.refreshDb )
	.get('/drop/dbTest', dbTestController.drop )
	.post('/seed/dbTest', dbTestController.seedDb );

export { routes }