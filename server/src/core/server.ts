import Express, { NextFunction, Request, Response } from "express";
import { HttpCode } from "./httpcodes";
import ejs from "ejs";
import router from "./routes";

interface ServerOptions {
    port: number
}

export class Server {
    private readonly app = Express();
    private readonly port: number;

    constructor(options: ServerOptions) {
        const {port} = options;
        this.port = port;   
    }

    async start() : Promise<void> { 

        this.app.use(Express.json())
        this.app.use(Express.urlencoded({ extended: true }))
         

        this.app.set("trust proxy", true);
        this.app.set('view engine', 'html');
        this.app.set('views', 'dist');
        this.app.engine('html', ejs.renderFile);

        ejs.delimiter = '?';
         
        this.app.locals.name = null;
        this.app.locals.timestamp = null;
        this.app.locals.canonicalUrl = "";
        this.app.locals.title = null;
        this.app.locals.description = null;
         
        this.app.use("/", router); 
 
        this.app.use(Express.static('dist'));
        
        this.app.use((req: Request, res: Response, next: NextFunction ) => {
            res.status(HttpCode.NOT_FOUND).render("index", {
                title: `Page Not Found`,
                timestamp: Date.now() 
            });
        })

        this.app.use((error: Error, req: Request, res: Response, next: NextFunction ) => {
            res.status(HttpCode.INTERNAL_SERVER_ERROR).render("index", { 
                title: `Error`,
                description: `${ error.message }`,
                timestamp: Date.now() 
             });
        })
 
        this.app.listen(this.port, ()=> {
            console.log(`Listening port: ${this.port}`);
        })
    } 
}

