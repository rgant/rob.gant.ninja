resource "aws_budgets_budget" "monthly" {
  name         = "Overall Monthly Budget"
  budget_type  = "COST"
  limit_amount = "20"
  limit_unit   = "USD"
  time_unit    = "MONTHLY"

  notification {
    comparison_operator        = "GREATER_THAN"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = [var.alerts_email]
    threshold                  = 80
    threshold_type             = "PERCENTAGE"
  }
}

# # https://docs.aws.amazon.com/cost-management/latest/userguide/getting-started-ad.html?icmpid=docs_console_unmapped
# resource "aws_ce_anomaly_monitor" "anomaly_monitor" {
#   name              = "AWSServiceMonitor"
#   monitor_type      = "DIMENSIONAL"
#   monitor_dimension = "SERVICE"
# }

# resource "aws_ce_anomaly_subscription" "anomaly_monitor" {
#   name      = "DAILYSUBSCRIPTION"
#   frequency = "DAILY"

#   monitor_arn_list = [
#     aws_ce_anomaly_monitor.anomaly_monitor.arn
#   ]

#   subscriber {
#     type    = "EMAIL"
#     address = var.alerts_email
#   }

#   threshold_expression {
#     dimension {
#       key           = "ANOMALY_TOTAL_IMPACT_PERCENTAGE"
#       match_options = ["GREATER_THAN_OR_EQUAL"]
#       values        = ["50"]
#     }
#   }
# }

# # https://docs.aws.amazon.com/cost-management/latest/userguide/coh-getting-started.html?icmpid=docs_costmanagement_hp-coh-opt-in
# resource "aws_costoptimizationhub_enrollment_status" "costoptimization" {}

# resource "aws_costoptimizationhub_preferences" "costoptimization" {}
