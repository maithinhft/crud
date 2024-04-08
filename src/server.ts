import express, {Request, Response} from "express";
import ethers from "ethers";

import Factory from "./abi/Factory.json";
import { EmployeeRouter } from "./routers/Factory/EmployeeRoutes";

require('dotenv').config();

class Server {
    public app: express.Application;
    constructor() {
        this.app = express();
        this.routes();
    }

    public routes(): void {
        this.app.use(express.json());
        this.app.get('/', async(req: Request, res: Response) =>{
            console.log(req.ip);
            res.send({message: "server is online!"});
        });

        this.app.use('/employees', new EmployeeRouter().router);
    }
    
    public start(): void {
        this.app.listen(3000, () => {
            console.log("API server is listening on port 3000");           
        });
    }
}

async function startServer(): Promise<void> {
    const server = new Server();

    server.start();
}

startServer();