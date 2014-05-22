class Video < ActiveRecord::Base
	belongs_to :venue
	
#	validates :active, inclusion: { in: [true, false], message: "Please select True or False" }
end
