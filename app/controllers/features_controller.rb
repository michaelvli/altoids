class FeaturesController < ApplicationController
  before_action :signed_in_user  #see listing 9.44
  before_action :admin_user,   only: [:index, :new, :create, :show, :edit, :update, :destroy] #see listing 9.44
  
  def index
	@features = Feature.all
  end
  

  def new
  	@feature = Feature.new
  end
  
  
  def create
    @feature = Feature.new(feature_params)
	
    if @feature.save
	  flash[:success] = "Successfully created " + @feature.name
	  redirect_to features_path #takes user to index action in feature type controller
    else
     render 'new'
    end
  end

  
  def edit
	@feature = Feature.find(params[:id])
  end

  
  def update
    @feature = Feature.find(params[:id])
	    
	if @feature.update_attributes(feature_params)
	  flash[:success] = "Feature updated!"
	  if current_user.account_type == "admin"
		redirect_to features_path  #takes user to index action in feature type controller
	  else
		flash[:error] = "Only administrators can make updates..."
		redirect_to root_path
	  end
    else
	  flash[:error] = "Uh oh!  Please address the error messages below..."
      render 'edit'
    end
  end
  
  def destroy
	Feature.find(params[:id]).destroy
	flash[:success] = "Feature deleted."
	redirect_to features_url
  end
  
  
  private  #See Listing 7.22: Private functions are used internally by the controller (and don't need to be exposed to external users via the Web)

    def feature_params #See Chapter 7.3.2 for strong parameters.  Params.require ensures that the params hash has a :user attribute, and permits only the name, email, password, and password confirmation attributes (but no others) to be passed to Venue.new in the create method.
      params.require(:feature).permit(:name, :active)
    end
  
end
