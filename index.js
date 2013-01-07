var spawn = require('child_process').spawn
  , pipeline = require('stream-combiner')
  , map = require('map-stream')
  , split = require('split')
  , path = require('path')

var params = [
    '%H' // Commit SHA
  , '%an' // Author Name
  , '%ae' // Author Email
  , '%ad' // Author Date
  , '%cn' // Committer Name
  , '%ce' // Committer Email
  , '%cd' // Committer Date
  , '%B' // Body
];

// Dirty hack, but it works a charm.
module.exports = function(dir, options) {
  dir = path.resolve(dir || process.cwd)

  var extras = []
    , options = options || {}
    , fieldDelimiter = '$@$@$@$@$'
    , lineDelimiter = '@$!$@$!$!'

  if (options.since) extras = extras.concat(['--since', options.since / 1000])
  if (options.until) extras = extras.concat(['--until', options.until / 1000])


  var proc = spawn('git', ['log', '--format=' + params.join(fieldDelimiter) + lineDelimiter].concat(extras), { cwd: dir })

  var splitter = split(lineDelimiter)
    , mapper = map(function write(entry, next) {
      entry = entry.split(fieldDelimiter)

      if (!entry[0] || entry[0] === '\n') return next()

      return next(null, {
          sha: entry[0].replace(/\n/g, '') // Remove leading newline
        , body: entry[7] && entry[7].slice(0, -1) // Remove trailing newline
        , author: {
            name: entry[1]
          , email: entry[2]
          , date: entry[3]
        }
        , committer: {
            name: entry[4]
          , email: entry[5]
          , date: entry[6]
        }
      })
    })

  return pipeline(proc.stdout, splitter, mapper)
};
