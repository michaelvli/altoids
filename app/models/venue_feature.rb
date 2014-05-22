class VenueFeature < ActiveRecord::Base
  belongs_to :venue
  belongs_to :feature

  validates(:feature_id, presence: true)
  validates(:venue_id, presence: true)
#  validates :active, inclusion: { in: [true, false], message: "Please select True or False" }
  
end
