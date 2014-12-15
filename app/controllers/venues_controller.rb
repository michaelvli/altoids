class VenuesController < ApplicationController
#  before_action :signed_in_user  #see listing 9.44
#  before_action :venue_user, only: [:show, :edit, :update]
#  before_action :correct_venue_user, only: [:show, :edit, :update]
#  before_action :admin_user, only: [:new, :edit, :create, :index, :destroy]

#  before_filter :check_for_mobile, :only => [:index, :edit]
 
  def index
	@venues = Venue.all
#	@venues = Venue.joins(:neighborhood)		
#	@venue_event_months = @venue_events.group_by { |month| month.start_time.strftime("%B") }
  end
  
  def show
	@venue = Venue.find(params[:id])
	@days_of_week = Date::ABBR_DAYNAMES
  end
  
  def new
	@venue = Venue.new
	@days_of_week = [:monday, :tuesday, :wednesday, :thursday, :friday, :saturday, :sunday]
#	@sql_var = @venue.feature_types.to_sql
  end
  
  def create
	parse_time
	@days_of_week = [:monday, :tuesday, :wednesday, :thursday, :friday, :saturday, :sunday]
	
    @venue = Venue.new(venue_only_params)
	
    if @venue.save(venue_only_params)
		if @venue.update_attributes(venue_params)
			flash[:success] = "Successfully created " + @venue.name
			redirect_to venues_path #takes user to index action in venue controller
		else
			flash[:error] = "Opps... looks like we have a problem with saving features"
			render 'new'
		end	  
    else
	  flash[:error] = "Opps... looks like we have a problem "
      render 'new'
    end
  end 
    
  def edit
#  	@venues = Venue.all
	@venue = Venue.find(params[:id])
#	@days_of_week = [:monday, :tuesday, :wednesday, :thursday, :friday, :saturday, :sunday]
#	@days_of_week = Date::DAYNAMES
	@days_of_week = Date::ABBR_DAYNAMES
	session[:section] = params[:section] || session[:section]  # using session variable to track the section of the venues/edit.html form that the user is editing.  This is needed because section is passed as a parameter and in case there is a validation problem with the form, application needs to remember which section that the user was editing.
  end
  
  def update
	parse_time

    @venue = Venue.find(params[:id])
	    
	if @venue.update_attributes(venue_params)
	  flash[:success] = "Venue updated"
	  if current_user.account_type == "admin"
		redirect_to venues_path  #takes user to index action in venue controller
	  else
		redirect_to venue_path(current_user.venue_id)
	  end
    else
	  flash.now[:error] = "Oops... look like we have errors."
	  @days_of_week = [:monday, :tuesday, :wednesday, :thursday, :friday, :saturday, :sunday]
      render 'edit'
    end
  end
 
  def destroy
	Venue.find(params[:id]).destroy
	if User.update_all({account_type: "user", venue_id: ''}, {venue_id: params[:id]})
		flash[:success] = "Venue deleted"
	end
	redirect_to venues_url
  end

 
  private  #See Listing 7.22: Private functions are used internally by the controller (and don't need to be exposed to external users via the Web)
  # shows how to access attributes from another model using accepts_nested_attributes method - http://stackoverflow.com/questions/17371334/how-is-attr-accessible-used-in-rails-4
  
  	def correct_venue_user
		unless (current_user.venue_id == params[:id].to_i) || (current_user.account_type == 'admin')
			flash[:error] = "Ooops... looks like you aren't authorized to access that venue."
			redirect_to root_url
		end	
    end

    def venue_only_params #See Chapter 7.3.2 for strong parameters.  Params.require ensures that the params hash has a :user attribute, and permits only the name, email, password, and password confirmation attributes (but no others) to be passed to Venue.new in the create method.
      params.require(:venue).permit(:name, :address, :city, :state, :zip_code, :description, :phone, :file_name, :logo, :active, :neighborhood_id, :venue_open_mon, :venue_close_mon, :kitchen_open_mon, :kitchen_close_mon, :venue_open_tue, :venue_close_tue, :kitchen_open_tue,:kitchen_close_tue, :venue_open_wed, :venue_close_wed, :kitchen_open_wed, :kitchen_close_wed, :venue_open_thu, :venue_close_thu, :kitchen_open_thu, :kitchen_close_thu, :venue_open_fri, :venue_close_fri, :kitchen_open_fri, :kitchen_close_fri, :venue_open_sat, :venue_close_sat, :kitchen_open_sat, :kitchen_close_sat, :venue_open_sun, :venue_close_sun, :kitchen_open_sun, :kitchen_close_sun, :website )
    end

    def venue_params #See Chapter 7.3.2 for strong parameters.  Params.require ensures that the params hash has a :user attribute, and permits only the name, email, password, and password confirmation attributes (but no others) to be passed to Venue.new in the create method.
      params.require(:venue).permit(:name, :address, :city, :state, :zip_code, :description, :phone, :file_name, :logo, :active, :neighborhood_id, :venue_open_mon, :venue_close_mon, :kitchen_open_mon, :kitchen_close_mon, :venue_open_tue, :venue_close_tue, :kitchen_open_tue,:kitchen_close_tue, :venue_open_wed, :venue_close_wed, :kitchen_open_wed, :kitchen_close_wed, :venue_open_thu, :venue_close_thu, :kitchen_open_thu, :kitchen_close_thu, :venue_open_fri, :venue_close_fri, :kitchen_open_fri, :kitchen_close_fri, :venue_open_sat, :venue_close_sat, :kitchen_open_sat, :kitchen_close_sat, :venue_open_sun, :venue_close_sun, :kitchen_open_sun, :kitchen_close_sun, :website, :feature_ids => [], videos_attributes: [:id, :venue_id, :video_name, :live, :active, :_destroy])
    end

    def parse_time #Need to parse time from the rails combined time select gem - http://excid3.com/blog/rails-tip-4-rails-time-select-like-google-calendar/
      	days_of_week = [:mon, :tue, :wed, :thu, :fri, :sat, :sun]
		venue_or_kitchen = ["venue", "kitchen"]
		open_or_close = ["open", "close"]
		
		days_of_week.each do |day_of_week|
			venue_or_kitchen.each do |v_or_k|
				open_or_close.each do |o_or_c|
					if !params[:venue]["#{v_or_k}_#{o_or_c}_#{day_of_week}(5i)".to_s].nil?
						params[:venue].parse_time_select! "#{v_or_k}_#{o_or_c}_#{day_of_week}".to_s
					end	
				end
			end	
		end	
    end
	
end