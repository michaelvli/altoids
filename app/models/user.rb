class User < ActiveRecord::Base
  belongs_to :venue
  
  # Activerecord callbacks
  before_save :set_default
  before_save { self.email = email.downcase }
  before_create :create_remember_token
  attr_accessor :updating_password
  before_validation :process_data

  # For security reasons,  \A and \z should be used instead of ^ and $ in regular expressions - see Section 6.6 in http://guides.rubyonrails.org/security.html#sessions
  VALID_NAME_REGEX = /\A+[a-z\s]+\z/i
  VALID_ZIP_CODE_REGEX = /\A+[0-9]+\z/
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-.]+\.[a-z]+\z/i

  validates(:first_name, presence: true, length: { maximum: 20 }, format: { with: VALID_NAME_REGEX, message: "Use letters only)" })
  validates(:last_name, presence: true, length: { maximum: 20 }, format: { with: VALID_NAME_REGEX, message: "Use letters only)" })
  validates(:email, presence: true, format: { with: VALID_EMAIL_REGEX, message: "Requires proper email format" }, uniqueness: { case_sensitive: false })
#  validates(:zip_code, presence: true, length: { is: 5, message: "Requires 5 digits"}, format: { with: VALID_ZIP_CODE_REGEX, message: "Use digits only" })
  validates(:password, length: {minimum: 4}, :if => :should_validate_password? )
   validates :gender, inclusion: { in: [true, false], message: "Please select Male or Female" }
  
  if :should_validate_password?
	has_secure_password  #Section 6.3.4 - Presence validations for the password and its confirmation are automatically added by has_secure_password
  end
  
  def User.new_remember_token  #new_remember_token is a class method (vs. an instance method) since it doesn't need a user instance.
	SecureRandom.urlsafe_base64  # SecureRandom is an interface that contains the urlsafe_base64 method which generates a random URL-safe base64 string
  end

  def User.encrypt(token) #encrypt is a class method (vs. an instance method) since it doesn't need a user instance.
    Digest::SHA1.hexdigest(token.to_s)
  end

	def send_password_reset
		generate_token(:password_reset_token)
		self.password_reset_sent_at = Time.zone.now
		save!
		UserMailer.password_reset(self).deliver
	end
  
  def generate_token(column)
    begin
      self[column] = SecureRandom.urlsafe_base64
    end while User.exists?(column => self[column])
  end
  
  
  private

    def create_remember_token
      self.remember_token = User.encrypt(User.new_remember_token)
    end
	
	def set_default
      self.account_type = "user" unless self.account_type
	  self.active = true unless self.active
    end

	#  http://railscasts.com/episodes/41-conditional-validations	
    def should_validate_password?
	  updating_password || new_record?
    end

	def process_data
	  self.first_name = self.first_name.strip.titleize
  	  self.last_name = self.last_name.strip.titleize
    end
end