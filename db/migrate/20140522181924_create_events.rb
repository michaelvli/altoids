class CreateEvents < ActiveRecord::Migration
	def change
		create_table :events do |t|
			t.string :name
			t.boolean :active
	  
			t.timestamps
		end
	end
end