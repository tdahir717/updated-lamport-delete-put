// Get express to create a Router
let express = require('express');
let router = express.Router();
let pg = require('pg');

// TODO Add Database stuff
//  DB CONNECTION CONFIG
const Pool = pg.Pool;
const pool = new Pool({
  database : 'music_library', //  THIS MAY AND WILL CHANGE OFTEN WITH DIFFERENT PROJECTS
  host: 'localhost',
  port: 5432,
  max: 10, // How many queries at one time?
  idleTimeoutMillis: 30000 // 30seconds to try to connect
});

// Helpers!
pool.on('connect', () => {
  console.log('postgres connected!')
});

pool.on('error', (error) => {
  console.log('error with postgres pool', error)
})



// TODO - GET all songs 
router.get( '/', ( req, res )=>{
  console.log( 'in /songs GET' );
  let queryText = `SELECT * FROM "songs";`
  // GO TO DB, EXECUTE QUERY, SEND BACK ROWS
  pool.query(queryText)
  .then((result) => {
    //result has a lot of extra data, we care about result.rows
    // console.log(result.rows);
    res.send(result.rows);

  }).catch((error) => {

    console.log(error);
    res.sendStatus(500);

  });
  // res.send([]);
}) 

// TODO - POST - add a new song
router.post( '/', ( req, res ) => {
  console.log( 'POST hit:', req.body );
  //Template the query
  let queryText = `
    INSERT INTO "songs" ("rank", "track", "artist", "published")
    VALUES ($1, $2, $3, $4);`
  // GO TO DB, EXECUTE QUERY, SEND BACK STATUS
  //Sanitization!
  pool.query(queryText, [req.body.rank, req.body.track, req.body.artist, req.body.published])
  .then((result) => {
    res.sendStatus(201);
  }).catch((error) => {
    console.log(error)
    res.sendStatus(500);
  })
  // res.sendStatus(200);
})

router.delete( '/:id', ( req, res )=>{
  console.log( 'in /song DELETE:', req.params.id );
  let queryString = `DELETE FROM songs WHERE id=$1`;
  pool.query( queryString, [ req.params.id ] ).then( ( result )=>{
    res.sendStatus( 200 );
  }).catch( ( err )=>{
    console.log( err );
    res.sendStatus( 500 );
  })
}) // end DELETE

module.exports = router;