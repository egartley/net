# net
Source code for [egartley.net](https://egartley.net/?via=gh)

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

## Deploy

A Jenkins job is run to build from the master branch and copy the "_site" directory to the domain. It's triggered manually now, but a continous deployment solution will be implemented in the future. The server used is not online 24/7, but it would need to be for proper CD.

Prior to building, all URLs starting with "/resources" are replaced with "resources.egartley.net" so that the subdomain is properly utilized. They're kept as "/resources" in the files so that a local build uses local resources rather than the live versions.
