set :site_title, "egartley.net"
set :site_url, "https://egartley.net"
Time.zone = "America/New_York"

activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end

page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

configure :build do
  activate :minify_css
  activate :minify_javascript, compressor: Terser.new
end
