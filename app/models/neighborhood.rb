class Neighborhood < ActiveRecord::Base
  has_many :venues
	
  # Activerecord callbacks
  before_validation :process_data
  
  VALID_NAME_REGEX = /\A+[\w\s\&\,\:\-\']+\z/i
  VALID_CITY_REGEX = /\A+[a-z\s\-\.]+\z/i
	
  validates(:name, presence: true, length: { maximum: 30 }, format: { with: VALID_NAME_REGEX })
  validates(:city, presence: true, format: { with: VALID_CITY_REGEX })
  validates(:state, presence: true)
  validates :active, inclusion: { in: [true, false], message: "Please select True or False" }
  
  
  private
  
  	def process_data
	  self.name = self.name.strip.titleize
  	  self.city = self.city.strip.titleize.gsub(/[^a-z\s]/i, '')
   	  self.state = self.state.strip.upcase.gsub(/[^a-z]/i, '')
    end
	
end
