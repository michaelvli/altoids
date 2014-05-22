class CreateNeighborhoods < ActiveRecord::Migration
	def change
		create_table :neighborhoods do |t|
			t.string :name
			t.string :city
			t.string :state
			t.boolean :active
	  
			t.timestamps
		end

		add_index :neighborhoods, :name
	end
end
