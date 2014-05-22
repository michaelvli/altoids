class CreateVideos < ActiveRecord::Migration
	def change
		create_table :videos do |t|
			t.integer :venue_id
			t.string :video_name
			t.boolean :live
			t.boolean :active
		
			t.timestamps
		end
		
		add_index :videos, :venue_id
	end
end