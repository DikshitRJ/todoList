const local_strategy =require('passport-local').Strategy
module.exports=(passport,getUserByEmail,getUserById)=>{
    passport.use(new local_strategy({usernameField: 'email',passwordField: 'pswd'}),async(email,pswd,done)=>{try{
        const user=getUserByEmail(email);
        if(user==null)return done(null,false,{message:'User not found'})
        else if(user.password===password)return done(null,false,{message:'Password incorrect'})
        else return done(null,user);
    }catch(e){return done(e)};
    });
    passport.serializeUser((email,done)=>done(null,user.id));
    passport.deserializeUser((id,done)=>done(null,getUserById(id)));
}