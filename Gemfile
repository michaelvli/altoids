source 'https://rubygems.org'

ruby '1.9.3'
#ruby-gemset=railstutorial_rails_4_0

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '4.0.5'

# Use SCSS for stylesheets
gem 'sass-rails', '~> 4.0.2'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 1.3.0'

# Use CoffeeScript for .js.coffee assets and views
gem 'coffee-rails', '~> 4.0.0'

# See https://github.com/sstephenson/execjs#readme for more supported runtimes
# gem 'therubyracer', platforms: :ruby

# Use jquery as the JavaScript library
gem 'jquery-rails'

# Turbolinks makes following links in your web application faster. Read more: https://github.com/rails/turbolinks
gem 'turbolinks'

# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 1.2'

group :doc do
  # bundle exec rake doc:rails generates the API under doc/api.
  gem 'sdoc', require: false
end

# Use ActiveModel has_secure_password
 gem 'bcrypt', '~> 3.1.7'

# Use unicorn as the app server
# gem 'unicorn'

# Use Capistrano for deployment
# gem 'capistrano', group: :development

# Use debugger
 gem 'debugger', group: [:development, :test]

#  	https://github.com/twbs/bootstrap-sass
gem 'bootstrap-sass'

#	Datepicker from jquery-ui-rails gem: http://api.jqueryui.com/datepicker/
gem 'jquery-ui-rails' # for datepicker gem... requires 'rails', '~>4.0.0' (instead of gem 'rails', '4.0.0')

#  	Combined time fields - https://github.com/excid3/combined_time_select
gem 'combined_time_select', '~> 1.0.1'

#  	http://railscasts.com/episodes/273-geocoder
gem 'geocoder'

#   https://github.com/bootstrap-ruby/rails-bootstrap-forms
gem 'bootstrap_form'

#	Pagination  
gem 'will_paginate', '> 3.0'

#  Squeel gem provides a comprehensive DSL for writing SQL queries in Ruby. http://railscasts.com/episodes/354-squeel?view=asciicast
gem 'squeel'

group :development, :test do
	#### Use sqlite3 as the database for Active Record
	gem 'sqlite3'
end

group :production do
#### gem for using PostgreSQL db - Heroku uses PostgreSQL db
  gem 'pg', '0.15.1'
  gem 'rails_12factor', '0.0.2'  #used by Heroku to serve static assets such as images and stylesheets
end