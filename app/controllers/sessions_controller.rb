class SessionsController < ApplicationController
  before_action :signed_in_user, :only => [:home] #see listing 9.44

  # Using before_filter for rendering mobile vs. desktop versions - http://scottwb.com/blog/2012/02/23/a-better-way-to-add-mobile-pages-to-a-rails-site/
  # :check_for_mobile (in controllers/application_controller) - renders mobile (from app/views_mobile) or desktop (from app/views) view templates 
  # depending on cookie. If mobile template doesn't exist,  before_filter :check_for_mobile will fall back to desktop template.
  before_filter :check_for_mobile, :only => [:splash, :home, :new]
  
	def splash
		if signed_in?
			redirect_to home_path
		else
			@venues = Venue.carousel_prep
		end	
	end

	def home
		# Setting up activerecord relation between venues, neighborhoods, and venue_events.
		# Rows returned will be iterated via a collection in session/_thumbnails.html.erb partial, referenced in in sessions/home.html.erb
		# DISTINCT ensures that unique list of venue names will displayed
		# Some columns use alias (referenced in session/_thumbnails.html.erb partial)
		
#		if (ActiveRecord::Base.connection.adapter_name == 'SQLite') # For a sqlite db
#SELECT venues.name as venue_name, venues.phone, venues.file_name, venue_events.venue_id, venue_events.name as venue_event_name, venue_events.description as venue_event_description, venue_events.start_time
#FROM "venues"
#LEFT OUTER JOIN
#  (SELECT venue_id, name, start_time, description, MIN(start_time) FROM venue_events GROUP BY venue_id) AS venue_events
#ON  venue_events.venue_id = venues.id

#		@venue_events = VenueEvent.select("venue_id, name, start_time, description, MIN(start_time)").group("venue_id").to_sql
#		@venues = Venue.select("venues.name as venue_name, venues.phone, venues.file_name,  venue_events.venue_id, venue_events.name as venue_event_name, venue_events.description as venue_event_description, venue_events.start_time")
#		@venues = @venues.joins("LEFT OUTER JOIN (#{@venue_events}) AS venue_events ON venues.id = venue_events.venue_id")
		
#		else # For a PostGreSQL db
#SELECT * FROM
#(SELECT DISTINCT ON(venues.id)
#	venues.id as venue_id, venues.name as venue_name, venues.phone, venues.file_name, venue_events.venue_id as venue_events_venue_id, venue_events.name as venue_event_name, venue_events.description as venue_event_description, venue_events.start_time 
#FROM "venues" 
#LEFT OUTER JOIN venue_events ON venues.id = venue_events.venue_id
#ORDER BY venues.id, venue_events.start_time asc)
#AS subquery
#ORDER BY venue_name asc

			# NOTE: DISTINCT ON IS ONLY FOR POSTGRESQL
#			@subquery = Venue.select("DISTINCT ON(venues.id) venues.id as venue_id, venues.name as venue_name, venues.phone, venues.file_name, venue_events.venue_id, venue_events.name as venue_event_name, venue_events.description as venue_event_description, venue_events.start_time")
#			@subquery = @subquery.joins("LEFT OUTER JOIN venue_events ON venues.id = venue_events.venue_id")
#			@subquery = @subquery.order("venues.id, venue_events.start_time asc")
#			@venues = @subquery
#			@venues = Venue.joins("JOIN (#{@subquery}) subquery ON venues.id = subquery.id").

#		@venue_events = VenueEvent.select("venue_id, name, start_time, description, MIN(start_time)").group("venue_id").to_sql
#		@venues = Venue.select("venues.name as venue_name, venues.phone, venues.file_name,  venue_events.venue_id, venue_events.name as venue_event_name, venue_events.description as venue_event_description, venue_events.start_time")
#		@venues = @venues.joins("LEFT OUTER JOIN (#{@venue_events}) AS venue_events ON venues.id = venue_events.venue_id")


#		end


