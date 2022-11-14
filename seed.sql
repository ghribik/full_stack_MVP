DELETE FROM songs;
DELETE FROM playlists;

INSERT INTO playlists (playlist_name, creator_name) VALUES ('rock', 'Gabe');
INSERT INTO playlists (playlist_name, creator_name) VALUES ('pop', 'John');

INSERT INTO songs (title, artist, album, track_num, playlist_id) VALUES ('Such Great Heights', 'The Postal Service', 'Give Up', 2, 2);
INSERT INTO songs (title, artist, album, track_num, playlist_id) VALUES ('No Surprises', 'Radiohead', 'OK Computer', 10, 2);
INSERT INTO songs (title, artist, album, track_num, playlist_id) VALUES ('Rooster', 'Alice In Chains', 'Dirt', 6, 1);
INSERT INTO songs (title, artist, album, track_num, playlist_id) VALUES ('Nothing Else Matters', 'Metallica', 'Metallica', 8, 1);
INSERT INTO songs (title, artist, album, track_num, playlist_id) VALUES ('Carry On Wayward Son', 'Kansas', 'Leftoverture', 1, 1);