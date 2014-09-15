class Video < ActiveRecord::Base
	belongs_to :venue
	
#	validates :active, inclusion: { in: [true, false], message: "Please select True or False" }

	mount_uploader :attachment, VideoUploader # Tells rails to use this uploader for this model.
	validates :name, presence: true # Make sure the owner's name is present.
  
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
	# This functionality is used in app/video_uploader.rb
	# http://api.rubyonrails.org/classes/ActiveRecord/Store.html
	# http://blog.chrisblunt.com/rails-3-storing-model-metadata-attributes-with-activerecordstore/
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
  
end