# SELECT venues.name AS venue_name, venues.phone, venues.file_name, venues.neighborhood_id, 
#	neighborhoods.name AS neighborhood_name, neighborhoods.id, 
#	subquery2.name AS venue_event_name, subquery2.description AS venue_event_description, subquery2.start_time AS event_start_time 
# FROM "venues" 
# INNER JOIN "neighborhoods" ON "neighborhoods"."id" = "venues"."neighborhood_id" 
# LEFT OUTER JOIN 
#	(SELECT venue_events.venue_id, venue_events.name, venue_events.description, venue_events.start_time 
#	 FROM "venue_events" JOIN 
#		(SELECT MIN(start_time) as event_start_time, venue_id 
#		 FROM "venue_events" 
#		 GROUP BY venue_id) subquery1 
#	 ON subquery1.event_start_time = venue_events.start_time AND subquery1.venue_id = venue_events.venue_id) subquery2 
# ON subquery2.venue_id = venues.id

		subquery1 = VenueEvent.select("MIN(start_time) as event_start_time, venue_id").group("venue_id").to_sql
		subquery2 = VenueEvent.joins("JOIN (#{subquery1}) subquery1 ON subquery1.event_start_time = venue_events.start_time AND subquery1.venue_id = venue_events.venue_id")
		subquery2 = subquery2.select("venue_events.venue_id, venue_events.name, venue_events.description, venue_events.start_time").to_sql
		@venues = Venue.joins("LEFT OUTER JOIN (#{subquery2}) subquery2 ON subquery2.venue_id = venues.id")
		@venues = @venues.select("venues.name AS venue_name, venues.phone, venues.file_name, venues.neighborhood_id, neighborhoods.name AS neighborhood_name, neighborhoods.id, subquery2.name AS venue_event_name, subquery2.description AS venue_event_description, subquery2.start_time AS event_start_time")
		@venues = @venues.joins(:neighborhood)

		
		# if latitude and longitude parameters are available, show distance from venues to user
		if (params.has_key?(:latitude) && !params[:latitude].blank? && params.has_key?(:longitude) && !params[:longitude].blank?)
			# Info about geocoder for methods like near() and order("distance"):
			# http://www.rubygeocoder.com/
			# http://stackoverflow.com/questions/11463940/rails-geocoder-and-near
			# NOTE: near() method has problems with includes or left outer joins.  
			# To use near() with left outer joins, do query conditions without includes BEFORE ARel compiles and executes:
			# https://github.com/alexreisner/geocoder/issues/99
			max_distance = 1000 # in km
			@venues = @venues.near([params[:latitude], params[:longitude]], max_distance)
		end		

#		@venues = @venues.search(params[:search])
		@venues = @venues.order(sort_order) # Ensures only the most recent upcoming event is used for sorting (if user sorts by event start time).  Since this is only an activerecord relation, the query is not executed.
		@venues = @venues.page(params[:page]).per_page(2)
		
		respond_to do |format|
			format.html
			format.js { render :template => 'sessions/home.js.erb', locals: {scroll: params[:scroll]} }
		end
	end
		
	def new
	end

	def create
		user = User.find_by(email: params[:session][:email].downcase)
	
		if user && user.authenticate(params[:session][:password])
			sign_in(user)  #sign_in method found in sessions_helper
      		flash[:success] = 'Welcome back, ' + user.first_name + '!'
			redirect_back_or home_path
		else
			flash[:error] = 'Invalid email/password combination'
			redirect_to splash_path	#render doesn't count as a page request so flash would persist one page too long which is why we need to use flash.now			
		end
   
	end
  	
	def destroy
		sign_out
		flash[:success] = 'See you next time!'
		redirect_to root_url
	end

	
	private
	  
	def sort_order
	#	vulnerable to SQL injection?
		sort_parameter_list = ['name_asc', 'name_desc', 'neighborhood', 'distance', 'event']
		if (sort_parameter_list.include?(params[:sort_order]))
			case params[:sort_order]
			when 'name_asc'
				return 'venue_name asc'
			when 'name_desc'
				return 'venue_name desc'
			when 'neighborhood'
				return 'neighborhood_name asc, venue_name asc'
			when 'distance'
				return 'distance'
			when 'event'
				# Modified sort_parameter_list to feed into PostGreSQL db used in Heroku
				if (ActiveRecord::Base.connection.adapter_name == 'SQLite') # For a sqlite db
					return 'event_start_time is null, event_start_time asc'
				else
					return 'event_start_time asc NULLS LAST'
				end
			end
		end
	end	
end
