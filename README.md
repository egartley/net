# egartley.net
Source code and files for [https://egartley.net](https://egartley.net/?via=gh)

![release)](https://img.shields.io/github/v/release/egartley/net)

## Requirements

- Ruby installation ([ruby-lang.org](https://www.ruby-lang.org/en/))
- Middleman ([middlemanapp.com](https://middlemanapp.com/))
    - `gem install middleman`

## Building

`bundle install`  
`bundle exec middleman build`  

This will make the "build" directory where the files can be accessed directly or moved to a server.

Alternatively, run `bundle exec middleman server` to run the site locally.

## Deployment

A Jenkins pipeline (see [Jenkinsfile](https://github.com/egartley/net/blob/master/Jenkinsfile)) is used to build from the master branch.

All the PNG files are compressed to WEBP. The pipeline assumes that the WEBP binaries are located at `~/webp/bin` when run as the default jenkins user.
