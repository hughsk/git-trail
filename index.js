var spawn = require('child_process').spawn
  , pipeline = require('stream-combiner')
  , map = require('map-stream')
  , split = require('split')
  , path = require('path')


var format = {
  sha: '%H'
, author: {
    name: '%an'
  , email: '%ae'
  , date: '%ad'
  }
, committer: {
    name: '%cn'
  , email: '%ce'
  , date: '%cd'
  }
, body: '%B'
}

// Dirty hack, but it works a charm.
module.exports = function(dir, options) {
  dir = path.resolve(dir || process.cwd)

  var extras = []
    , options = options || {}
    , fieldDelimiter = '$@$@$@$@$'
    , lineDelimiter = '@$!$@$!$!'

  if (options.since) extras = extras.concat(['--since', options.since / 1000])
  if (options.until) extras = extras.concat(['--until', options.until / 1000])
  if (options.format) format = options.format

  var params = pluck(format)
  // get all format params - even nested ones
  function pluck (obj) {
    var params = []
    Object.keys(obj).forEach(function(key) {
      var args = ('string' === typeof obj[key]) ? [obj[key]] : pluck(obj[key])
      params.push.apply(params, args)
    })
    return params
  }

  var proc = spawn('git', ['log', '--format=' + params.join(fieldDelimiter) + lineDelimiter].concat(extras), { cwd: dir })

  var splitter = split(lineDelimiter)
    , mapper = map(function write(entry, next) {
      entry = entry.split(fieldDelimiter)

      if (!entry[0] || entry[0] === '\n') return next()

      var last = entry.length - 1
      entry[0] = entry[0].replace(/^\n/, '') // Remove leading newline
      entry[last] = entry[last].replace(/\n$/, '') // Remove trailing newline

      var index = 0
      var commit = assign(format)
      // assign entries to their respective properties
      function assign(obj) {
        var commit = {}
        Object.keys(obj).forEach(function(key) {
          commit[key] = ('string' === typeof obj[key]) ? entry[index++] : assign(obj[key])
        })
        return commit
      }

      return next(null, commit)
    })

  return pipeline(proc.stdout, splitter, mapper)
};
