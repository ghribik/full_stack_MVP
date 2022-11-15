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
                alert("Reading of song data from server failed!");
            };
        })
        .catch(error => {
            console.error(error);
            alert("Song ID number missing or improperly formatted!");
        })
    };
});

//GET -- retrieve songs from a specific playlist by playlist id
const playlists = document.getElementById('playlist').addEventListener("click", event => {
    clearBox("content");
    let readPlaylistsPrompt = window.prompt("Enter playlist ID");
    console.log(readPlaylistsPrompt)
    fetch(`${ApiUrl}/api/playlists/${readPlaylistsPrompt}`)
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
        .catch(error => {
            console.error(error);
            alert("Playlist ID number missing or improperly formatted!");
        })
})

//POST --- Create a song with user-specified data
const create = document.getElementById('create').addEventListener("click", event => {
    clearBox("content");
    //let createSongPrompt = window.prompt("Enter song data formatted like below:", "title, artist, album, track, playlist");
    //let songPromptArr = createSongPrompt.split(", ");
    let songTitle = document.getElementById('songTitle').value;
    let songArtist = document.getElementById('songArtist').value;
    let songAlbum = document.getElementById('songAlbum').value;
    let songTrackNum = document.getElementById('songTrackNum').value;
    let playlistID = document.getElementById('playlistID').value;
    let song = {
        "title": songTitle,
        "artist": songArtist,
        "album": songAlbum,
        "track_num": songTrackNum,
        "playlist_id": playlistID
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
            alert("Reading of created song data from server failed!");
        };
    })
    .catch(error => {
        console.error(error);
        alert("Song data parameters missing or improperly formatted!");
    })
    let songDataFields = document.getElementsByClassName('songDataField');
    for(let i=0; i<songDataFields.length; i++){
        songDataFields[i].value = '';
    }
});

//PATCH --- Update data for a specific song by id
const patch = document.getElementById('update').addEventListener("click", event => {
    clearBox("content");
    let updateSongPromptID = window.prompt("Enter song ID to edit:", "1");
    let updateSongPrompt = window.prompt("Enter song data formatted like below:", "title, artist, album, track, playlist");
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
            alert("Reading of updated song data from server failed!");
        };
    })
    .catch(error => {
        console.error(error);
        alert("Song data parameters missing or improperly formatted!");
    })
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
     .catch(error => {
        console.error(error);
        alert("Song ID number missing or improperly formatted!");
    })
 });


 function clearBox(elementID)
{
    document.getElementById(elementID).innerHTML = "";
};


const searchButton = document.getElementById('search').addEventListener("click", event => {
    let footer = document.getElementById('footer').innerHTML = '';
    let queryInput = document.getElementById('query').value;
    console.log(queryInput);
    event.preventDefault();
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': '76af4ca374mshf7643492cfe0a22p15555djsna0d4900b33d3',
            'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
        }
    };
    
    fetch(`https://shazam.p.rapidapi.com/search?term=${queryInput}&locale=en-US&offset=0&limit=6`, options)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            console.log(response.tracks.hits[0].track.share.subject);
            console.log (response.tracks.hits[0].track.images.coverart);
            createCard(response)
        })
        .catch(err => console.error(err));
});

function createCard(response) {
    for(let i = 0; i < 6; i ++){
        let songCard = document.createElement('div');
        songCard.setAttribute("class", "card");
        songCard.style.float = "left";
        let cardImg = document.createElement('img');
        cardImg.setAttribute("src", response.tracks.hits[i].track.images.coverart);
        cardImg.setAttribute("alt", "Avatar");
        cardImg.style.width= "300px";
        songCard.appendChild(cardImg);
        let cardContainer = document.createElement('div');
        cardContainer.setAttribute("class", "container");
        songCard.appendChild(cardContainer);
        let cardTitle = document.createElement('h4');
        cardTitle.innerHTML = response.tracks.hits[i].track.share.subject;
        cardContainer.appendChild(cardTitle);
        footer.appendChild(songCard);
    };
};