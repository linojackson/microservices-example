export class Company {
	name: string;
}
export class CompanyTest {
	id?: number;
	name?: string | number;
	createdAt?: string | Date;
	updatedAt?: string | Date;
}

export class CompaniesTest extends Array<CompanyTest>{}