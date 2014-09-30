# Be sure to restart your server when you modify this file.

# Configuation below is for use with carrierwave-aws gem
CarrierWave.configure do |config|
  config.storage    = :aws
  config.aws_bucket = ENV["AWS_BUCKET"]
  config.aws_acl    = :private  # http://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html
  config.asset_host = ENV["AWS_HOST"]
  config.aws_authenticated_url_expiration = 60 * 60 * 24 * 365

  config.aws_credentials = {
	# For dev and test environments - look in config/application.yml
	# access key info below allows Zencoder access to bucket
    access_key_id:     ENV["AWS_KEY_ID_WRITE"], # Actually provides READ capabilities in addition to WRITE
    secret_access_key: ENV["AWS_KEY_VALUE_WRITE"] # Actually provides READ capabilities in addition to WRITE
  }
end