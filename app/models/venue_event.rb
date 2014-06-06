class VenueEvent < ActiveRecord::Base
  belongs_to :venue
  belongs_to :event
  
  attr_accessor :start_date, :end_date
   
  VALID_NAME_REGEX = /\A+[\w\s\&\,\:\-\'\.\!\?\:\"\)\(\@\#\$\%\+\|\[\]\~]+\z/i

  validates(:event_id, presence: true)
# validates(:venue_id, presence: true)
  validates(:name, presence: true, length: { maximum: 30 }, format: { with: VALID_NAME_REGEX })
  validates(:start_time, presence: true)
  validates(:end_time, presence: true)
  validates(:start_date, presence: true)
# validates(:end_date, presence: true)
# validates :active, inclusion: { in: [true, false], message: "Please select True or False" }

  # Activerecord callbacks
	after_validation :process_data, :if => :pass_validation?
	#validate :start_before_end_time

  #  Selects most recent upcoming event for a specific venue in the carousel
  def self.upcoming_event
	select("venue_events.*").where("start_time >= ?", Time.now).order("start_time ASC").limit(1)
  end
  
  #  Selects upcoming events across all venues (for home page)
  def self.upcoming_events(options={})
  	defaults = {
		:venue_id => false,
	}
	options = defaults.merge(options)
	
#	full query should look like:   
# 	where("start_time >= ?", Time.now).order("start_time desc").limit(10).joins(:venue)
	
	query =	where("start_time >= ?", Time.now).order("start_time asc").joins(:venue)
	
	if (options[:venue_id])
		query = query.where(venue_id: options[:venue_id])
	end
	
	return query
	
  end


  
  private

	def pass_validation?
		if errors.count == 0
			true
		else
			false
		end
	end
	
  	def process_data
	  self.name = self.name.strip.titleize
  	  self.description = self.description.strip
	  self.start_time = create_datetime(self.start_date, self.start_time, false)
  	  self.end_time = create_datetime(self.start_date, self.end_time, true)
    end

	def create_datetime(date_arg, time_arg, end_flag)
	  date = Date.parse(date_arg)
	  year = date.strftime("%Y").to_i
	  month = date.strftime("%m").to_i
	  day = date.strftime("%d").to_i
	  hour = time_arg.strftime("%H").to_i
	  min = time_arg.strftime("%M").to_i
	  
	  # Logic should be if end time is before the venue closing time, the "same day"... Assuming 5 AM is a safe bet
	  if end_flag = true && hour <= 5
		  date_time_object = DateTime.new(year, month, day, hour, min, 0) + 1.day + 6.hours
	  else
		  # subtract six hours before creating date_time_object and saving to db
		  # reason is that 1) sqlite db is set in UTC time zone (six hours ahead of CST) and 2) app is using combined_time_select which is set in UTC to set time in db
		  # https://github.com/excid3/combined_time_select
		  date_time_object = DateTime.new(year, month, day, hour, min, 0) + 6.hours	  
	  end
	  
	end
		
	def start_before_end_time
	  if self.start_time > self.end_time
		errors.add(:end_time, 'Event must end after it starts!' + " " + self.start_time.to_s + " vs " + self.end_time.to_s)
	  end	
	end
end