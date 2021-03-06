module ApplicationHelper

	def url_with_protocol(url)
		/^http/i.match(url) ? url : "http://#{url}"
	end
	  
	# Used in menu to identify selected item
	def menu_selection(param_action, field, checked_or_active, options = {})
		options[:default] ||= ""
		
		if param_action.nil? && options[:default] == true
			return checked_or_active
		elsif !param_action.nil? && param_action == field
			return checked_or_active
		else
			return nil
		end	
	end
	
	# Used with filters to identify selected features
	def filter_selection(filter_array, field, checked_or_active, options = {})
		options[:default] ||= ""
		
		if filter_array.nil? && options[:default] == true
			return checked_or_active
		elsif !filter_array.nil? && filter_array.include?(field)
			return checked_or_active
		else
			return nil
		end	
	end

	# correctly adds an apostrophe (before or after the letter, "s")
	def possessive(name)
		if name.end_with? "s"
			name = name + "'"
		else
			name = name + "'s"		
		end	
		return name
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
