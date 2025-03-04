output "s3_bucket" {
  description = "S3 bucket details"
  value = {
    arn = aws_s3_bucket.bucket.arn
    id  = aws_s3_bucket.bucket.id
  }
}
