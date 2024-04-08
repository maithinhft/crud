import express, {Request, Response} from 'express';
import * as ethers from 'ethers';
import abi from '../../abi/Factory.json';
import * as dotenv from "dotenv";
dotenv.config();
import { checkNumber } from '../../../utils/utils'

let contractAddress: string  =  process.env.ADDRESS ?? "";
let rpc_url: string = process.env.RPC_URL ?? "";
let privateKey: string = process.env.PRIVATE_KEY ?? "";
let wallet = new ethers.Wallet(privateKey, new ethers.JsonRpcProvider(rpc_url));

let contract = new ethers.Contract(contractAddress, abi, wallet);


export class EmployeeController {
    public async addEmployee(req: Request, res: Response) {
        try {
            const {id, name, role} = req.body;
            
            if (typeof id != 'number') {
                throw new Error("Invalid id");
            }
            
            if (typeof name != 'string' || name === '') {
                throw new Error('Invalid name');
            }   

            if (typeof role != 'string' || role === '') {
                throw new Error('Invalid role');
            }

            const tx_employee = await contract.Add(id, name, role);
            const employee = await tx_employee.wait();
            res.status(200).json(employee);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    
    }

    public async getEmployee(req: Request, res: Response) {
        try {
            const { id } = req.params;

            console.log(typeof id);

            if (!checkNumber(id)) {
                throw new Error('Invalid id');
            }
    
            const employee = await contract.Get(id);
            
            if (employee[0] === '') {
                return res.status(404).json({message: "Employee is not found"});
            }

            const response = {
                "name": employee[0],
                "role": employee[1]
            }
            res.status(200).json(response);
        } catch (error: any) {
            res.status(500).json({message: error.message});
        }    
    }

    public async updateEmployee(req: Request, res: Response) {
        try {
            const { id } = req.params;
            let {name, role} = req.body;

            if (!checkNumber(id)) {
                throw new Error('Invalid id');
            }

            if ((typeof name != 'string' && typeof name != "undefined") || name === '') {
                throw new Error('Invalid name');
            }

            if ((typeof role!= 'string' && typeof name != "undefined") || role === '') {
                throw new Error('Invalid role');
            }

            const currEmployee = await contract.Get(id);
            if (currEmployee[0]=='') {
                return res.status(404).json({message: "Cannot find employee"});
            }
            
            if (!name) name = currEmployee[0];
            if (!role) role = currEmployee[1];

            const employee = await contract.Update(id, name, role);
            await employee.wait();
    
            if (!employee) {
                return res.status(404).json({message: "Cannot find employee"});
            }
    
            const newEmployee = await contract.Get(id);
            const response = {
                "name": newEmployee[0],
                "role": newEmployee[1]
            }
            res.status(200).json(response);
    
        } catch (error: any) {
            res.status(500).json({message: error.message});
        }
    
    }

    public async deleteEmployee(req: Request, res: Response) {
        try {
            const { id } = req.params;

            if (!checkNumber(id)) {
                throw new Error('Invalid id');
            }

            let employee = await contract.Get(id);

            if (employee[0]=='') {
                return res.status(404).json({message: "Cannot find employee"});
            }
    
            employee = await contract.Delete(id);
            await employee.wait();
    
            res.status(200).json({ message: "employee deleted successfully" });
    
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    
    }

}
