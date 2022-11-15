const express = require('express');
const cors = require('cors');
const { Client } = require('pg');

const config = require('./config')[process.env.NODE_ENV||"dev"]
const PORT = config.port;

const client = new Client({
    connectionString: config.connectionString,
});

client.connect();

const app = express()
app.use(cors());
app.use(express.json());


app.get('/api/songs', (req, res, next) => {
    async function getSongs() {
        try {
            const result = await client.query('SELECT * FROM songs');
            res.status(202).send(result.rows);
        } catch (err) {
            next(err);
        };
    };
    getSongs();
});

app.get('/api/songs/:id', (req, res, next) => {
    async function getSongByID() {
        try {
            const result = await client.query(`SELECT * FROM songs
            WHERE id = ${req.params.id}`);

            if(result.rows.length === 0){
                res.status(404).send("Song ID not found or improperly formatted!");
            }else{
                res.status(202).send(result.rows);
            };
        } catch (err) {
            next(err);
        };
    };
    getSongByID();
});

app.get('/api/playlists/:id', (req, res, next) => {
    async function getPlaylistByID() {
        try {
            const result = await client.query(`SELECT * FROM songs, playlists
            WHERE songs.playlist_id = playlists.id AND playlists.id = ${req.params.id}`);

            if(result.rows.length === 0){
                res.status(404).send("No songs found!");
            }else{
                res.status(202).send(result.rows);
            };
        } catch (err) {
            next(err);
        };
    };
    getPlaylistByID();
});

app.post('/api/songs/', (req, res, next) => {
    let song = req.body;
    if(song.album && song.artist && song.playlist_id && song.title && song.track_num){
        async function postSong(songJSON) {
            try {
                const result = await client.query(`INSERT INTO songs (title, artist, album, track_num, playlist_id) 
                VALUES ($1, $2, $3, $4, $5) RETURNING *`, [songJSON.title, songJSON.artist, songJSON.album, songJSON.track_num, songJSON.playlist_id]);
                res.status(201).send(result.rows);
            } catch (err) {
                next(err);
            };
        };
        postSong(song);
    }else{
        res.status(500).send("Format = title, artist, album, track_num, playlist_id!")
    };
});

app.patch('/api/songs/:id', (req, res, next) => {
    let song = req.body;
    console.log(song);
    async function patchSong() {
        try {
            if (song.title !== undefined) {
                const resultTitle = await client.query(`UPDATE songs SET title = $1
                WHERE id = $2 RETURNING *`, [song.title, req.params.id]);
            };
            if (song.album !== undefined) {
                const resultAlbum = await client.query(`UPDATE songs SET album = $1
                WHERE id = $2 RETURNING *`, [song.album, req.params.id]);
            };
            if (song.artist !== undefined) {
                const resultArtist = await client.query(`UPDATE songs SET artist = $1
                WHERE id = $2 RETURNING *`, [song.artist, req.params.id]);
            };
            if (song.track_num !== undefined) {
                const resultTrack = await client.query(`UPDATE songs SET track_num = $1
                WHERE id = $2 RETURNING *`, [song.track_num, req.params.id]);
            };
            if (song.playlist_id !== undefined) {
                const resultPlaylist = await client.query(`UPDATE songs SET playlist_id = $1
                WHERE id = $2 RETURNING *`, [song.playlist_id, req.params.id]);
            };
            const result = await client.query(`SELECT * FROM songs
            WHERE id = $1`, [req.params.id]);
            res.status(201).send(result.rows);
        } catch (err) {
            next(err);
        };
    };
    patchSong();
});

app.delete('/api/songs/:id', (req, res, next) => {
    async function deleteSong() {
        try {
            const result = await client.query(`SELECT * FROM songs
            WHERE id = ${req.params.id}`);
            if(result.rows.length === 0){
                res.status(404).send("Song ID not found or improperly formatted!");
            }else{
                const deletion = await client.query(`DELETE FROM songs
                WHERE id = ${req.params.id}`);
                res.status(201).send('Successfully deleted ' + req.params.id);
            };
        } catch (err) {
            next(err);
        };
    };
    deleteSong();
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal server error!');
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});