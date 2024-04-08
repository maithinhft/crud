import { Router } from "express";
import { EmployeeController } from "../../controllers/employee/EmployeeController";

export class EmployeeRouter {
    public router: Router;
    public employeeController : EmployeeController;

    constructor() {
        this.employeeController = new EmployeeController()
        this.router = Router();
        this.routes();
    }

    routes(): void {
        this.router.post('/', this.employeeController.addEmployee);
        this.router.get('/:id', this.employeeController.getEmployee);
        this.router.put('/:id', this.employeeController.updateEmployee);
        this.router.delete('/:id', this.employeeController.deleteEmployee);
    }
}
