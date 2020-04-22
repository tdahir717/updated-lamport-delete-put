$( document ).ready( onReady );

function onReady(){
    $( '#btn-add-track' ).on( 'click', handleClick );
    $( '#out-tracks' ).on( 'click', '.deleteSongButton', deleteSong );
    getSongs();
}

function handleClick( event ) {
    console.log( 'Clicked Add Song' );
    event.preventDefault();
    // get user input & put into an object
    let newSong = {
        rank: $( '#in-rank' ).val(),
        artist: $( '#in-artist' ).val(),
        track: $( '#in-track' ).val(),
        published: $( '#in-published' ).val()
    }

    addSong( newSong );
}

function addSong( song ){
    console.log( 'in addSong', song );
    
    //send to server via AJAX 
    $.ajax({
        type: 'POST',
        url: '/song',
        data: song
    }).then( function( response ){
        console.log( 'back from POST with:', response );
        // Get songs again, so we see new one added
        getSongs();
    }).catch( function( err ){
        alert( 'error adding track. see console for details' );
        console.log( err );
    }) 
} 

function deleteSong(){
    // get track ID
    const myId = $( this ).data( 'id' );
    console.log( 'in deleteSong:', myId );
    // make a delete ajax request with id
    $.ajax({
        type: 'DELETE',
        url: `/song/${ myId }`
    }).then( function( response ){
        // update DOM if successful
        console.log( 'back from DELETE:', response );
        getSongs();
    }).catch( function( err ){
        // catch any errors
        alert( 'no worky' );
        console.log( err );
    }) //end ajax
} // end deleteSong

function getSongs(){
    // AJAX GET call
    $.ajax({
        type: 'GET',
        url: '/song'
    }).then( function( response ){
        // response is the array of songs
        render( response )
    }).catch( function( err ){
        // handle errors
        alert( 'error getting songs. see console for details' );
        console.log( err );
    })
}

// Display (aka render) songs on the DOM 
function render( songArray ) {
    // empty output element (table body)
    $( '#out-tracks' ).empty(); 

    // add each song to the DOM
    for( let song of songArray ){
        $( '#out-tracks' ).append( `
                <tr>
                    <td>${ song.artist }</td>
                    <td>${ song.track }</td>
                    <td>${ formatDate( song.published ) }</td>
                    <td>${ song.rank } <button class="deleteSongButton" data-id=${ song.id }>Delete</button></td>
                </tr>` );
    } 
}

function formatDate( dateString ) {
    let date = new Date(dateString);
    return date.toLocaleDateString();
}