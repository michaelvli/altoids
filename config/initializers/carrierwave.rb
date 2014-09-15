# Be sure to restart your server when you modify this file.

# Configuation below is for use with carrierwave-aws gem
CarrierWave.configure do |config|
  config.storage    = :aws
  config.aws_bucket = ENV["AWS_BUCKET"]
  config.aws_acl    = :public_read
  config.asset_host = ENV["AWS_HOST"]
  config.aws_authenticated_url_expiration = 60 * 60 * 24 * 365

  config.aws_credentials = {
    access_key_id:     ENV["AWS_KEY_ID"], # For dev and test environments - look in config/application.yml
    secret_access_key: ENV["AWS_KEY_VALUE"], # For dev and test environments - look in config/application.yml
  }
end