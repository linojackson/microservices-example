export class Employee {
	name: string;
	company?: string;
}
export class EmployeeTest {
	id?: number;
	name?: string | number;
	company?: string | number | null;
	createdAt?: string | Date;
	updatedAt?: string | Date;
}

export class EmployeesTest extends Array<EmployeeTest>{}