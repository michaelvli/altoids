class CreateUsers < ActiveRecord::Migration
	def change
		create_table :users do |t|
			t.integer :venue_id
			t.string :email
			t.string :account_type
			t.boolean :active
			t.string :first_name
			t.string :last_name
			t.boolean :gender
			t.date :birthday
			t.string :zip_code
			t.boolean :remember_me
			t.string :remember_token
			t.string :password_digest
			t.string :password_reset_token
			t.datetime :password_reset_sent_at
	  
			t.timestamps
		end
	
		add_index :users, :email, unique: true
		add_index :users, :venue_id
		add_index :users, :remember_token
	end
end
