module SessionsHelper
#SessionsHelper contains methods used across entire application.  This is because of the "include SessionsHelper" line in the application_controller.rb file.

  def desktop?
    if (cookies[:deviceType] == 'desktop')
		return true
	else
		return false
    end
  end

  def sign_in(user)  #See Listing 8.19  # sign_in method is used when an existing user is logging into the system (vs the signed_in_user method which is called every time a page is loaded to make sure a logged in user is in the application)
    remember_token = User.new_remember_token # calls new_remember_token method found in the user.rb file.  new_remember_token returns a random URL-safe base64 string
	if params[:remember_me]
      cookies.permanent[:remember_token] = remember_token #"permanent" is a actually a shortcut for 20.years.from_now for duration of storing a cookie
    else
	  cookies[:remember_token] = remember_token # this token will be deleted after browser window is closed
    end
    user.update_attribute(:remember_token, User.encrypt(remember_token))  # Updates the user model with a new remember_token every time a user has logged off and has logged back in.
#NOT SURE WHAT THE PURPOSE of self.current_user=(user)	- might be specific to Michael Hartl's application?
    self.current_user = user  # See Listing 8.2.3 on Current User - this line calls the "current_user=" method, passing in the "user" object as an argument
  end
  
  def signed_in?
    !current_user.nil?
  end

#NOT SURE WHAT THE PURPOSE of def current_user=(user)
  def current_user=(user) #This is the "current_user=" method which takes "user" as it's argument - See Listing 8.2.3 - special syntax for defining such an assignment function
    @current_user = user
  end
 
  def current_user #Creates the current_user method that is used throughout application - See Listing 8.22
    remember_token = User.encrypt(cookies[:remember_token])
    @current_user ||= User.find_by(remember_token: remember_token) if cookies[:remember_token] # means: @current_user = @current_user || User.find_by(remember_token: remember_token)
  end

  def current_user?(user)
    user == current_user
  end

  def signed_in_user
	unless signed_in?
		store_location
		flash[:error] = "Please sign in."
		redirect_to root_url
	end	
  end

  def venue_user
	unless (current_user.account_type == "venue") || (current_user.account_type == "admin")
		flash[:error] = "Ooops... looks like you aren't authorized to access that venue."
		redirect_to root_url
	end	
  end
  
  def admin_user
	unless current_user.account_type == "admin"
		flash[:error] = "Ooops... looks like you aren't authorized to do that."
		redirect_to root_url
	end	
  end
  
  def sign_out # see Listing 8.30
	if !current_user.nil?
		current_user.update_attribute(:remember_token, User.encrypt(User.new_remember_token)) # In case the token has been stolen, create a new remember_token and update the db
#NOT SURE WHAT THE PURPOSE of self.current_user=nil
		self.current_user = nil
	end
#	consider using reset_session to wipe out entire session: http://stackoverflow.com/questions/15573093/do-we-need-to-delete-session-variables-after-user-logout
#	session.delete(:_csrf_token)  # DO NOT DELETE this session variable!!!  Needed to verify request is from this application.  See error on missing csrf token - http://stackoverflow.com/questions/3364492/actioncontrollerinvalidauthenticitytoken
	session.delete(:session_id)
	session.delete(:section)
	session.delete(:venue_id)
	session.delete(:screen_width)
	session.delete(:latitude)
	session.delete(:longitude)
#	cookies.delete(:device_size)  #Need to keep this cookie so application will serve appropriate view template (mobile vs. desktop)
    cookies.delete(:remember_token)  # Delete the cookie with the remember_token
  end
  
  # redirect_back_or and store_location are methods used to implement "friendly forwarding" - see Listing 9.17 for more info
  def redirect_back_or(default)
    redirect_to(session[:return_to] || default)
    session.delete(:return_to)
  end

  def store_location
    session[:return_to] = request.url if request.get?
  end
  
end