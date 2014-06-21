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
  after_find :format_phone_number
    
  # May need to consider regex for UTF-8 characters at some point: http://stackoverflow.com/questions/4717717/invalid-multibyte-char-us-ascii-validating-a-new-user-with-regex-using-ruby
  VALID_NAME_REGEX = /\A+[\w\s\&\,\:\-\']+\z/i
  VALID_ADDRESS_REGEX = /\A+[0-9]+[a-z0-9\s\#\.\-\:\,]+\z/i
  VALID_CITY_REGEX = /\A+[a-z\s\-\.]+\z/i
  VALID_ZIP_CODE_REGEX = /\A+[0-9]+\z/
  VALID_PHONE_REGEX = /\A+[0-9]+\z/

  validates(:name, presence: true, length: { maximum: 30 }, format: { with: VALID_NAME_REGEX })
  validates(:address, presence: true, length: { maximum: 50 }, format: { with: VALID_ADDRESS_REGEX })
  validates(:city, presence: true, format: { with: VALID_CITY_REGEX })
  validates(:state, presence: true)
  validates(:zip_code, presence: true, length: { is: 5 }, format: { with: VALID_ZIP_CODE_REGEX })
  validates(:phone, presence: true, length: { is: 10 }, format: { with: VALID_PHONE_REGEX })
  validates(:neighborhood_id, presence: true)
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

  def self.search(search)
    if search
      where('venues.name LIKE ?', "%#{search}%")
    else
      scoped  #perform an empty scope on venues and allow us to add on other queries afterwards
    end
  end
  
  #  Select random venues for carousel on home page
  def self.carousel_prep(options={})
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

		select("venues.*, venue_events.*, events.*, venues.name as venue_name, venue_events.name as venue_event_name, venue_events.description as venue_event_description, events.name as event_type_name")
			.where(id: [1, 2, 4])
			.joins(:venue_events) #			.joins("LEFT OUTER JOIN venue_events ON venues.id = venue_events.venue_id AND venue_events.id = (SELECT venue_events.id FROM venue_events ORDER BY venue_events.start_time asc LIMIT 1)")
			.joins(:events)
			.order("RANDOM()")			
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
		if self.active.nil?
			self.active = true
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