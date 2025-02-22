resource "aws_budgets_budget" "monthly" {
  name         = "Overall Monthly Budget"
  budget_type  = "COST"
  limit_amount = "20"
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = ["rgant@alum.wpi.edu"]
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
  }
}
