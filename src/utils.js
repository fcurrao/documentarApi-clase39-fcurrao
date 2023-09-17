import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt' 
import {faker } from '@faker-js/faker'
import winston from 'winston';
import {customLevelsOptions} from '../src/logger.js'

// import __dirname from "../index.js";
import multer from 'multer';

export const createHash = password => bcrypt.hashSync(password,bcrypt.genSaltSync(10))
export const isValidPassword = (user, password) => bcrypt.compareSync(password,user.password)


const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,`${__dirname}/../public/img`)
    },
    filename:function(req,file,cb){
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})

const uploader = multer({storage})

// export default uploader;


export const logger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
          new winston.transports.Console({ 
            level: "info",
            format: winston.format.combine(
                winston.format.colorize({colors:customLevelsOptions.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: '../errors.log',
            lee: 'warning',
            format: winston.format.simple()
        })
    ]
})
export const addLogger = (req,res,next) => {
    req.logger = logger;
    req.logger.http(`${req.methos} en ${req.url} - ${new Date().toLocaleTimeString}`)
    next()
}


export const generateProduct = () => {
    return {
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        description: faker.commerce.productDescription(),
        stock: faker.random.numeric(1),
        image: faker.image.image()
    }
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); 

// console.log(__filename)
// console.log(__dirname)

export default __dirname; // Basicamente, __dirname es el directorio donde se encuentra este archivo