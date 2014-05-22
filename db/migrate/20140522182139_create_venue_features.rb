class CreateVenueFeatures < ActiveRecord::Migration
	def change
		create_table :venue_features do |t|
			t.integer :venue_id
			t.integer :feature_id

			t.timestamps
		end
		add_index :venue_features, :venue_id
		add_index :venue_features, :feature_id
	end
end
