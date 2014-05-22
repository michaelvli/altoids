module ApplicationHelper
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
				return "venue_open_" + day_of_week.to_s[0..2]
			else
				return "venue_close_" + day_of_week.to_s[0..2]
			end
		elsif options == 'kitchen'
			if open_close == "open"
				return "kitchen_open_" + day_of_week.to_s[0..2]
			else
				return "kitchen_close_" + day_of_week.to_s[0..2]
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
