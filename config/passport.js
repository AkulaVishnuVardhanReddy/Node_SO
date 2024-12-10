const passport = require("passport");
const googleStrategy = require("passport-google-oauth20").Strategy;
const pool = require("./db");

passport.use(
    new googleStrategy(
        {
            clientID: process.env.google_clientid,
            clientSecret: process.env.google_clientsecret,
            callbackURL: "http://localhost:4000/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const { id, displayName, emails } = profile;
                const email = emails[0].value;

                const user = await pool.query(
                    'INSERT INTO google_users (google_id, email, name) VALUES ($1, $2, $3) ' +
                    'ON CONFLICT (google_id) DO UPDATE SET name = $3 RETURNING *',
                    [id, email, displayName]
                );
                

                
                done(null, user.rows[0]);
            } catch (err) { 
                done(err, null); 
            }
        }
    )
);


passport.serializeUser((user,done)=> done(null,user.id));
passport.deserializeUser(async(id,done)=>{
    const user = await pool.query('select * from google_users where id = $1',[id]);
    done(null,user.row[0]);
});