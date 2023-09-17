 import winston from "winston"


 export const customLevelsOptions = {
    levels:{
        fatal:0,
        error:1,
        warn:2,
        info:3,
        http:4, 
        debug:5,
    }, 
    colors: {
        fatal:'red',
        error:'green',
        warn:'yellow',
        info:'cyan',
        http:'blue', 
        debug:'grey',
    }
 }


 const logger = winston.createLogger({

    transport : [
        new winston.transports.Console({
            level: "http"
           
        })
    ]
 })
 

export const addLogger = (req,res,next) => {
    req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${new Date().toLocaleTimeString}`)
    next();
}
