# encoding: utf-8
# Need the commented code above because for some reason, the constant, VALID_DOMAIN_REGEX, causes the following error:
# invalid multibyte char (US-ASCII)
# http://stackoverflow.com/questions/1739836/invalid-multibyte-char-us-ascii-with-rails-and-ruby-1-9

class Venue < ActiveRecord::Base
  has_many :users
  has_many :venue_events, dependent: :destroy
  has_many :events, :through => :venue_events
  belongs_to :neighborhood
  has_many :venue_features, dependent: :destroy
  has_many :features, :through => :venue_features
  has_many :videos, dependent: :destroy
  accepts_nested_attributes_for :videos, allow_destroy: true # http://railscasts.com/episodes/196-nested-model-form-part-1

#  scope VenueEvent.upcoming_event
	
  # Activerecord callbacks
  before_validation :process_data
  geocoded_by :geocoded_address  # Geocoding: http://railscasts.com/episodes/273-geocoder
  after_validation :geocode, :if => :address_changed?
  after_validation :sanitize_domain
  after_find :format_phone_number
    
  # May need to consider regex for UTF-8 characters at some point: http://stackoverflow.com/questions/4717717/invalid-multibyte-char-us-ascii-validating-a-new-user-with-regex-using-ruby
  VALID_NAME_REGEX = /\A+[\w\s\&\,\:\-\']+\z/i
  VALID_ADDRESS_REGEX = /\A+[0-9]+[a-z0-9\s\#\.\-\:\,]+\z/i
  VALID_CITY_REGEX = /\A+[a-z\s\-\.]+\z/i
  VALID_ZIP_CODE_REGEX = /\A+[0-9]+\z/
  VALID_PHONE_REGEX = /\A+[0-9]+\z/
  VALID_DOMAIN_REGEX = 	/\A+([a-z0-9])(([a-z0-9-]{1,61})?[a-z0-9]{1})?(\.[a-z0-9](([a-z0-9-]{1,61})?[a-z0-9‌​]{1})?)?(\.[a-zA-Z]{2,4})+\z/i
  
  validates(:name, presence: true, length: { maximum: 30 }, format: { with: VALID_NAME_REGEX })
  validates(:address, presence: true, length: { maximum: 50 }, format: { with: VALID_ADDRESS_REGEX })
  validates(:city, presence: true, format: { with: VALID_CITY_REGEX })
  validates(:state, presence: true)
  validates(:zip_code, presence: true, length: { is: 5 }, format: { with: VALID_ZIP_CODE_REGEX })
  validates(:phone, presence: true, length: { is: 10 }, format: { with: VALID_PHONE_REGEX })
  validates(:neighborhood_id, presence: true)
  validates(:website, format: {with: VALID_DOMAIN_REGEX, message: "Must be in the format www.venuewebsite.com" })
# validates :active, inclusion: { in: [true, false], message: "Please select True or False" }

  validates(:venue_open_mon, presence: true)
  validates(:venue_close_mon, presence: true)
  validates(:venue_open_tue, presence: true)
  validates(:venue_close_tue, presence: true)
  validates(:venue_open_wed, presence: true)
  validates(:venue_close_wed, presence: true)
  validates(:venue_open_thu, presence: true)
  validates(:venue_close_thu, presence: true)
  validates(:venue_open_fri, presence: true)
  validates(:venue_close_fri, presence: true)
  validates(:venue_open_sat, presence: true)
  validates(:venue_close_sat, presence: true)
  validates(:venue_open_sun, presence: true)
  validates(:venue_close_sun, presence: true)

	def get_video(venue_id)
		video = Video.where(venue_id: venue_id).where(status: 'finished').order("RANDOM()").first
		return video
	end

	def count_videos(status)
		# valid status states are: processing, failed, and finished
		counter = 0
		if (status == "processing")
			self.videos.each do |video|
				if video.response.nil?
					counter = counter + 1
				end
			end
		else
			self.videos.each do |video|
				if !video.response.nil? && (video.response[:job][:state] == status)
					counter = counter + 1
				end	
			end
		end
		return counter
	end
	
  def self.get_venues # Returns all venues including event info and neighborhood info.
	
	# http://stackoverflow.com/questions/9795660/postgresql-distinct-on-without-ordering
	# http://stackoverflow.com/questions/5483407/subqueries-in-activerecord

		# SELECT DISTINCT venues.name AS venue_name, venues.id, venues.phone, venues.file_name, 
		# 	neighborhoods.name AS neighborhood_name, neighborhoods.id AS neighborhood_id
		# 	subquery2.name AS venue_event_name, subquery2.description AS venue_event_description, subquery2.start_time AS event_start_time 
		# FROM "venues" 
		# INNER JOIN "neighborhoods" ON "neighborhoods"."id" = "venues"."neighborhood_id" 
		# INNER JOIN "videos" ON "videos"."venue_id" = "venues"."id" 
		# LEFT OUTER JOIN (
		# 	SELECT venue_events.venue_id, venue_events.name, venue_events.description, venue_events.start_time 
		# 	FROM "venue_events" JOIN (
		# 		SELECT MIN(start_time) as event_start_time, end_time as event_end_time, venue_id 
		# 		FROM "venue_events" 
		# 		WHERE (end_time > Datetime('now')) 
		# 		GROUP BY venue_id) subquery1 
		# 	ON subquery1.event_start_time = venue_events.start_time AND subquery1.venue_id = venue_events.venue_id) subquery2 
		# ON subquery2.venue_id = venues.id WHERE (videos.status = 'finished') LIMIT 2 OFFSET 0
	
		subquery1 = VenueEvent.select("MIN(start_time) as event_start_time, venue_id")
		
		# Modified sort_parameter_list to feed into PostGreSQL db used in Heroku
		if (ActiveRecord::Base.connection.adapter_name == 'SQLite') # For a sqlite db
			subquery1 = subquery1.where("end_time > Datetime('now')")
		else
			subquery1 = subquery1.where("end_time > now()")
		end		
		
		subquery1 = subquery1.group("venue_id")
		subquery1 = subquery1.to_sql
		subquery2 = VenueEvent.joins("JOIN (#{subquery1}) subquery1 ON subquery1.event_start_time = venue_events.start_time AND subquery1.venue_id = venue_events.venue_id")
		subquery2 = subquery2.select("venue_events.venue_id, venue_events.name, venue_events.description, venue_events.start_time")
		subquery2 = subquery2.to_sql
		@venues = Venue.joins("LEFT OUTER JOIN (#{subquery2}) subquery2 ON subquery2.venue_id = venues.id")
				
		@venues = @venues.select("venues.name AS venue_name, venues.id, venues.phone, venues.file_name, neighborhoods.name AS neighborhood_name, neighborhoods.id AS neighborhood_id, subquery2.name AS venue_event_name, subquery2.description AS venue_event_description, subquery2.start_time AS event_start_time")
		@venues = @venues.joins(:neighborhood)
  end
  
  
  def self.filter_features(features)
  
  	# JOIN (
	#	 SELECT venue_features.venue_id
	#	 FROM "venue_features" JOIN (
	#		  SELECT features.id as features_id, features.name as features_name
	#		  FROM features
	#		  WHERE features.name = 'Billiards' OR features.name = 'Outdoor Seating \ Patio') subquery3
	#	 ON subquery3.features_id = venue_features.feature_id
	#	 GROUP BY venue_features.venue_id) subquery4
	# ON subquery4.venue_id = venues.id
																								 
		subquery3 = Feature.select("features.id as features_id, features.name as features_name")
		subquery3 = subquery3.where(name: features) # replaced .where("features.name = ?", features)
		subquery3 = subquery3.to_sql
		subquery4 = VenueFeature.joins("JOIN (#{subquery3}) subquery3 ON subquery3.features_id = venue_features.feature_id").group("venue_features.venue_id")
		subquery4 = subquery4.select("venue_features.venue_id")
		subquery4 = subquery4.to_sql
		@venues = @venues.joins("JOIN (#{subquery4}) subquery4 ON subquery4.venue_id = venues.id")  
  end
  
  
  def self.find_events(options={}) # only returns venues that have events
	# http://stackoverflow.com/questions/9795660/postgresql-distinct-on-without-ordering
	# http://stackoverflow.com/questions/5483407/subqueries-in-activerecord
	
#	if (options[:venue_id])
#		select("venues.*, videos.*, videos.id as video_id")
#			.where(id: options[:venue_id])
#			.joins(:videos)
#	else
#		select("venues.*, videos.*, videos.id as video_id")
#			.joins(:videos)
#			.where(id: Video.select("DISTINCT videos.id"))
#			.joins(:venue_events)
#			.where("venue_events.start_time >= ?", Time.now)
#			.order("RANDOM()")
#			.limit(3)
#	end

#SELECT venues.name AS venue_name, venues.phone, venues.file_name, venues.neighborhood_id, 
#	neighborhoods.name AS neighborhood_name, neighborhoods.id, 
#	events.name AS event_type_name, 
#	subquery2.name AS venue_event_name, subquery2.event_id, subquery2.description AS venue_event_description, subquery2.start_time AS event_start_time 
#FROM "venues" 
#INNER JOIN "neighborhoods" ON "neighborhoods"."id" = "venues"."neighborhood_id" 
#LEFT OUTER JOIN 
#	(SELECT venue_events.venue_id, venue_events.event_id AS event_id, venue_events.name, venue_events.description, venue_events.start_time 
#	FROM "venue_events" 
#	JOIN 
#		(SELECT MIN(start_time) as event_start_time, venue_id 
#		FROM "venue_events" 
#		GROUP BY venue_id) subquery1 
#	ON subquery1.event_start_time = venue_events.start_time AND subquery1.venue_id = venue_events.venue_id) subquery2 
#ON subquery2.venue_id = venues.id
#INNER JOIN "events" ON "events"."id" = subquery2.event_id
			
		subquery1 = VenueEvent.select("MIN(start_time) as event_start_time, venue_id").group("venue_id").to_sql
		subquery2 = VenueEvent.joins("JOIN (#{subquery1}) subquery1 ON subquery1.event_start_time = venue_events.start_time AND subquery1.venue_id = venue_events.venue_id")
		subquery2 = subquery2.select("venue_events.venue_id, venue_events.event_id, venue_events.name, venue_events.description, venue_events.start_time").to_sql
		@venues = Venue.joins("LEFT OUTER JOIN (#{subquery2}) subquery2 ON subquery2.venue_id = venues.id")
		@venues = @venues.where(id: [1, 2, 4]) # Just for development purposes - remove for production
		@venues = @venues.select("venues.name AS venue_name, venues.phone, venues.file_name, venues.neighborhood_id, 
			neighborhoods.name AS neighborhood_name, neighborhoods.id, 
			events.name AS event_type_name,
			subquery2.name AS venue_event_name, subquery2.description AS venue_event_description, subquery2.start_time AS event_start_time")
		@venues = @venues.joins(:neighborhood)
		@venues = @venues.joins("INNER JOIN events ON events.id = subquery2.event_id")
			
  end
  
  #  Select venues with live video to showcase on home page
  def self.video_prep(options={})
  
	defaults = {
		:random => false,
		:limit => false
	}
	
	options = defaults.merge(options)
#	full query should look like:   
#	where(recorded_video: true).order("RANDOM()").limit(options[:limit])
	
	query = where(recorded_video: true)
	
	if (options[:random])
		query.order("RANDOM()")
	end
	
	if (options[:limit])
		query.limit(options[:limit])
	end
	
	return query
  end

  private
  
  	def process_data
		self.name = self.name.strip.titleize
		self.address = self.address.strip.titleize.gsub(/[^0-9a-z\s]/i, ' ')
		self.city = self.city.strip.titleize.gsub(/[^a-z\s]/i, '')
		self.state = self.state.strip.upcase.gsub(/[^a-z]/i, '')
		self.zip_code = self.zip_code.strip.gsub(/[^0-9]/, '')
		self.file_name = self.name.strip.downcase.gsub(/ /,'_').gsub(/'/,'') unless self.file_name != ""
		self.phone = self.phone.strip.gsub(/[^0-9]/, '')
		self.website = self.website.downcase
    end
	
	def sanitize_domain		
		if (!self.website.blank?) && (!self.website.include? "www.")
			self.website = "www." + self.website
		end
	end	
	
	def geocoded_address
      return self.address + ", " + self.city + ", " + self.state + " " + self.zip_code
	end  
	
	def format_phone_number
# prob don't need - check if home page lists funky phone number formats.  If not, then delete - it's from calling the same venue via find method for the three carousel items.
#		if (!self.phone.include? "(") and (!self.phone.include? "(")
			self.phone = self.phone.insert(0,"(").insert(4,") ").insert(9,"-")
#		end
	end
end