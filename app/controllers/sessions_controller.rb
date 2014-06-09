class SessionsController < ApplicationController

	def splash
		if signed_in?
			redirect_to home_path
#		else
#			@venue_videos = Venue.carousel_prep
		end	
	end

	def home
		# Setting up activerecord relation between venues and neighborhoods is set up to sort by venue name and neighborhood
#		@venues = Venue.select("venues.id, venues.name, venues.phone, venues.neighborhood_id, venues.file_name").joins(:neighborhood)
#		@venues = Venue.select("DISTINCT(venues.name), venues.*, neighborhoods.*").joins(:neighborhood)
#		@venues = Venue.select("venues.*, neighborhoods.*, venue_events.*").joins(:neighborhood).joins('LEFT OUTER JOIN venue_events ON venues.id = venue_events.venue_id')
		@venues = Venue.select("DISTINCT(venues.name), venues.id, venues.phone, venues.neighborhood_id, venues.file_name, venue_events.id, venue_events.name").joins('LEFT OUTER JOIN venue_events ON venues.id = venue_events.venue_id')
		
		# if latitude and longitude parameters are available, show distance from venues to user
		if (params.has_key?(:latitude) && !params[:latitude].blank? && params.has_key?(:longitude) && !params[:longitude].blank?)
			# Info about geocoder for methods like near() and order("distance"):
			# http://www.rubygeocoder.com/
			# http://stackoverflow.com/questions/11463940/rails-geocoder-and-near
			# NOTE: near() method has problems with includes or left outer joins.  
			# To use near() with left outer joins, do query conditions without includes BEFORE ARel compiles and executes:
			# https://github.com/alexreisner/geocoder/issues/99
			max_distance = 1000 # in km
			@venues = @venues.near([params[:latitude], params[:longitude]], max_distance) # outer join comes after this line
		end		

		@venues = @venues.search(params[:search])		
	
		# Adding activerecord relation of venue_events in order to sort venues based on venue_start_time.
		# Note: the query is not run until sessions/_thumbnails.html.erb upon which the upcoming_event method will list the most recent upcoming event.
		# For more info about activerecord relations (difference between find vs. where method), see: http://stackoverflow.com/questions/9574659/rails-where-vs-find
		# IMPORTANT: Make sure geocoder near() method is before the left outer join statement
#		@venues = @venues.select('venue_events.*').joins('LEFT OUTER JOIN venue_events ON venues.id = venue_events.venue_id') # Left outer join is used since not all venues will have a upcoming event
#		@venues = @venues.group('venues.id, venues.name, venues.phone, venues.neighborhood_id, venues.file_name') # Using group method instead of select DISTINCT bc of problems in postgreSQL db
#		@venues = @venues.select('venue_events.*')
#		@venues = @venues.group('venues.name') # Using group method instead of select DISTINCT bc of problems in postgreSQL db
		@venues = @venues.order(sort_order).limit(1) # Ensures only the most recent upcoming event is used for sorting (if user sorts by event start time).  Since this is only an activerecord relation, the query is not executed.
		
		@sql = @venues.to_sql
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
		if (['venues.name asc', 'venues.name desc', 'neighborhoods.name asc, venues.name asc', 'venue_events.id is null, venue_events.start_time asc'].include?(params[:sort_order]))
			return params[:sort_order]
		elsif (params.has_key?(:latitude) && !params[:latitude].blank? && params.has_key?(:longitude) && !params[:longitude].blank? && (params[:sort_order] == 'distance'))
			"distance"
		else	
#			"venue_events.id is null, venue_events.start_time asc" # sorts results by most recent start_times first followed by null (and by distance if available)
			"venues.name asc"
		end	
	end	
end
