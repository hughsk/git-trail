# git-trail #

Provides a readable stream alternative to `git-log`, so you can access your git
history through Node.

## Installation ##

``` bash
npm install git-trail
```

## Usage ##

`trail(directory, [options])`.

``` javascript
var trail = require('git-trail')
  , project = __dirname + '/../synthesis'

trail(project, { until: new Date }).on('data', function(commit) {
  commit.sha             // "bfceb052d8d08db882e75aa0444fe9c51eda76e2"
  commit.body            // "update URLs for new repo name"

  commit.author.email    // "hughskennedy@gmail.com"
  commit.author.name     // "Hugh Kennedy"
  commit.author.date     // Wed Dec 12 20:55:49 2012 +1100

  commit.committer.email // "hughskennedy@gmail.com"
  commit.committer.name  // "Hugh Kennedy"
  commit.committer.date  // Wed Dec 12 20:55:49 2012 +1100
})
```

Options include:

* `since`: The starting date to stream logs from
* `until`: The last date to stream logs from

All are optional. Enjoy!
