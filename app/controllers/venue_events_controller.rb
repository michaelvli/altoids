class VenueEventsController < ApplicationController
  before_action :signed_in_user  #see listing 9.44
  before_action :correct_venue_user, only: [:new, :create, :show, :index, :edit, :update]
  before_action :admin_user,   only: :destroy
  

  def index
	session[:venue_id] = params[:venue_id] || session[:venue_id]
	@venue_events = VenueEvent.where("venue_id = ?", session[:venue_id])
	@venue = Venue.find(session[:venue_id])
  end

  
  def new
	@venue_event = VenueEvent.new
	@venue = Venue.find(session[:venue_id])
  end

  
  def create
	params[:venue_event].parse_time_select! :start_time
	params[:venue_event].parse_time_select! :end_time

	@venue_event = VenueEvent.new(venue_event_params)
	@venue = Venue.find(session[:venue_id])
	
    if @venue_event.save
		flash[:success] = "Successfully created " + @venue_event.name
		redirect_to venue_events_path(:venue_id => params[:venue_event][:venue_id])  #takes user to index action in venue_event controller
    else
	  flash[:error] = "Uh oh... Please correct errors below"
      render 'new', :venue_id => params[:venue_event][:venue_id]

    end
  end 


  def edit
	@venue_event = VenueEvent.find(params[:id])
	@venue = Venue.find(session[:venue_id])
  end
  
  
  def update
  	params[:venue_event].parse_time_select! :start_time
	params[:venue_event].parse_time_select! :end_time

	@venue_event = VenueEvent.find(params[:id])

	if @venue_event.update_attributes(venue_event_params)
	  flash[:success] = "Venue event updated!"
	  redirect_to venue_events_path(:venue_id => session[:venue_id])  #takes user to index action in venue_event controller
    else
	  flash[:error] = "Uh oh!  Please address errors..."
      render 'edit', :venue_id => session[:venue_id]
    end
  end
  

  def destroy
	VenueEvent.find(params[:id]).destroy
	flash[:success] = "Venue Event deleted."
	redirect_to venue_events_url(:venue_id => session[:venue_id])
  end

    
  private  #See Listing 7.22: Private functions are used internally by the controller (and don't need to be exposed to external users via the Web)

    def correct_venue_user
		unless (current_user.venue_id.to_s == params[:venue_id]) || (current_user.account_type == 'admin')
			flash[:error] = "Ooops... looks like you aren't authorized to access those events."
			redirect_to root_url
		end	
    end
	
    def venue_event_params #See Chapter 7.3.2 for strong parameters.  Params.require ensures that the params hash has a :user attribute, and permits only the name, email, password, and password confirmation attributes (but no others) to be passed to Venue.new in the create method.
      params.require(:venue_event).permit(:name, :description, :start_date, :end_date, :start_time, :end_time, :venue_id, :event_id, :active)
    end
		
end
