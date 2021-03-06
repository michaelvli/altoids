class SessionsController < ApplicationController
  before_action :signed_in_user, :only => [:home, :events_list, :tearsheet] #see listing 9.44

  # Using before_filter for rendering mobile vs. desktop versions - http://scottwb.com/blog/2012/02/23/a-better-way-to-add-mobile-pages-to-a-rails-site/
  # :check_for_mobile (in controllers/application_controller) - renders mobile (from app/views_mobile) or desktop (from app/views) view templates 
  # depending on cookie. If mobile template doesn't exist,  before_filter :check_for_mobile will fall back to desktop template.
  before_filter :check_for_mobile, :only => [:splash, :new, :create, :home, :events_list, :tearsheet]

	# splash action serves three purposes:
	# 1.  redirect a logged in user to home page
	# 2.  log out a mobile user (instead of using the normal destroy action)
	# 3.  serve the splash page
	# The splash action logs out a mobile user because rails doesn't have a clean way of handling ajax redirects.
	# http://www.dextablogs.com/blog/2014/05/25/handling-ajax-redirects-in-rails/
	# Because the mobile UI is ajax-based, Rail's lack of handling ajax redirects presents a problem if the
	# client sends an ajax response to the destroy action and the splash page needs to be served (or we could put
	# redundant code that creates an instance of @videos in the destroy action.
	# The logout parameter in the params hash is initiated when the user clicks on the logout button within the menu (views_mobile/sessions/menu.html.erb)
	# This parameter is then passed into the url argument of the ajax request that is send to the splash action.
	def splash

#		if (signed_in? && !params.has_key?(:logout)) # signed in user is not logging out
		if (signed_in?) # signed in user
			redirect_to home_path
		else
#			if (signed_in? && params.has_key?(:logout) && params[:logout] = true) # signed in user is logging out
#				sign_out
#			end	

			@user = User.new # in case new user signs up
			
			# returns a Activerecord relation vs. a model instance - http://stackoverflow.com/questions/6004891/undefined-method-for-activerecordrelation	
			@videos = Video.get_videos.where("live = ?", false).where("status = ?", "finished")
#			@venues = @venues.order("RANDOM()")
#			@venues = @venues.limit(5) 		
				
			# Use Amazon AWS SDK methods (.new and .url_for) to get a url to the S3 object (the thumbnail)
			s3 = AWS::S3.new(:access_key_id => ENV['AWS_KEY_ID_READ'], :secret_access_key => ENV['AWS_KEY_VALUE_READ'])
			@bucket = s3.buckets[ENV['AWS_BUCKET']]
			# Code concepts below should be used in views/index.html.erb
		#	object = @bucket.objects['uploads/video/attachment/191/uploadify_test.png']
		#	@url = oject.url_for(:get, { :expires => 1200.minutes.from_now, :secure => true }).to_s

#			@user = User.new

			respond_to do |format|
				format.html
				format.js { render :template => 'sessions/destroy.js.erb'}
#				format.js { render js: "alert('Hello Rails');"}
			end

		end		
	end

	
	def home
		# Use Amazon AWS SDK methods (.new and .url_for) to get a url to the S3 object (the thumbnail)
		s3 = AWS::S3.new(:access_key_id => ENV['AWS_KEY_ID_READ'], :secret_access_key => ENV['AWS_KEY_VALUE_READ'])
		@bucket = s3.buckets[ENV['AWS_BUCKET']]
		# Code concepts below should be used in views/index.html.erb
		#	object = @bucket.objects['uploads/video/attachment/191/uploadify_test.png']
		#	@url = object.url_for(:get, { :expires => 1200.minutes.from_now, :secure => true }).to_s
		
		# Setting up activerecord relation between venues, neighborhoods, and venue_events.
		# Rows returned will be iterated via a collection in session/_thumbnails.html.erb partial, referenced in in sessions/home.html.erb
		# Some columns use alias (referenced in session/_thumbnails.html.erb partial)
		# For ActiveRecord query methods, see: http://api.rubyonrails.org/classes/ActiveRecord/QueryMethods.html#method-i-distinct
		@venues = Venue.get_venues.joins(:videos).where("videos.status = ?", "finished").distinct # need distinct venues with finished videos
		
		if (params.has_key?(:features)) # needs to come before neighborhoods filter bc of LEFT JOIN
			@venues = @venues.filter_features(params[:features])
		end
		
		if (params.has_key?(:neighborhoods)) # needs to come after features filter
			@venues = @venues.where("neighborhoods.name" => params[:neighborhoods]) #uses WHERE IN which has same effect as OR
		end
		
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

		# Initially, param[:search] is blank for the html response which is why it should be excluded (or else @venues will return nothing and pagination links will not be present)
		# But, the first set of venues is retrieved via ajax through the getVenues link so a '%%' is passed in for the search parameter which means all venues should be returned.
		# CAUTION: URL and debug parameters are NOT accurate for debugging this.  While params[:search] may be present in the browser url and debug parameters, these values are 
		# passed in the AJAX call since dynamic content is all retrieved via AJAX.  Use Network panel in developer tools to confirm (check url listed there to see which parameters 
		# are passed)
		if (params.has_key?(:search) && !params[:search].blank?)
			@venues = @venues.where("venues.name LIKE ?", "%#{params[:search]}%")
		end
			
		
		@venues = @venues.order(sort_order) # Ensures only the most recent upcoming event is used for sorting (if user sorts by event start time).  Since this is only an activerecord relation, the query is not executed.
		@venues = @venues.page(params[:page]).per_page(2)

		respond_to do |format|
			format.html
			format.js { render :template => 'sessions/home.js.erb', locals: {scroll: params[:scroll]} }
