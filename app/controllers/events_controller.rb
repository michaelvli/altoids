class EventsController < ApplicationController
  before_action :signed_in_user  #see listing 9.44
  before_action :admin_user,   only: [:index, :new, :create, :show, :edit, :update, :destroy] #see listing 9.44
  
  def index
  	@events = Event.all
  end
  
  def new
  	@event = Event.new
  end
  
  def create
    @event = Event.new(event_params)
	
    if @event.save
	  flash[:success] = "Successfully created " + @event.name
	  redirect_to events_path #takes user to index action in event controller
    else
     render 'new'
    end
  end 
  
  def edit
	@event = Event.find(params[:id])
  end

  
  def update
    @event = Event.find(params[:id])
	    
	if @event.update_attributes(event_params)
	  flash[:success] = "Event updated"
	  if current_user.account_type == "admin"
		redirect_to events_path  #takes user to index action in event controller
	  else
		redirect_to root_path
	  end
    else
      render 'edit'
    end
  end
  
  def destroy
	EventType.find(params[:id]).destroy
	flash[:success] = "Event deleted."
	redirect_to event_types_url
  end
  
  
  private  #See Listing 7.22: Private functions are used internally by the controller (and don't need to be exposed to external users via the Web)

    def event_params #See Chapter 7.3.2 for strong parameters.  Params.require ensures that the params hash has a :user attribute, and permits only the name, email, password, and password confirmation attributes (but no others) to be passed to Venue.new in the create method.
      params.require(:event).permit(:name, :active)
    end
	
end