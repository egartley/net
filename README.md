# net
Source code for [egartley.net](https://egartley.net/?via=gh)

## Requirements

- Windows or Linux
- Ruby installation ([ruby-lang.org](https://www.ruby-lang.org/en/))
- Bundler gem ([rubygems.org/gems/bundler](https://rubygems.org/gems/bundler))
    - `gem install bundler`

## Building

`bundle install`  
`bundle exec jekyll build`  

This will put the files in the "_site" directory, where they can be copied to an Apache installation or other location to access.

Alternatively, run `bundle exec jekyll serve` to view the site at 127.0.0.1:4000

## Deployment to Domain

Currently, a Jenkins job is run to build from the master branch and copy the "_site" directory to egartley.net with FTP. The job is triggered manually, but a continous deployment solution will be implemented at some point in the future. It would require a server to be online at all times, and the current Jenkins server is not.

Prior to building, all URLs starting with "/resources" are replaced with "resources.egartley.net" so that the subdomain is properly used. They're maintained as "/resources" in source so that a local build uses local resources instead of the live versions.