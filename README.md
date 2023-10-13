# egartley.net
Source code and files for [https://egartley.net](https://egartley.net/?via=gh)

![release)](https://img.shields.io/github/v/release/egartley/net)

## Requirements

- Windows or Linux
- Ruby installation ([ruby-lang.org](https://www.ruby-lang.org/en/))
- Bundler gem ([rubygems.org/gems/bundler](https://rubygems.org/gems/bundler))
    - `gem install bundler`

## Building

From the base directory, install the requried gems and build with Jekyll:  

`bundle install`  
`bundle exec jekyll build`  

This will make the "_site" directory, where the files can be accessed directly or moved to a server.

Alternatively, run `bundle exec jekyll serve` to view the site locally on port 4000.

## Deployment

A Jenkins pipeline (see [Jenkinsfile](https://github.com/egartley/net/blob/master/Jenkinsfile)) is run to build from the master branch and upload the "_site" directory to the website. It's triggered manually at the moment. CD will be implemented in the future.

Prior to building, all the PNG files are compressed to WEBP, then their URLs are changed accordingly. These are kept as PNG in the source since local builds will use local files instead of the live versions. The pipeline assumes that the WEBP binaries are located at `~/webp/bin` when run as the default jenkins user.
