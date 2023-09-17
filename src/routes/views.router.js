import { Router } from 'express';
import __dirname, { generateProduct } from "../utils.js"
import ProductManager from '../DAOs/ProductManagerMongo.class.js';
import CartManager from '../DAOs/CartManagerMongo.class.js';
import twilio from "twilio";
import nodemailer from "nodemailer";

import { addLogger } from '../utils.js';
import { logger } from '../utils.js';

let productManager = new ProductManager()
let cartManager = new CartManager()

const router = Router();

// puse profile
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.render('logout');
})


router.get('/register', (req, res) => {
  res.render('register');
})


router.get('/restartPassword', (req, res) => {
  res.render('restartPassword');
})

router.get('/login', (req, res) => {
  res.render('login');
})
router.get('/login2', (req, res) => {
  res.render('index');
})



// puse profile
router.get('/profile', (req, res) => {
  let user = req.session.user
  let texto = ""
  if(!user){texto= `LOGUEASE: Ingrese usuario  `} else {texto = "TU PERFIL"}
    res.render('profile', {
      user: req.session.user,
      texto:  texto
  });
})

 
router.get("/mockingproducts"  , async (req, res) => {

  // let newProduct = req.body
  // await productManager.addProduct(newProduct)
  // const products = await productManager.getProducts(10, 1,0,null,null)
  // req.socketServer.sockets.emit('update-products', products)
  // res.send({status: "success"})


  let products = [];
  for( let i=0;i<50;i++) {
    products.push(generateProduct());
  }
  res.render('mocking', {
    products: products
});
  })


router.get("/editar"  , async (req, res) => {
  res.render('editarProducts', ); 
  })

router.get("/logger"  , async (req, res) => {
  // alert("testeando logger, por consola")
  logger.fatal(" PROBANDO ELLOGGER ")
logger.error("  PROBANDO ELLOGGER ! ")
  logger.warn("  PROBANDO ELLOGGER  ")
logger.info(" PROBANDO ELLOGGER  ")
  logger.http("  PROBANDO ELLOGGER  ")
logger.debug("  PROBANDO ELLOGGER ! ") 
  res.render('home', ); 
  })

router.get('/', async (req,res)=>{
  let products = await productManager.getProducts(10, 1,0,null,null); 
  res.render('home', {
    title: "Inicio",
    products: products
  });
})

router.get('/realtimeproducts', async (req,res)=>{
  res.render('realTimeProducts');
})


router.get('/chat',async  (req,res)=>{ 
  await productManager.getProducts(10, 1,0,null,null).then(() => {
    req.socketServer.sockets.emit('update-products')
    res.render('chat', { style: "home.css", title: "Chat" })

  })
})

router.get('/mail',async  (req,res)=>{ 
    res.render('mail')
  }) 
router.get('/sms',async  (req,res)=>{ 
    res.render('sms')
  }) 




const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "gque.fc@gmail.com",
    pass: "fuqcqcqcsphzebxa",
  },
});

router.get("/mailsent", async (req, res) => {
  let result = await transport.sendMail({
    from: "gque.fc@gmail.com",
    to: "fcurrao@gmail.com",
    subject: "correo de prueba",
    html: `
    <div style='color:blue'>
        <h1>Probando Mensaje</h1> 
        <p>Este es un texto probador...</p>
        <img src="cid:luffy"/>
    </div>`,
    attachments: [
      {
        filename: "luffy.jpg",
        path: __dirname + "/public/files/luffy.jpg",
        cid: "luffy",
      },
    ],
  });
  res.send(result);
});
 
const enviarMail = async (destinatorio, asunto, cuerpo, attachaments)=>{
    let result = await transport.sendMail({
        from: "gque.fc@gmail.com",
        to: destinatorio,
        subject: asunto,
        text: cuerpo,
        attachments: attachaments,
      });
}



const twilioAccoutSID = "ACc1200fe5641a51115f69cec51821e3a4";
const twilioAuthToken = "03b6e518e65e08ce95974eb56f703f0b";
const twilioNumber = "+14782497323";

const client = twilio(twilioAccoutSID, twilioAuthToken);

router.get("/smssent", async (req, res) => {
  let result = await client.messages.create({
    body: `gracias ${req.query.nombre} del producto ${req.query.producto} ha sido aprobada, `,
    from: twilioNumber,
    to: "+541165727900",
  });
  res.send(result)
});
 


export default router;
 
