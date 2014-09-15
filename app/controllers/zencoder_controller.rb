class ZencoderController < ApplicationController
# POST response to notify server of Zencoder job completion will trigger create action of this controller.
# The notification option within the Zencoder API (uploader/video_uploader.rb) specifies the url that leads 
# to this controller.

  skip_before_filter :verify_authenticity_token # skip the verification of authenticity token for requests coming to this controller.

  def create
#	Rails.logger.debug("GOT ZENCODER RESPONSE: #{params.inspect}")

	# find the corresponding video for which the encoding process finished. 
	# The id of the video is given to us in the :pass_through parameter of the request. 
    video = Video.find_by_id(params[:job][:pass_through])
    if video && params[:job][:state] == 'finished' # Check if video exists and encoding state of process was ‘finished’ successfully
      video.meta_info[:response] = params[:zencoder]
      video.save # Save all the parameters coming in the request to meta_info of the video
    end

    render :nothing => true # No response to the request is given because the request does not expect any.
  end
end