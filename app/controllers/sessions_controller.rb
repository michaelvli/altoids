class SessionsController < ApplicationController

	def splash
		if signed_in?
			redirect_to home_path
#		else
#			@venue_videos = Venue.carousel_prep
		end	
	end

	def home
		@venues = Venue.order("name").page(params[:page]).per_page(2)
		
		if (params[:scroll])			
#  			http://stackoverflow.com/questions/6214201/best-practices-for-loading-page-content-via-ajax-request-in-rails3
#			render :layout => false	

			# if endless scroll, ajax will append the additional html:
			render :template => 'stand_alone_pages/endless_scroll.js.erb'
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
