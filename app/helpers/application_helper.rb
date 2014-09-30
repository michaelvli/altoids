module ApplicationHelper


	def get_path(url, ext)
		path = add_ext(url.split(ENV['AWS_BUCKET'] + '/')[1], ext) # splits into an array where we keep the 2nd element (e.g. - uploads/video/attachment/89)
		return path
	end

	# helper used to present thumbnail image for video uploads
	def add_ext(url, ext)
		url = url.rpartition(".")[0].to_s + "." + ext
		return url
	end
	
	# helper used to present time in the venue modal window (see venues/_show.html.erb)
	def retrieve_time (arg, day)
		if (day == "now")
			var = "venue_" + arg + "_" + Time.zone.now.strftime('%a').downcase
		else
			var = "venue_" + arg + "_" + day.to_s[0..2].downcase
		end	
		# For more info about rails and timezones, see:  http://danilenko.org/2012/7/6/rails_timezones/
		# Rails db is always in GMT.
		# in_time_zone method:  uses Time.zone as the local zone 
		 @venue.send(var).in_time_zone
		
		# localtime method: uses operating system’s time zone.
		# @venue.send(var).in_time_zone
	end

	# helper used to present venue and kitchen hours in the venue show page (see venues/show.html.erb)
	def retrieve_hour (venue_kitchen, open_close, day_of_week)
		var = venue_kitchen + "_" + open_close + "_" + day_of_week.to_s[0..2]
		@venue.send(var)
	end
	
	# Used with filters to identify selected features
	def filter_selection(filter_array, field, checked_or_active)	
		if !filter_array.nil? && filter_array.include?(field)
			return checked_or_active
		else
			return nil
		end	
	end

	def navbar_active_helper(link)
		if link == params[:controller]
			return 'active'
		elsif link == 'venue_events' && params[:controller] == 'venue_events'
			return 'active'
		elsif link == 'other' 
			if params[:controller] == 'neighborhoods' || params[:controller] == 'features' || params[:controller] == 'events'
				return 'active'
			end	
		end
	end

	def show_label_helper(label)
		if params[:controller] == 'session'
			return false
		else
			return label
		end	
	end

	def time_field_helper(open_close, day_of_week, options ={})
		if options.empty?
			if open_close == "open"
				return "venue_open_" + day_of_week.to_s[0..2].downcase
			else
				return "venue_close_" + day_of_week.to_s[0..2].downcase
			end
		elsif options == 'kitchen'
			if open_close == "open"
				return "kitchen_open_" + day_of_week.to_s[0..2].downcase
			else
				return "kitchen_close_" + day_of_week.to_s[0..2].downcase
			end
		end
	end

	# flash messaging using bootstrap colors - code from: https://gist.github.com/roberto/3344628
	def bootstrap_class_for flash_type
		case flash_type
			when :success
				"alert-success" # Green
			when :error
				"alert-danger" # Red
			when :alert
				"alert-warning" # Yellow
			when :notice
				"alert-info" # Blue
			else
				flash_type.to_s
		end
	end
	
end
