var assert = require('assert')
var trail = require('../index')
var repo = __dirname + '../' // test this repo - :/

// default format should be sane
trail(repo).on('data', function(commit) {
  assert.doesNotThrow(function() {
    assert(commit.sha, 'sha')
    assert(commit.author.name, 'author.name')
    assert(commit.author.email, 'author.email')
    assert(commit.author.date, 'author.date')
    assert(commit.committer.name, 'committer.name')
    assert(commit.committer.email, 'committer.email')
    assert(commit.committer.date, 'committer.date')
    assert(commit.body, 'body')
  }, Error, 'Default format does not conform')
})

// Custom format options
var options = {
  format: {
    sha: '%H'
  , authorName: '%an'
  , authorEmail: '%ae'
  , authorDate: '%ad'
  , commiterName: '%cn'
  , commiterEmail: '%ce'
  , commiterDate: '%cd'
  , body: '%B'
  }
}

trail(repo, options).on('data', function(commit) {
  assert.doesNotThrow(function() {
    assert(commit.sha, 'sha')
    assert(commit.authorName, 'authorName')
    assert(commit.authorEmail, 'authorEmail')
    assert(commit.authorDate, 'authorDate')
    assert(commit.committerName, 'committerName')
    assert(commit.committerEmail, 'committerEmail')
    assert(commit.committerDate, 'committerDate')
    assert(commit.body, 'body')
  }, Error, 'Custom format options are not as expected')
})
