import Express, { NextFunction, Request, Response } from "express";
import { HttpCode } from "./httpcodes";
import ejs from "ejs";

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

        this.app.locals.name = null;
        this.app.locals.timestamp = null;
        this.app.locals.canonicalUrl = "";

        this.app.use(Express.json())
        this.app.use(Express.urlencoded({ extended: true }))

        ejs.delimiter = '?';
    
        this.app.set("trust proxy", true);
        this.app.engine('html', ejs.renderFile);
        this.app.set('view engine', 'html');
        this.app.set('views', 'dist');
 
        this.app.use("/", (req: Request, res: Response, next: NextFunction ) => {
            if(req.url != "/") return next();
            res.render("index", { ogImageUrl: process.env.OG_DEFAULT_IMAGE_URL })
        }); 

        this.app.use(["/name/:name.mon", "/name/:name"], (req: Request, res: Response, next: NextFunction ) => {
            res.redirect(301, `/${req.params.name.replace(".mon", "")}.mon`)
        });

        this.app.use("/:name.mon", (req: Request, res: Response, next: NextFunction ) => {
            const canonicalUrl = `/${req.params.name}.mon`;
            res.render("index", { canonicalUrl: canonicalUrl, name: encodeURIComponent(req.params.name) +".mon", timestamp: Date.now() })
        }); 

        this.app.use(["/account", "/register/:name"], (req: Request, res: Response, next: NextFunction ) => {
            res.render("index", { timestamp: Date.now() })
        });  

        this.app.use(Express.static('dist'));
 
        this.app.use((req: Request, res: Response, next: NextFunction ) => {
            res.status(HttpCode.NOT_FOUND).render("index");
        })

        this.app.use((error: Error, req: Request, res: Response, next: NextFunction ) => {
            res.status(HttpCode.INTERNAL_SERVER_ERROR).render("index");
        })
 
        this.app.listen(this.port, ()=> {
            console.log(`Listening port: ${this.port}`);
        })
    } 
}

