DROP TABLE IF EXISTS playlists, songs CASCADE;

CREATE TABLE playlists (
    id serial NOT NULL,
    playlist_name varchar(20),
    creator_name varchar(20),
    PRIMARY KEY (id)
);

CREATE TABLE songs (
    id serial NOT NULL,
    title varchar(20),
    artist varchar(20),
    album varchar(20),
    track_num int,
    playlist_id int NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT FK_playlistssongs 
    FOREIGN KEY (playlist_id) 
    REFERENCES playlists(id)
    ON DELETE CASCADE
);