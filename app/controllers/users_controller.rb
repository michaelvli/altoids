class UsersController < ApplicationController
  before_action :signed_in_user, only: [:index, :edit, :update, :destroy]  #see listing 9.44
  before_action :correct_user, only: [:edit, :update]
  before_action :admin_user, only: [:index, :destroy]

  def index
	@users = User.all
  end

  def new
	@user = User.new
  end
  
  def create
    @user = User.new(user_params)
	
    if @user.save
		if current_user.nil?
		  sign_in @user
		  flash[:success] = "Welcome to BarFly!!"
		  redirect_to root_path
		elsif current_user.account_type == "admin"
		  flash[:success] = @user.account_type.capitalize + " account for " + @user.first_name + " was created!"
		  redirect_to users_path
		end
    else
	  flash.now[:error] = "Uh oh... please fix your info"
      render 'new'
    end
  end

  def edit
	@user = User.find(params[:id])
  end

  def update
    @user = User.find(params[:id])
    
	if @user.update_attributes(user_params)
	  flash[:success] = "Profile updated"
	  if current_user.account_type == "admin"
		redirect_to users_path  #takes user to index action in user controller
	  else
		redirect_to root_path
	  end
    else
      render 'edit'
    end
  end	
  
  def destroy
	User.find(params[:id]).destroy
	flash[:success] = "User deleted."
	redirect_to users_url
  end

  
  private  #See Listing 7.22: Private functions are used internally by the controller (and don't need to be exposed to external users via the Web)

    def user_params #See Chapter 7.3.2 for strong parameters.  Params.require ensures that the params hash has a :user attribute, and permits only the name, email, password, and password confirmation attributes (but no others) to be passed to User.new in the create method.
	  if !current_user.nil? && current_user.account_type == 'admin'
        params.require(:user).permit(:first_name, :last_name, :zip_code, :email, :password, :password_confirmation, :gender, :birthday, :account_type, :venue_id)
	  else
        params.require(:user).permit(:first_name, :last_name, :zip_code, :email, :password, :password_confirmation, :gender, :birthday)
	  end
    end
	
	# Before filters
# 	Listing 10.24 - Since signed_in_user is a method that is used across every page (only signed in users can access pages), this method was moved to the session_helper file
#    def signed_in_user
#		unless signed_in?
#			store_location
#			redirect_to signin_url, notice: "Please sign in."
#		end	
#    end
		
	def correct_user
      user = User.find_by(id: params[:id])
	  if user
		  unless (current_user?(user) || current_user.account_type == 'admin')
			flash[:error] = "Ooops... looks like you aren't authorized to do that."
			redirect_to(root_url) 
		  end
	  else
		flash[:error] = "Ooops... looks like you aren't authorized to do that."
		redirect_to(root_url) 
	  end
    end
	
end