#			format.js { render :js => "alert('in sessions/home');" }
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
		# Use Amazon AWS SDK methods (.new and .url_for) to get a url to the S3 object (the thumbnail)
		s3 = AWS::S3.new(:access_key_id => ENV['AWS_KEY_ID_READ'], :secret_access_key => ENV['AWS_KEY_VALUE_READ'])
		@bucket = s3.buckets[ENV['AWS_BUCKET']]
		# Code concepts below should be used in views/index.html.erb
		#	object = @bucket.objects['uploads/video/attachment/191/uploadify_test.png']
		#	@url = object.url_for(:get, { :expires => 1200.minutes.from_now, :secure => true }).to_s

		
		@venue = Venue.find(params[:id]) # returns a single Activerecord object vs. a collection
		# @venue = Venue.where(id: params[:id]) # returns a Activerecord collection even though there's only 1 item
		@videos = Video.where(venue_id: params[:id]).where(status: "finished")
		@videos = @videos.joins(:venue)
		@videos = @videos.select("videos.*, venues.file_name AS file_name, venues.name AS venue_name")
		
		@days_of_week = [:monday, :tuesday, :wednesday, :thursday, :friday, :saturday, :sunday]
		@venue_events = VenueEvent.upcoming_events(venue_id: params[:id])

#		if mobile?
#			render :template => 'sessions/tearsheet.js.erb', :content_type => "application/javascript"
#		render(:template => "sessions/tearsheet.js.erb", :formats => [:js], :content_type => "application/javascript" )

#respond_to do |format|
#    format.js {render :content_type => 'text/javascript'}
#end
		
#			render :format => :js, :template => 'sessions/tearsheet.js.erb' , locals: {scroll: params[:scroll]} }
#			render js: { :template => 'sessions/tearsheet.js.erb', locals: {scroll: params[:scroll]} }
			
#			respond_to do |format|
#				format.html { render template: 'sessions/tearsheet.js.erb', content_type: 'application/javascript' }
#			end

#			render :template => 'sessions/tearsheet.js.erb'

#			render :template => "sessions/tearsheet.js.erb", :formats => [:js]
			
#			respond_to do |format|
##				format.html { render :template => 'sessions/tearsheet.js.erb' }
##				format.html { render js: "alert('here');", content_type: "application/javascript" }
#				format.html { render :template => "sessions/tearsheet.js.erb", :formats => [:js] }
#				format.js
#			end

		
		respond_to do |format|
			format.html
			format.js { render :template => 'sessions/tearsheet.js.erb'}
		end

	end
	
#	def new
#	end

	def create
		user = User.find_by(email: params[:session][:email].downcase)

		if user && user.authenticate(params[:session][:password])
			sign_in(user)  #sign_in method found in sessions_helper
      		flash[:success] = 'Welcome back, ' + user.first_name + '!'
			redirect_back_or home_path
		else
			flash[:error] = 'Invalid email/password combination'
			params[:create_session] = true
			@user = User.new
			render 'splash'
#			redirect_to splash_path	#render doesn't count as a page request so flash would persist one page too long which is why we need to use flash.now
		end
   
	end
  	
	# destroy action is called via the logout button in menu (i.e. function initButtons_Menu())
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
