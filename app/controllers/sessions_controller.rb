class SessionsController < ApplicationController

	def splash
		if signed_in?
			redirect_to home_path
#		else
#			@venue_videos = Venue.carousel_prep
		end	
	end

	def home
		# Setting up activerecord relation between venues, neighborhoods, and venue_events.
		# Rows returned will be iterated via a collection in session/_thumbnails.html.erb partial, referenced in in sessions/home.html.erb
		# DISTINCT ensures that unique list of venue names will displayed
		# Some columns use alias (referenced in session/_thumbnails.html.erb partial)
		@venues = Venue.select("DISTINCT(venues.name) as venue_name, venues.id, venues.phone, venues.neighborhood_id, venues.file_name, neighborhoods.name, venue_events.id, venue_events.name as venue_event_name, venue_events.description as venue_event_description, venue_events.start_time")
		@venues = @venues.joins(:neighborhood)
		@venues = @venues.joins("LEFT OUTER JOIN venue_events ON venues.id = venue_events.venue_id AND venue_events.id = (SELECT venue_events.id FROM venue_events ORDER BY venue_events.start_time asc LIMIT 1)")
		
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
#		@sql_venues = @venues.to_sql
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
#	vulnerable to SQL injection
		# Modified sort_parameter_list to feed into PostGreSQL db used in Heroku
		if (ActiveRecord::Base.connection.adapter_name == 'SQLite') # For a sqlite db
			sort_parameter_list = ['venues.name asc', 'venues.name desc', 'neighborhoods.name asc, venues.name asc', 'venue_events.start_time is null, venue_events.start_time asc']	
		else # For a PostGreSQL db
			sort_parameter_list = ['venues.name asc', 'venues.name desc', 'neighborhoods.name asc, venues.name asc', 'venue_events.start_time asc NULLS LAST']	
		end
		
		if (sort_parameter_list.include?(params[:sort_order]))
			return params[:sort_order]
		elsif (params.has_key?(:latitude) && !params[:latitude].blank? && params.has_key?(:longitude) && !params[:longitude].blank? && (params[:sort_order] == 'distance'))
			"distance"
		else
			if (ActiveRecord::Base.connection.adapter_name == 'SQLite') # For a sqlite db
			#	"venue_events.start_time is null, venue_events.start_time asc" # sorts results by most recent start_times first followed by null (and by distance if available)
				"venues.name asc"
			else # For a PostGreSQL db
			#	"venue_events.start_time asc NULL LAST" # sorts results by most recent start_times first followed by null (and by distance if available)
				"venues.name asc"
			end
		end	
	end	
end
