import passport from "passport";
import jwt from ' passport-jwt'

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

export const initializePassport = () => {
    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookiesExtractor]),
        secretOrKey: 'coderSecret'
        
    }, async(jwt_payloud, done) =>{
        try{
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }))
}

const cookiesExtractor  = req => {
    let token = null
    if( req && req.cookies ){
        token = req.cookies['cooderCokies'] 
    } 
    else {
        return token; 
    }
}