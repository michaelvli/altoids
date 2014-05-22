class NeighborhoodsController < ApplicationController
  before_action :signed_in_user  #see listing 9.44
  before_action :admin_user,   only: [:index, :new, :create, :show, :edit, :update, :destroy] #see listing 9.44
  
  def index
	@neighborhoods = Neighborhood.all
  end

  
  def new
  	@neighborhood = Neighborhood.new
  end
  
  
  def create
    @neighborhood = Neighborhood.new(neighborhood_params)
	
    if @neighborhood.save
	  flash[:success] = "Successfully created " + @neighborhood.name
	  redirect_to neighborhoods_path #takes user to index action in neighborhood controller
    else
     render 'new'
    end
  end 
  
  
  def edit
	@neighborhood = Neighborhood.find(params[:id])
  end

  
  def update
    @neighborhood = Neighborhood.find(params[:id])
	    
	if @neighborhood.update_attributes(neighborhood_params)
	  flash[:success] = "Profile updated"
	  if current_user.account_type == "admin"
		redirect_to neighborhoods_path  #takes user to index action in neighborhood controller
	  else
		redirect_to root_path
	  end
    else
      render 'edit'
    end
  end
  
  private  #See Listing 7.22: Private functions are used internally by the controller (and don't need to be exposed to external users via the Web)

    def neighborhood_params #See Chapter 7.3.2 for strong parameters.  Params.require ensures that the params hash has a :user attribute, and permits only the name, email, password, and password confirmation attributes (but no others) to be passed to Venue.new in the create method.
      params.require(:neighborhood).permit(:name, :city, :state, :active)
    end
  
end