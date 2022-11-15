//const ENV = "production";
const ENV = "production";
const ApiUrl = ENV == "dev" ? "http://localhost:3001" : "https://api-server-qr13.onrender.com";

//GET --- read and display song information for all songs or by ID
const read = document.getElementById('read').addEventListener("click", event => {
    clearBox("content");
    let readSongsPrompt = window.prompt("Enter song ID or leave blank to see all songs");
    if(readSongsPrompt === ""){
        fetch(`${ApiUrl}/api/songs`)
        .then(response => response.json())
        .then(data => {
            data.forEach(song => {
                let songElement = document.createElement('li')
                songElement.innerHTML = `ID: ${song.id}, 
                Title: ${song.title}, 
                Artist: ${song.artist}, 
                Album: ${song.album}, 
                Track:${song.track_num}, 
                Playlist: ${song.playlist_id}`;
                content.appendChild(songElement)
            })
        })
    }else{
        fetch(`${ApiUrl}/api/songs/${readSongsPrompt}`)
        .then(response => response.json())
        .then(songs => {
            if(songs){
                let song = songs[0]
                let songElement = document.createElement('li');
                songElement.innerHTML = `ID: ${song.id}, 
                Title: ${song.title}, 
                Artist: ${song.artist}, 
                Album: ${song.album}, 
                Track:${song.track_num}, 
                Playlist: ${song.playlist_id}`
                content.appendChild(songElement)
            }else{
                alert("Song data parameters missing or improperly formatted!");
            };
        })
        .catch(error => {
            if(error.response) console.log(error.response.data);
        })
    };
});

//POST --- Create a song with user-specified data
const create = document.getElementById('create').addEventListener("click", event => {
    clearBox("content");
    let createSongPrompt = window.prompt("Enter song info: title, artist, album, track, playlist");
    let songPromptArr = createSongPrompt.split(", ");
    let song = {
        "title": songPromptArr[0],
        "artist": songPromptArr[1],
        "album": songPromptArr[2],
        "track_num": songPromptArr[3],
        "playlist_id": songPromptArr[4]
    };

    fetch(`${ApiUrl}/api/songs/`, {
        method: 'POST',
        mode: "cors",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(song)
    })
    .then(response => response.json())
    .then(songs => {
        if(songs){
            let song = songs[0]
            let songElement = document.createElement('li');
            songElement.innerHTML = `ID: ${song.id}, 
            Title: ${song.title}, 
            Artist: ${song.artist}, 
            Album: ${song.album}, 
            Track:${song.track_num}, 
            Playlist: ${song.playlist_id}`
            content.appendChild(songElement)
        }else{
            alert("Song data parameters missing or improperly formatted!");
        };
    })
    .catch(err => console.error(err))
});

//PATCH --- Update data for a specific song by id
const patch = document.getElementById('update').addEventListener("click", event => {
    clearBox("content");
    let updateSongPromptID = window.prompt("Enter song ID");
    let updateSongPrompt = window.prompt("Enter song info: title, artist, album, track, playlist");
    let songPromptArr = updateSongPrompt.split(", ");
    let song = {
        "title": songPromptArr[0],
        "artist": songPromptArr[1],
        "album": songPromptArr[2],
        "track_num": songPromptArr[3],
        "playlist_id": songPromptArr[4]
    };
    fetch(`${ApiUrl}/api/songs/${updateSongPromptID}`, {
        method: 'PATCH',
        mode: "cors",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(song)
    })
    .then(response => {
        if(response.status === 201){
            let songElement = document.createElement('li');
            songElement.innerHTML = `ID: ${updateSongPromptID}, 
            Title: ${song.title}, 
            Artist: ${song.artist}, 
            Album: ${song.album}, 
            Track:${song.track_num}, 
            Playlist: ${song.playlist_id}`;
            content.appendChild(songElement);
        }else{
            alert("Song data parameters missing or improperly formatted!");
        };
    })
    .catch(err => console.error(err));
});

//DELETE --- Delete a song from the database by id
const deleteSong = document.getElementById('delete').addEventListener("click", event => {
    clearBox("content");
    let deleteSongPrompt = window.prompt("Enter song ID");
     fetch(`${ApiUrl}/api/songs/${deleteSongPrompt}`, {
         method: 'DELETE',
         mode: "cors",
     })
     .then(response => {
         if(response.status == 201){
             alert("Song deletion successful!", response);
         }else{
             alert("Song ID not found or improperly formatted!", response);
         };
     })
     .catch(err => console.error(err))
 });

 function clearBox(elementID)
{
    document.getElementById(elementID).innerHTML = "";
}