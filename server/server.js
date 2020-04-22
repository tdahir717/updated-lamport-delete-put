// express sets up our web server
const express = require( 'express' );
const app = express();

// bodyParser helps parse request bodies for POST
const bodyParser = require( 'body-parser' );

// configuration 
app.use( express.static( 'server/public' ) ) ;
app.use( bodyParser.urlencoded( { extended: true } ) );

// Get & use Songs Router
const songRouter = require('./routes/song.router.js');
app.use('/song', songRouter);

// get the server listening for requests
app.listen( 5000, ()=>{
    console.log( 'server listening at http://localhost:5000' );
}) 