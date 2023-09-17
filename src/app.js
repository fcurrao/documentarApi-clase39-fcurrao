import express from 'express'
import cookieParser from 'cookie-parser' 
import session from 'express-session'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import routerProducts from './routes/products.router.js' 
import routerCarts from './routes/carts.router.js'
import routerViews from './routes/views.router.js'
import sessionRouter from './routes/session.routes.js'
import { Server } from "socket.io";
import ProductManager from './DAOs/ProductManagerMongo.class.js'
import MongoStore from 'connect-mongo' 
import mongoose from 'mongoose'   
// import initializePassport from './config/passport.config.js'
import { initializePassport } from '../src/config/passport.config.js'
// import { initializePassport } from './config/passport.config.js'
// import  initialize  from 'passport'
import passport from 'passport' 
// import jwt from 'jsonwebtoken' 
import jwt from 'passport-jwt'  
import dotenv from 'dotenv'
import { Command } from 'commander'
import router from './routes/user.router.js'
//  import {addLogger} from './logger.js'
 import cluster from 'cluster'
 import { addLogger } from './utils.js';
 import { logger } from './utils.js'; 

 import swaggerJSDoc from 'swagger-jsdoc'
 import swaggerUiExpress from 'swagger-ui-express'

 
//**********************

///// ************************
import  { initializePassportJWT } from '../src/config/jwt.passport.js'
import { errorMiddleware } from './services/middleware/error.middleware.js'
// import  { initializePassportLocal } from '../src/config/local.passport.js'
import {suma} from 'calculadora-easy-2'

let resultado = suma(20,2)
logger.info("resultado",resultado);
// consola:  22
///// ************************

//***********************************************

//  COMANDO POR CONSOLA ! 
const program = new Command()
program.option('--mode <mode>', 'modo/entorno de trabajo', 'dev' )
program.parse()

logger.info(program.opts());

const mode = program.opts().mode

// dotenv.config()
dotenv.config({
  path: mode == 'dev' ? './.env.development' : './.env.production'
  // SE USA ESTA BARRA \ ??
})
logger.info(" CONNECTADO DESDE : ", process.env.USER);
logger.info(" process.env.PORT", process.env.PORT);
// app.listen(process.env.PORT)

// console.log(cluster.isPrimary) // TRUE
// if(cluster.isPrimary){
//   console.log("proceso primario (maestro), genera procesos trabajadores");
//   cluster.fork()
// } else {
//   console.log("soy un worker (secundario)");
// }

// ahora si tiro : 
//  node app.js --mode env 

//*********************************************** 

// initial configuration
const app = express(); // inicializo el servidor 
// 
const connection = mongoose.connect(
  process.env.MONGO_CONNECTION,
{useNewUrlParser: true, useUnifiedTopology:true}) 

app.use(express.json()); //json
app.use(express.urlencoded({ extended: true }));  // 
app.use(express.static(__dirname + "/public")); // static
app.use(addLogger)

// app.use(passport.initialize());
// app.use(passport.initialize)
// app.use(cookieParser("firmaDeLaCookie"))  // cookies  
initializePassport()

///// ************************
app.use(cookieParser())  
initializePassportJWT()
// initializePassportLocal()
app.use(passport.initialize());
///// ************************

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'titulo documentacion',
      description: 'esta es la documentacion del trabajo'
    },
    
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}

 const specs = swaggerJSDoc(swaggerOptions)
app.use('/apidocs', swaggerUiExpress.serve,swaggerUiExpress.setup(specs) )


app.use(
  session({
    store: new MongoStore({
      mongoUrl:        
  process.env.MONGO_CONNECTION,
    }),
    secret: "mongoSecret",
    resave: true,
    saveUninitialized: false,
  })
);
  
// app.use(passport.initialize())


// app.get('/user', (req,res)=>{
//   req.session.user = req.query.name 
//   res.send('session set')
// })



// handlebars
app.set("views", __dirname + "/views"); // seteo la carpeta vistas
app.set("view engine", "handlebars"); // seteo la carpeta engine.
app.engine("handlebars", handlebars.engine({
  extname: 'handlebars', 
  runtimeOptions:{allowProtoPropertiesByDefault:true,
    allowedProtoMethodsByDefault:true}
  })); 
 

// routers 
app.post('/login2', (req,res)=>{
  const { email, password} = req.body
  if (email=='coder@coder.com' && password=='coderpass'){
    let token = jwt.sign({email,password}, 'coderSecret' , {expriresIn: '24h'} )
    res.cookie('coderCookie',token , {httpOnly:false}).send({status: 'succes'})

  }
   else { 
    res.status(400).send({status : 'error'})
   }
})


app.get('/session', (req, res)=>{
  const name = req.query.name
  if(!req.session.user){
    req.session.user = name
    req.session.contador = 1
    return res.send('bienvenido ' + req.session.user)
  } else{
    req.session.contador++
    return res.send('Es tu visita numero: ' + req.session.contador)
  }
})

app.get('/cookies', (req, res)=>{
  res.render('cookies')
})

app.post('/cookies2', (req, res)=>{
  const data = req.body
  res.cookie(data.name, data.email, {maxAge:10000} , {signed:true} ).send({status: 'succes'})
})

app.get('/cookies2', (req, res)=>{
  console.log("res.cookie", req.cookies) //  cookies2
  res.end()
})


app.use((req,res,next)=>{
  req.socketServer = socketServer
  next()
})

// Mas routers
app.use("/", routerViews); //

app.use(express.json());
app.use("/api/users", router);
app.use(errorMiddleware)

app.use("/api/sessions", sessionRouter); //
app.use("/products", routerProducts);
app.use("/carts", routerCarts);

// server start and socket io
const expressServer = app.listen(process.env.PORT, () =>  logger.warn("Servidor levantado")) // levanto servidor
const socketServer = new Server(expressServer)  //servidor con socket

socketServer.on("connection", async (socket) => { 
 logger.info("Estas conectado " + socket.id)

  let productManager = new ProductManager()

  // Se envian todos los productos al conectarse
  socket.emit("update-products", await productManager.getProducts(10, 1,0,null,null))


  // se edita el producto 
  socket.on("upload-product", async (productData) => {
    await productManager.updateProduct(productData)
    socketServer.emit("update-products", await productManager.getProducts(10, 1,0,null,null))
  })
  // Se agrega el producto y se vuelven a renderizar para todos los sockets conectados
  socket.on("add-product", async (productData) => {
    await productManager.addProduct(productData)
    socketServer.emit("update-products", await productManager.getProducts(10, 1,0,null,null))
  })

  // Se elimina el producto y se vuelven a renderizar para todos los sockets conectados
  socket.on("delete-product", async (productID) => {
    await productManager.deleteProduct(productID)
    socketServer.emit("delete-products", await productManager.getProducts(10, 1,0,null,null))
  }) 
  
    // socketServer.emit('deleteProduct', product.id)


const mensajes = [];
 socket.on("message", (data) => {
  logger.info("data,",data)
    mensajes.push({ socketId: socket.id, message: data });
    logger.info("mensajes", mensajes)
    socketServer.emit("imprimir", mensajes);
  });
})


