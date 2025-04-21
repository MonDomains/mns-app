import Express, { NextFunction, Request, Response } from "express";
let router: Express.Router = Express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction ) => {
    res.render("index", {  
        timestamp: Date.now() 
    })
});

router.get(["/name/:name.mon", "/name/:name"], (req: Request, res: Response, next: NextFunction ) => {
    res.redirect(301, `/${req.params.name.replace(".mon", "")}.mon`)
});

router.get("/:name.mon", (req: Request, res: Response, next: NextFunction ) => {
    res.render("index", { 
        title: `${req.params.name}.mon - Web3 Profile`,
        description: `View ${req.params.name}.mon web3 profile on Monad Blockchain.`,
        canonicalUrl: `/${req.params.name}.mon`, 
        name: encodeURIComponent(req.params.name) +".mon", 
        timestamp: Date.now() 
    });
}); 

router.get(["/account", "names"], (req: Request, res: Response, next: NextFunction ) => {
    res.render("index", {  
        title: `My Names - MNS`,
        timestamp: Date.now() 
    })
});

router.get(["/address/:address", "names"], (req: Request, res: Response, next: NextFunction ) => {
    res.render("index", {  
        title: `View names of ${req.params.address} address`,
        timestamp: Date.now() 
    })
});

router.get(["/register/:name"], (req: Request, res: Response, next: NextFunction ) => {
    res.redirect(301, `/register/${req.params.name.replace(".mon", "")}.mon`)
});

router.get(["/register/:name.mon"], (req: Request, res: Response, next: NextFunction ) => {
    res.render("index", {  
        title: `Register ${req.params.name}.mon`,
        description: `Claim ${req.params.name}.mon on Monad blockchain`,
        timestamp: Date.now() 
    })
});

export default router;