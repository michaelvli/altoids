class Video < ActiveRecord::Base
	belongs_to :venue
	has_many :venue_events, :through => :venue
	has_one :neighborhood, :through => :venue
  
#	validates :active, inclusion: { in: [true, false], message: "Please select True or False" }

	mount_uploader :attachment, VideoUploader # Tells rails to use this uploader for this model.
  
	# Note: The "public" directory (i.e. (name of application)/public) can build up with "failed" uploads.  
	# To upload a file, Carrierwave saves a copy of the file to the public folder before it performs 
	# validation.  If validations pass, Carrierwave will remove the temporary directory/files.  On the other 
	# hand, if validations fail, then the temporary directory/files will not get removed.  Subsequently, this
	# can build up quickly when there are lots of failed uploads.
	# For more in about this topic, see http://stackoverflow.com/questions/16138617/rake-aborted-operation-not-permitted-carrierwave-delete-tmp-files-that-failed
	#
	# Possible solutions:
	# 	1.  Used this solution (i.e. remove_tmp_directory() method) - https://github.com/carrierwaveuploader/carrierwave/issues/240
	#  	2.  https://github.com/carrierwaveuploader/carrierwave/wiki/How-to:-Delete-cache-garbage-directories
	#   3.  use background server to run a rake task to clean this directory periodically - http://stackoverflow.com/questions/19126504/cleanup-tmp-directory-with-carrierwave	
	#
	# after_save is an additional callback that is available after mounting an uploader.  See - https://github.com/carrierwaveuploader/carrierwave
	after_save :remove_tmp_directory  # Removes public/tmp directory which contains "failed" carrierwave uploads.
  
	# The "meta-info" column in the video table can be used to store meta-data attributes by using the store method
	# http://api.rubyonrails.org/classes/ActiveRecord/Store.html
	# http://blog.chrisblunt.com/rails-3-storing-model-metadata-attributes-with-activerecordstore/
	# "store" in this case is the ActiveRecord store method (vs. the Carrierwave callback, ":store" - see video_uploader.rb)
	store :meta_info, accessors: [ :request, :response ], coder: JSON 
  
	# To locally test the videos, after Zencoder has done
	# transcoding, do following in rails console
	#
	# >> v = Video.find(id) # id of the video model
	# >> v.meta_info = v.meta_info.merge(:response => { :input => { :duration_in_ms => 3000 }, :job => { :state => 'finished' }})
	# >> v.save!
	def duration
		((meta_info[:response].try(:[], :input).
		try(:[], :duration_in_ms) || 0) / 1000.0).ceil
	end

	def transcode_complete?
		meta_info[:response].try(:[], :job).
		try(:[], :state) == 'finished'
	end
  
	def remove_tmp_directory
		path_to_be_deleted = "#{Rails.root}/public/uploads/tmp"
		#DEBUG: Rails.logger.debug("PATH: #{path_to_be_deleted}")
		FileUtils.remove_dir(path_to_be_deleted, :force => true)
	end
  
    def self.get_videos
# NOTE: need to retrieve videos.id and allow view page to access via the ALIAS, "id", 
# because .url method in view page uses "id" to construct the url path to the S3 image/video.
#
# SELECT DISTINCT ON(videos.venue_id) videos.venue_id AS venue_id, videos.id AS id, videos.name AS video_name, videos.attachment AS attachment,
# 	neighborhoods.name AS neighborhood_name,
#	venues.name AS venue_name,
#	events.name AS event_type_name, 
# 	subquery2.name AS venue_event_name, subquery2.description AS venue_event_description, subquery2.start_time AS event_start_time 
# FROM "videos"
# INNER JOIN "venues" ON "venues"."id" = "videos"."venue_id"
# INNER JOIN "neighborhoods" ON "neighborhoods"."id" = "venues"."neighborhood_id" 
# JOIN 
# 	(SELECT venue_events.venue_id, venue_events.event_id AS event_id, venue_events.name, venue_events.description, venue_events.start_time 
# 	 FROM "venue_events" JOIN 
# 		(SELECT MIN(start_time) as event_start_time, venue_id
# 		 FROM "venue_events" 
# 		 GROUP BY venue_id) subquery1 
# 	 ON subquery1.event_start_time = venue_events.start_time AND subquery1.venue_id = venue_events.venue_id) subquery2
# ON subquery2.venue_id = videos.venue_id
# INNER JOIN "events" ON "events"."id" = subquery2.event_id
# WHERE "videos"."live" = 't'
# ORDER by videos.venue_id, random()

		subquery1 = VenueEvent.select("MIN(start_time) as event_start_time, venue_id")
		subquery1 = subquery1.group("venue_id")
		subquery1 = subquery1.to_sql
		subquery2 = VenueEvent.joins("JOIN (#{subquery1}) subquery1 ON subquery1.event_start_time = venue_events.start_time AND subquery1.venue_id = venue_events.venue_id")
		subquery2 = subquery2.select("venue_events.venue_id, venue_events.event_id AS event_id, venue_events.name, venue_events.description, venue_events.start_time")
		subquery2 = subquery2.to_sql
		@videos = Video.joins("JOIN (#{subquery2}) subquery2 ON subquery2.venue_id = videos.venue_id")

		# Modified Distinct ON statement (works in PostGreSQL but not SQLite3)
		# NOTE: need to retrieve videos.id and allow view page to access via the ALIAS, "id", 
		# because .url method in view page uses "id" to construct the url path to the S3 image/video.
		if (ActiveRecord::Base.connection.adapter_name == 'SQLite') # For a sqlite db
			@videos = @videos.select("DISTINCT (videos.venue_id), videos.id AS id, videos.venue_id AS venue_id, videos.name AS video_name, videos.attachment AS attachment, 
									neighborhoods.name AS neighborhood_name, 
									venues.name AS venue_name,
									events.name AS event_type_name,
									subquery2.name AS venue_event_name, subquery2.description AS venue_event_description, subquery2.start_time AS event_start_time")
		else
			@videos = @videos.select("DISTINCT ON(videos.venue_id) videos.venue_id AS venue_id, videos.id AS id, videos.name AS video_name, videos.attachment AS attachment, 
									neighborhoods.name AS neighborhood_name, 
									venues.name AS venue_name,
									events.name AS event_type_name, 
									subquery2.name AS venue_event_name, subquery2.description AS venue_event_description, subquery2.start_time AS event_start_time")
		end				
		@videos = @videos.joins(:neighborhood)
		@videos = @videos.joins(:venue)
		@videos = @videos.joins("INNER JOIN events ON events.id = subquery2.event_id")
	end
	
end
