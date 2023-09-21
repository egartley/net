# net
Source code for [egartley.net](https://egartley.net/?via=gh)

![release)](https://img.shields.io/github/v/release/egartley/net)

## Requirements

- Windows or Linux
- Ruby installation ([ruby-lang.org](https://www.ruby-lang.org/en/))
- Bundler gem ([rubygems.org/gems/bundler](https://rubygems.org/gems/bundler))
    - `gem install bundler`

## Building

Navigate to the base directory, then run:  

`bundle install`  
`bundle exec jekyll build`  

This will make the "_site" directory, where the files can be accessed directly or copied to an Apache installation.

Alternatively, run `bundle exec jekyll serve` to view the site locally on port 4000.

## Deployment with Jenkins

A Jenkins pipeline (see [Jenkinsfile](https://github.com/egartley/net/blob/master/Jenkinsfile)) is run to build from the master branch and copy the "_site" directory to the website. It's triggered manually for now, but a continous deployment solution will be implemented in the future.

Prior to building, all references to local PNG files are replaced with their respective URL after being compressed to WEBP. These are kept as PNG in the source since local builds will use local files instead of the live versions. The pipeline assumes that the WEBP binaries are located at `~/webp/bin` when run as the jenkins user.

After building, the contents with of the "_site" directory are uploaded to the website with an SSH connection using rsync.
