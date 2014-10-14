class UserMailer < ActionMailer::Base
  default from: "barflyscene@gmail.com"

  def password_reset(user)
	@user = user
#	Rails.logger.debug("User Email debug: #{user.email}")	
	mail(:to => @user.email, :subject => "Password Reset")
  end
  
end
