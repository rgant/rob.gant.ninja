# Infrastructure Diagram

Based on the Terraform [infrastructure](/infrastructure/) files.

```mermaid
flowchart TD
  %% Amplify infrastructure
  WebsiteBucket[S3 Bucket<br>rob-gant-ninja] --> AmplifyApp
  CustomHeaders[Security Headers<br>CSP, HSTS, etc.] --> AmplifyApp

  %% Cloudfront and S3 redirect infrastructure
  SecurityHeaders[Security Headers Policy] --> CloudFront
  CloudFront --> RedirectBucket[S3 Bucket<br>robgant-redirect]
  RedirectBucket --> WebsiteConfig[Website Configuration<br>Redirect to rob.gant.ninja]

  %% DNS infrastructure
  subgraph Route53DNSZones["Route53 DNS Zones"]
    direction TB
    GantNinja[gant.ninja]
    RobGantCom[robgant.com]
    RobGantName[robgant.name]
  end

  GantNinja --> MainDNSRecords[A, AAAA, CNAME Records]
  RobGantCom --> RedirectDNSRecords1[A, AAAA Records]
  RobGantName --> RedirectDNSRecords2[A, AAAA Records]

  MainDNSRecords --> AmplifyApp
  RedirectDNSRecords1 --> CloudFront
  RedirectDNSRecords2 --> CloudFront

  %% Home network dynamic DNS - Keeping the reversed arrows
  HomeDNSRecords[Home Network<br>Dynamic DNS Records] --> RobGantCom
  HomeDNSRecords --> RobGantName

  %% Dynamic IP
  MyIPLookup[Dynamic IP Lookup<br>my-ip.io] -.->|Optional| HomeDNSRecords

  %% ACM Certificates - Keeping original position
  ACMCerts[ACM Certificates] --> CloudFront
  ACMCerts --> AmplifyApp

  %% Budget
  Budget[AWS Budget<br>$20 USD Monthly] -.->|Alerts| Email[(Email Alerts)]

  %% Deployment flow - Keeping original position but with renamed dist/
  WebsiteBucket -->|Deploy| AmplifyApp
  LocalDist[Local dist/ Directory] -->|S3 Sync| WebsiteBucket

  %% State management
  TFStateBucket[S3 Bucket<br>tfstate-ninja-rob-gant] <-.-> |Stores State| Terraform[(Terraform)]

  %% Styling
  classDef s3 fill:#FF9900,color:white
  classDef cloudfront fill:#3F8624,color:white
  classDef amplify fill:#FF9900,color:white
  classDef dns fill:#2F86E5,color:white
  classDef security fill:#C7131F,color:white
  classDef budget fill:#00B7F4,color:white
  classDef deploy fill:#7AA116,color:white

  class WebsiteBucket,RedirectBucket,TFStateBucket s3
  class CloudFront,SecurityHeaders cloudfront
  class AmplifyApp,CustomHeaders amplify
  class GantNinja,RobGantCom,RobGantName,MainDNSRecords,RedirectDNSRecords1,RedirectDNSRecords2,HomeDNSRecords dns
  class SecurityHeaders,CustomHeaders,ACMCerts security
  class Budget,Email budget
  class LocalDist,Terraform,MyIPLookup deploy
```
