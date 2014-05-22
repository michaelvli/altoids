class CreateVenues < ActiveRecord::Migration
  def change
    create_table :venues do |t|
      t.integer :neighborhood_id
      t.string :name
      t.string :address
      t.string :city
      t.string :state
      t.string :zip_code
	  t.float  :latitude
  	  t.float  :longitude

      t.text :description
      t.string :phone
      t.string :file_name
      t.boolean :logo
      t.boolean :active
	  
  	  t.time :venue_open_mon
	  t.time :venue_close_mon
	  t.time :kitchen_open_mon
	  t.time :kitchen_close_mon

  	  t.time :venue_open_tue
	  t.time :venue_close_tue
	  t.time :kitchen_open_tue
	  t.time :kitchen_close_tue

  	  t.time :venue_open_wed
	  t.time :venue_close_wed
	  t.time :kitchen_open_wed
	  t.time :kitchen_close_wed

   	  t.time :venue_open_thu
	  t.time :venue_close_thu
	  t.time :kitchen_open_thu
	  t.time :kitchen_close_thu

   	  t.time :venue_open_fri
	  t.time :venue_close_fri
	  t.time :kitchen_open_fri
	  t.time :kitchen_close_fri
	  
   	  t.time :venue_open_sat
	  t.time :venue_close_sat
	  t.time :kitchen_open_sat
	  t.time :kitchen_close_sat

   	  t.time :venue_open_sun
	  t.time :venue_close_sun
	  t.time :kitchen_open_sun
	  t.time :kitchen_close_sun
	  
      t.timestamps
    end
	
	add_index :venues, :neighborhood_id
  end
end