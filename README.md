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
* `format`: Specifiy the format of each commit object.

You can use any `git-log` placeholder when using `options.format`.
For example:

``` javascript
trail(project, {
  format: {
    hash: '%H',
    slug: '%f',
    emails: { author: '%ae', committer: '%ce' }
  }
}).on('data', function(commit) {
  commit.hash // "bfceb052d8d08db882e75aa0444fe9c51eda76e2"
  commit.slug // "update-URLs-for-new-repo-name"

  commit.emails.author    // "hughskennedy@gmail.com"
  commit.emails.committer // "hughskennedy@gmail.com"
})
```

All options are, well, optional. Enjoy!
