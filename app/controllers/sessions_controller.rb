class SessionsController < ApplicationController

	def splash
		if signed_in?
			redirect_to home_path
#		else
#			@venue_videos = Venue.carousel_prep
		end	
	end

	def home
		@venues = Venue.select("DISTINCT(venues.name), venues.*").joins(:neighborhood)

		if (params.has_key?(:latitude) && params.has_key?(:longitude))
			# Info about geocoder for methods like near() and order("distance")
			# http://www.rubygeocoder.com/
			# http://stackoverflow.com/questions/11463940/rails-geocoder-and-near
			max_distance = 1000 # in km
			@venues = @venues.near([params[:latitude], params[:longitude]], max_distance)
		end		

		@venues = @venues.order('name')

		@venues = @venues.page(params[:page]).per_page(2)		
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
			flash.now[:error] = 'Invalid email/password combination'
			render 'new'	#render doesn't count as a page request so flash would persist one page too long which is why we need to use flash.now  
		end
   
	end
  	
	def destroy
		sign_out
		flash[:success] = 'See you next time!'
		redirect_to root_url
	end
  
end
