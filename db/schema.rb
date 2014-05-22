# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20140522201354) do

  create_table "events", force: true do |t|
    t.string   "name"
    t.boolean  "active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "features", force: true do |t|
    t.string   "name"
    t.boolean  "active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "neighborhoods", force: true do |t|
    t.string   "name"
    t.string   "city"
    t.string   "state"
    t.boolean  "active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "neighborhoods", ["name"], name: "index_neighborhoods_on_name"

  create_table "products", force: true do |t|
    t.string   "name"
    t.decimal  "price"
    t.datetime "released_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", force: true do |t|
    t.integer  "venue_id"
    t.string   "email"
    t.string   "account_type"
    t.boolean  "active"
    t.string   "first_name"
    t.string   "last_name"
    t.boolean  "gender"
    t.date     "birthday"
    t.string   "zip_code"
    t.boolean  "remember_me"
    t.string   "remember_token"
    t.string   "password_digest"
    t.string   "password_reset_token"
    t.datetime "password_reset_sent_at"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["remember_token"], name: "index_users_on_remember_token"
  add_index "users", ["venue_id"], name: "index_users_on_venue_id"

  create_table "venue_events", force: true do |t|
    t.integer  "venue_id"
    t.integer  "event_id"
    t.string   "name"
    t.text     "description"
    t.boolean  "active"
    t.text     "recurrence"
    t.datetime "start_time"
    t.datetime "end_time"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "venue_events", ["venue_id"], name: "index_venue_events_on_venue_id"

  create_table "venue_features", force: true do |t|
    t.integer  "venue_id"
    t.integer  "feature_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "venue_features", ["feature_id"], name: "index_venue_features_on_feature_id"
  add_index "venue_features", ["venue_id"], name: "index_venue_features_on_venue_id"

  create_table "venues", force: true do |t|
    t.integer  "neighborhood_id"
    t.string   "name"
    t.string   "address"
    t.string   "city"
    t.string   "state"
    t.string   "zip_code"
    t.float    "latitude"
    t.float    "longitude"
    t.text     "description"
    t.string   "phone"
    t.string   "file_name"
    t.boolean  "logo"
    t.boolean  "active"
    t.time     "venue_open_mon"
    t.time     "venue_close_mon"
    t.time     "kitchen_open_mon"
    t.time     "kitchen_close_mon"
    t.time     "venue_open_tue"
    t.time     "venue_close_tue"
    t.time     "kitchen_open_tue"
    t.time     "kitchen_close_tue"
    t.time     "venue_open_wed"
    t.time     "venue_close_wed"
    t.time     "kitchen_open_wed"
    t.time     "kitchen_close_wed"
    t.time     "venue_open_thu"
    t.time     "venue_close_thu"
    t.time     "kitchen_open_thu"
    t.time     "kitchen_close_thu"
    t.time     "venue_open_fri"
    t.time     "venue_close_fri"
    t.time     "kitchen_open_fri"
    t.time     "kitchen_close_fri"
    t.time     "venue_open_sat"
    t.time     "venue_close_sat"
    t.time     "kitchen_open_sat"
    t.time     "kitchen_close_sat"
    t.time     "venue_open_sun"
    t.time     "venue_close_sun"
    t.time     "kitchen_open_sun"
    t.time     "kitchen_close_sun"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "website"
  end

  add_index "venues", ["neighborhood_id"], name: "index_venues_on_neighborhood_id"

  create_table "videos", force: true do |t|
    t.integer  "venue_id"
    t.string   "video_name"
    t.boolean  "live"
    t.boolean  "active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "videos", ["venue_id"], name: "index_videos_on_venue_id"

end
