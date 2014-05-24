class Feature < ActiveRecord::Base
  has_many :venue_features, dependent: :destroy
  has_many :venues, :through => :venue_features
  
  before_validation :process_data
  
  VALID_NAME_REGEX = /\A+[\w\s\&\,\:\-\'\\\&]+\z/i
	
  validates(:name, presence: true, length: { maximum: 30 }, format: { with: VALID_NAME_REGEX })
  validates :active, inclusion: { in: [true, false], message: "Please select True or False" }

  
  private
  
  	def process_data
	  self.name = self.name.strip.titleize
    end
end