var nt     = require('..')
  , vows   = require('vows')
  , assert = require('assert')
  , path   = require('path')
  , fs     = require('fs')
  ;


var file = path.join(__dirname, 'torrents', 'files.torrent')
  , folder = path.join(__dirname, 'files')
  ;


vows.describe('Hash Check')
  .addBatch({
    'Read a torrent and hash check it': {
      topic: function() {
        var cb = this.callback;

        nt.readFile(file, function(err, torrent) {
          if (err) throw err;
          var hasher = torrent.hashCheck(folder);

          hasher.on('matcherror', function(i, file, pos, length) {
            throw new Error('Could not match file ' + file);
          });

          var percent;
          hasher.on('match', function(index, hash, percentMatched) {
            percent = percentMatched;
          });

          hasher.on('end', function() {
            cb(null, percent);
          });
        });
      },

      '100% match': function(percent) {
        assert.equal(percent, 100);
      }
    }
  })
  .export(module);
