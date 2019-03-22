let express = require("express");
let app = express();

app.get("/", function(request, response){
  return response.status(200).send();
});

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const Sequelize = require('sequelize');

const Playlist = require("./models/playlist");
const Artist = require("./models/artist");
const Album = require("./models/album");
const Track = require("./models/track");
const Media_Type = require("./models/media-type");
const Genre = require("./models/genre");


// defining table relationships
Artist.hasMany(Album, {
  foreignKey:"ArtistId"
});

Album.belongsTo(Artist, {
  foreignKey:"ArtistId"
});

Playlist.belongsToMany(Track, {
  through:'playlist_track', //the join table
  foreignKey:'PlaylistId',
  timestamps:false // playlist_track has no timestamps
});

Track.belongsToMany(Playlist, {
  through:"playlist_track",
  foreignKey:"TrackId",
  timestamps:false
});

Track.belongsTo(Album, {
  foreignKey:"AlbumId"
});

Track.hasOne(Media_Type, {
  foreignKey:"MediaTypeId"
});

Track.hasOne(Genre, {
  foreignKey:"GenreId"
});

app.patch("/tracks/:id", function(request, response){
  Track.findByPk(request.params.id, {
    include: [Genre, Media_Type, Album]
  }).then(function(track){
    if(track){
      let changes = request.body;
      track.update(changes).then(function(updatedTrack){
        response.json(updatedTrack);
      }, function(errorResponse){
        response.status(422).json({
          errors:errorResponse.errors.map(function(error){
            return {
              attribute:error.path,
              message:error.message
            }
          })
        });
      });
    } else {
      response.json(404);
    }
  });
});

app.delete("/api/playlists/:id", function(request, response){
  let { id } = request.params;
  Playlist.findByPk(id).then(function(playlist){
    if (playlist){
      return playlist.setTracks([]).then(function(){
        return playlist.destroy();
      });
    } else {
      return Promise.reject();
    }
  }).then(function(){
    response.status(204).send();
  }, function(){
    response.status(404).send();
  })
});

app.post("/api/artists", function(request, response){
  Artist.create({
    name:request.body.name
  }).then(function(createdArtist){
    response.json(createdArtist)
  }, function(errorResponse){
    response.status(422).json({
      errors:errorResponse.errors.map(function(error){
        return {
          attribute:error.path,
          message:error.message
        };
      })
    });
  });
});

app.get("/api/playlists", function(request, response){
  // allowing URL queries
  let filter = {}
  let { q } = request.query;
  if (q){
    filter = {
      where: {
        name: {
          [Sequelize.Op.like]:`${q}%`
        }
      }
    }
  }

  Playlist.findAll(filter).then(function(playlists){
    response.json(playlists);
  });
});

app.get("/api/playlists/:id", function(request, response){
  Playlist.findByPk(request.params.id, {
    include: [Track]
  }).then(function(result){
    if (result){
      response.json(result);
    } else {
      response.status(404).send();
    }

  });
});

app.get("/api/tracks/:id", function(request, response){
  let { id } = request.params;
  Track.findByPk(id, {
    include: [Playlist]
  }).then(function(result){
    if (result){
      response.json(result);
    } else {
      response.status(404).send();
    }
  });
});

app.get("/api/artists/:id", function(request, response){
  let { id } = request.params;
  Artist.findByPk(id, {
    include:[Album]
  }).then(function(result){
    if (result){
      response.json(result);
    } else {
      response.status(404).send();
    }
  })
})

app.get("/api/albums/:id", function(request, response){
  let { id } = request.params;
  Album.findByPk(id, {
    include:[Artist]
  }).then(function(result){
    if (result){
      response.json(result)
    } else {
      response.status(404).send();
    }
  })
});

app.listen(process.env.PORT || 8000);
