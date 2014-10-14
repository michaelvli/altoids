class PasswordResetsController < ApplicationController

	def new
	end
  
	def create
		user = User.find_by(email: params[:email])
		if user
#			Rails.logger.debug("User Email: #{params[:email].inspect}")
			user.send_password_reset
		end	
		redirect_to root_url, :notice => "Password reset link has been emailed to " + params[:email]
	end
  
	def edit
		@user = User.find_by_password_reset_token!(params[:id])
	end
	
	def update
	  @user = User.find_by_password_reset_token!(params[:id])
	  if @user.password_reset_sent_at < 2.hours.ago
		redirect_to new_password_reset_path, :alert => "Password &crarr; 
		  reset has expired."
	  elsif @user.update_attributes(password_reset_params)
		redirect_to root_url, :notice => "Password has been reset."
	  else
		render :edit
	  end
	end
	
	
	private  #See Listing 7.22: Private functions are used internally by the controller (and don't need to be exposed to external users via the Web)

    def password_reset_params #See Chapter 7.3.2 for strong parameters.  Params.require ensures that the params hash has a :user attribute, and permits only the name, email, password, and password confirmation attributes (but no others) to be passed to User.new in the create method.
        params.require(:user).permit(:password, :password_confirmation)
    end
	
end
