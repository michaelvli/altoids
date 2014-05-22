class CreateVenueEvents < ActiveRecord::Migration
	def change
		create_table :venue_events do |t|
			t.integer :venue_id
			t.integer :event_id
			t.string :name
			t.text :description
			t.boolean :active
			t.text :recurrence
			t.datetime :start_time
			t.datetime :end_time

			t.timestamps
		end
	
		add_index :venue_events, :venue_id
	end
end
