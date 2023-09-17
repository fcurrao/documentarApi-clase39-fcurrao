import dotenv from 'dotenv';

dotenv.config();

export default {
    // mongoUrl: process.env.MONGO_URL,
    // port: process.env.PORT,
    // adminEmail: process.env.ADMIN_EMAIL,
    // adminPassword: process.env.ADMIN_PASSWORD,
    // adminCart: process.env.ADMIN_CART,
    // mongoSecret: process.env.MONGO_SECRET,
    // githubClientId: process.env.GITHUB_CLIENT_ID,
    // githubSecret: process.env.GITHUB_SECRET,
    mongoUrl: "mongodb+srv://fcurrao1:fcurrao1@cluster0.pzrcxla.mongodb.net/ecommerce?retryWrites=true&w=majority",
    port: "8080",
    adminEmail: "adminCoder@coder.com",
    adminPassword: "coderpass",
    adminCart: "",
    mongoSecret: "mongoSecret", 
    githubClientId: "Iv1.7b358415b5d0e860",
    githubSecret: '178874e9f61399ecdb0e8606c9b60ed836f3b297',
}