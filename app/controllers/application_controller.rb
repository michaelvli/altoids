class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  include SessionsHelper
  before_filter :check_for_mobile
  
#  helper_method :desktop? # makes the helper method, 'desktop?', available in any controller or view - http://apidock.com/rails/AbstractController/Helpers/ClassMethods/helper_method
  
  # http://scottwb.com/blog/2012/02/23/a-better-way-to-add-mobile-pages-to-a-rails-site/
  # http://railscasts.com/episodes/199-mobile-devices
  
  def check_for_mobile
#	use_mobile_pages # For development only: controls if I see mobile or desktop version of a page.  Uncomment line below for production.
	use_mobile_pages unless desktop? # priority is to use a pages from the 'views_mobile' folder over those from the 'views' folder
  end

  def use_mobile_pages
    prepend_view_path Rails.root + 'app' + 'views_mobile'
  end

  def desktop?
    if (cookies[:deviceType] == 'desktop')
		return true
	else
		return false
    end
  end
  
end
