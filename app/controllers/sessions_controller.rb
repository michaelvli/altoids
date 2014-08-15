class SessionsController < ApplicationController
  before_action :signed_in_user, :only => [:home, :events_list, :tearsheet] #see listing 9.44

  # Using before_filter for rendering mobile vs. desktop versions - http://scottwb.com/blog/2012/02/23/a-better-way-to-add-mobile-pages-to-a-rails-site/
  # :check_for_mobile (in controllers/application_controller) - renders mobile (from app/views_mobile) or desktop (from app/views) view templates 
  # depending on cookie. If mobile template doesn't exist,  before_filter :check_for_mobile will fall back to desktop template.
  before_filter :check_for_mobile, :only => [:splash, :new, :home, :events_list, :tearsheet]
  
	def splash
		if signed_in?
			redirect_to home_path
		else
			@venues = Venue.venues_with_events_only
			@venues = @venues.order("RANDOM()")
			@venues = @venues.limit(5)
			@user = User.new
		end	
	end

	
	def home
		# Setting up activerecord relation between venues, neighborhoods, and venue_events.
		# Rows returned will be iterated via a collection in session/_thumbnails.html.erb partial, referenced in in sessions/home.html.erb
		# Some columns use alias (referenced in session/_thumbnails.html.erb partial)
		@venues = Venue.venues_with_or_without_events
#		@venue_events = VenueEvent.upcoming_events(options={}) # for mobile only
		
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
#			@venue_events = @venue_events.joins(:venue).merge(Venue.near([params[:latitude], params[:longitude]], max_distance, :select => "venues.*, venue_events.*")) # for mobile only			
		end
			
#		@venues = @venues.search(params[:search])
		@venues = @venues.order(sort_order) # Ensures only the most recent upcoming event is used for sorting (if user sorts by event start time).  Since this is only an activerecord relation, the query is not executed.
		@venues = @venues.page(params[:page]).per_page(2)

#		@venue_event_months = @venue_events.group_by { |month| month.start_time.strftime("%B") }

		respond_to do |format|
			format.html
			format.js { render :template => 'sessions/home.js.erb', locals: {scroll: params[:scroll]} }
		end
	end

	def events_list
		@venue_events = VenueEvent.upcoming_events(options={}) # for mobile only

		# if latitude and longitude parameters are available, show distance from venue events to user
		if (params.has_key?(:latitude) && !params[:latitude].blank? && params.has_key?(:longitude) && !params[:longitude].blank?)
			# see above 'home' action in this controller for info about geocoder plugin methods such as near() and order("distance")
			max_distance = 1000 # in km
			@venue_events = @venue_events.joins(:venue).merge(Venue.near([params[:latitude], params[:longitude]], max_distance, :select => "venues.*, venue_events.*")) # for mobile only			
		end

		@venue_event_months = @venue_events.group_by { |month| month.start_time.strftime("%B") }
	end
	
	def tearsheet
		@venue = Venue.find(params[:id])
		
# temporarily use @venues until integrate the use of the video table.  
# @venues is used in the 'carousel' partial but using the 'video' table, should feed @videos (i.e. dumdums used '@venue_videos' below) to the 'carousel' partial.
		@venues = @venue 
#		@venue_videos = Venue.carousel_prep(:venue_id => (params[:id]))		

		@days_of_week = [:monday, :tuesday, :wednesday, :thursday, :friday, :saturday, :sunday]
		@venue_events = VenueEvent.upcoming_events(venue_id: params[:id])
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
