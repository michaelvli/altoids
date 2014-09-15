class VideosController < ApplicationController
	
  def index
    @videos = Video.all
  end

  def new
    @video = Video.new
  end

  def create
# 	Using jquery upload (vs. Carrierwave) to upload videos.  Thus, .fileupload() (assets/javascript/video.js.coffee)
#	has dataType set to "script" which means it is expecting to receive a javascript from the server which
#	in this case comes from the create action in the Videos controller and uses a javascript template (app/views/videos/create.js.erb)
	@video = Video.create(video_params) #creates a new record
	
  
#	Code below is for using Carrierwave to upload videos.  
# 	No need to use coerce method because not using Uploadify (doesn't work on iPhones)  
#	newparams = coerce(params)
		#DEBUG: redirect_to resumes_path, notice: "newparams: #{newparams}"
	
#	@video = Video.new(video_params)
#	#DEBUG: redirect_to videos_path, notice: "newparams: #{newparams}"
#		
#    if @video.save
#		redirect_to videos_path, notice: "The video #{@video.name} has been uploaded."
#		#DEBUG: redirect_to videos_path, notice: "cool - params: #{params}"
#    else
#		render "new"
#		#DEBUG:	render :text => "debug: " + params.inspect
#		#DEBUG:	redirect_to videos_path, notice: "crap - params: #{params}"
#    end
  end

  def destroy
    @video = Video.find(params[:id])

#	http://stackoverflow.com/questions/10054985/how-to-delete-files-recursively-from-an-s3-bucket
#	To delete the entire S3 folder, the aws request but be in the following form:
#	s3.buckets[ENV['AWS_BUCKET']].objects.with_prefix('uploads/video/attachment/89/').delete_all	
	directory_to_be_deleted = File.dirname(@video.attachment.url) # get the directory of a file (e.g. - https://s3.amazonaws.com/barfly_carrierwave/uploads/video/attachment/89)
	bucket = ENV['AWS_BUCKET'] + '/' # need to remove the slash from the url so concatenate with bucket
	directory_to_be_deleted = directory_to_be_deleted.split(bucket)[1] # splits into an array where we keep the 2nd element (e.g. - uploads/video/attachment/89)
	directory_to_be_deleted = directory_to_be_deleted + '/' # need to append a forward slash at the end (e.g. - uploads/video/attachment/89/
#	logger.debug("directory_to_be_deleted: #{directory_to_be_deleted}")
	s3 = AWS::S3.new(:access_key_id => ENV['AWS_KEY_ID'], :secret_access_key => ENV['AWS_KEY_VALUE'])
	s3.buckets[ENV['AWS_BUCKET']].objects.with_prefix(directory_to_be_deleted).delete_all # deletes all contents on S3 folder under the video ID

    @video.destroy # destroy the record in the db
    redirect_to videos_path, notice:  "The video #{@video.name} has been deleted."
  end

  
	private

	def video_params
		params.require(:video).permit(:name, :attachment) 
	end

	#   See the following about the coerce(param) method - http://martinjhawkins.wordpress.com/2013/10/07/uploadify-with-paperclip-on-rails-tutorial/	
	#  	Uploadify doesn't put the params (:name and :attachment) in the correct params hash structure
	#  	In order to pass strong parameters enforcement, :name and :attachment need to be nested hashes within the :resume key:
	#  		{ 
	#			:resume => {
	#				:name = <insert name>, 
	#				:attachment = <insert attachment>
	#			} 
	#		}
	#  	Instead, uploadify produces the following params hash:
	#  		{
	#			"Filename"=>"old_town_pub.mp4", 
	#			"authenticity_token"=>"dT2XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX9BKk=", 
	#			"_CarrierWave_session"=>"dXhXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx03a77bffb", 
	#			"Filedata"=>#<ActionDispatch::Http::UploadedFile:0x2ccf8e0 @tempfile=#<File:C:/Users/MICHAE~1/AppData/Local/Temp/RackMultipart20140904-2140-15cy0hb>, @original_filename="old_town_pub.mp4", @content_type="application/octet-stream", @headers="Content-Disposition: form-data; name=\"Filedata\"; filename=\"old_town_pub.mp4\"\r\nContent-Type: application/octet-stream\r\n">, 
	#			"Upload"=>"Submit Query"
	#		}
	# 	No need to use coerce method because not using Uploadify (doesn't work on iPhones)  
#	def coerce(params)
#		if params[:video].nil?
#			params[:video] = Hash.new
#			
#			# set file name
#			if params[:name].nil?
#				params[:video][:name] = DateTime.now.strftime("%b %e, %Y @%l:%M %p")
#			else
#				params[:video][:name] = params[:name]
#				params[:name].delete
#			end 
#			
#			# nest attachment
#			params[:video][:attachment] = params[:attachment]
#	  
#			# use setContentType to determine the MIME format (so not always set to 'application/octet-stream')
#			params[:video][:attachment].content_type = setContentType(params[:attachment].original_filename)
#			# DEBUG: render :text => "debug: " + params[:attachment].original_filename.inspect	  # "american_junkie.mp4"
#			params.delete(:attachment)  # remove the extra :attachment parameter from the params hash
#
#			params[:video]
#		else
#			params
#		end
#	end

#	No need for setContentType because not using Uploadify (doesn't work on iPhone)	
#	def setContentType(originalFileName)
#	
#		fileExtension = originalFileName.split('.').last.downcase # take the last (2nd) element of the newly created array, split by the period - this should be the file extension (i.e. mp4, MOV, etc.)
#		
#		case fileExtension
#			when "mp4"
#				return "video/mp4"
#			when "mov"
#				return "video/quicktime"
#		end
#		
#	end

end
