import type { Simulation } from "@/lib/types";

/**
 * Manifest — single source of truth for the simulation catalog.
 * See docs/06-quy-trinh-them-mo-phong.md for how to add a new entry.
 */
export const simulations: Simulation[] = [
  {
    slug: "aws-direct-connect",
    title: "AWS Direct Connect — Global Topology",
    description:
      "Explore Direct Connect + Transit Gateway multi-VPC topology: Private/Transit/Public VIFs, BGP, cross-connect, Physical/Logical views.",
    longDescription:
      "A detailed walkthrough of AWS Direct Connect linking on-premises networks to AWS through Direct Connect Gateway and Transit Gateway. Switch between physical view (fiber, cross-connect, PE router) and logical view (VLAN/VIF, BGP routing) to understand each layer of the connection. Run packet-flow simulations for all three VIF types (Private, Transit, Public) and click devices for configuration details.",
    objectives: [
      "Distinguish Private VIF, Transit VIF, and Public VIF",
      "Understand Direct Connect Gateway’s role when connecting multiple VPCs and accounts",
      "See how Transit Gateway routes traffic between on-premises and spoke VPCs",
      "Identify the physical demarcation (cross-connect) between customer and AWS",
    ],
    components: [
      {
        name: "Customer Edge (CE) Router",
        description: "Customer-side BGP router, with MACsec/BFD toward AWS.",
      },
      {
        name: "AWS Direct Connect Endpoint",
        description: "Service endpoint that terminates the physical link and fans out into VIFs.",
      },
      {
        name: "Direct Connect Gateway (DXGW)",
        description: "Global logical hub that relays routes between the CE router and Transit Gateway.",
      },
      {
        name: "Transit Gateway (TGW)",
        description: "Hub-and-spoke router connecting multiple VPCs through attachments.",
      },
    ],
    cloud: "aws",
    domain: "networking",
    difficulty: "advanced",
    tags: ["Direct Connect", "Transit Gateway", "BGP", "VIF", "VPC", "DXGW"],
    htmlPath: "/simulations/aws_direct_connect_topology_simulator.html",
    createdAt: "2026-07-04",
  },
  {
    slug: "aws-dx-vpn-encryption-comparison",
    title: "Direct Connect vs VPN over DX — Encryption Path",
    description:
      "Side-by-side simulator comparing Direct Connect-only Private VIF access with classic Site-to-Site VPN over Direct Connect using a Public VIF.",
    longDescription:
      "Trace why Direct Connect by itself provides consistent private connectivity but does not add IPsec encryption, then compare it with the classic exam pattern of AWS Site-to-Site VPN over Direct Connect. The simulator highlights why Private VIF reaches private VPC resources while Public VIF is used to reach AWS public VPN endpoints before encrypted traffic enters the private EC2 subnet.",
    objectives: [
      "Distinguish Direct Connect private reachability from IPsec encryption",
      "Explain why classic VPN over Direct Connect uses a Public VIF",
      "Compare Private VIF access to EC2 private IPs with Public VIF access to AWS VPN endpoints",
      "Route employee traffic through the corporate customer gateway into the VPN tunnel",
    ],
    components: [
      {
        name: "Private VIF",
        description: "Accesses Amazon VPC resources using private IP addresses over Direct Connect.",
      },
      {
        name: "Public VIF",
        description: "Reaches AWS public service endpoints, including the classic AWS Site-to-Site VPN endpoint path.",
      },
      {
        name: "AWS Site-to-Site VPN Endpoint",
        description: "Terminates the IPsec tunnel from the customer gateway before traffic reaches the VPC.",
      },
      {
        name: "Legacy EC2 App",
        description: "Private subnet target reached either directly over DX or through the encrypted VPN tunnel.",
      },
    ],
    cloud: "aws",
    domain: "networking",
    difficulty: "advanced",
    tags: ["Direct Connect", "Site-to-Site VPN", "Public VIF", "Private VIF", "IPsec", "BGP"],
    htmlPath: "/simulations/aws_dx_vpn_encryption_comparison.html",
    createdAt: "2026-07-06",
  },
  {
    slug: "aws-mgn",
    title: "AWS MGN — Block Replication & Cutover",
    description:
      "9-step interactive walkthrough of AWS Application Migration Service: Replication Agent, TCP 443 control vs TCP 1500 data plane, staging EBS, test/cutover lifecycle.",
    longDescription:
      "Explore how AWS Application Migration Service continuously replicates on-premises servers at block level. Step through the full lifecycle from agent installation and initial sync to test launch, cutover, conversion, finalize, and cleanup. Click components to understand MGN Service, replication servers, conversion servers, S3 snapshots, and dual network paths.",
    objectives: [
      "Distinguish TCP 443 (control plane) from TCP 1500 (data replication)",
      "Understand block-level filter driver interception vs initial disk read",
      "Map staging area, replication server, and conversion server roles",
      "Follow the test instance → cutover instance → finalize lifecycle",
    ],
    components: [
      {
        name: "AWS Replication Agent",
        description: "Block-level filter driver on source server; compresses and encrypts changes.",
      },
      {
        name: "MGN Service (Control Plane)",
        description: "Managed orchestration API over TCP 443.",
      },
      {
        name: "Replication Server",
        description: "Staging subnet EC2 receiving replicated data on TCP 1500.",
      },
      {
        name: "Conversion Server",
        description: "Injects ENA/NVMe drivers for Nitro-compatible boot volumes.",
      },
    ],
    cloud: "aws",
    domain: "compute",
    difficulty: "advanced",
    tags: ["MGN", "Migration", "Replication", "Cutover", "EBS", "VPC"],
    htmlPath: "/simulations/aws_mgn_interactive.html",
    createdAt: "2026-07-06",
  },
  {
    slug: "aws-ldap-internal-flow",
    title: "LDAP Internal Flow — App, Bind, Search, Directory",
    description:
      "Flow-first simulator for App -> LDAP -> Directory Service, with bind-authentication and group-lookup scenarios.",
    longDescription:
      "Trace how an internal application talks to a directory service through LDAP. Step through bind authentication, user lookups, and group/attribute queries to see exactly where identity data lives and where application-side authorization decisions begin.",
    objectives: [
      "Explain why LDAP is a protocol and not the directory itself",
      "Trace bind and search requests between an application and directory service",
      "Separate authentication result from group or attribute lookup",
      "Understand where application-local authorization starts after LDAP returns data",
    ],
    components: [
      {
        name: "Application",
        description: "Client or internal app that opens the LDAP session and submits bind/search requests.",
      },
      {
        name: "LDAP Protocol",
        description: "Client/server access protocol used to query the directory.",
      },
      {
        name: "Directory Service",
        description: "Stores users, groups, and attributes for lookup and validation.",
      },
      {
        name: "Group / Attribute Result",
        description: "Returned identity data that the application can use for local authorization decisions.",
      },
    ],
    cloud: "aws",
    domain: "security",
    difficulty: "intermediate",
    tags: ["LDAP", "Directory Service", "Bind", "Search", "Authentication"],
    htmlPath: "/simulations/aws_ldap_flow_interactive.html",
    createdAt: "2026-07-06",
  },
  {
    slug: "aws-ad-kerberos-ticket-flow",
    title: "Active Directory + Kerberos — TGT and Service Ticket Flow",
    description:
      "Flow-first simulator for User -> AD/KDC -> TGT -> Service Ticket -> Application Service.",
    longDescription:
      "Follow a Windows domain authentication path from initial user logon through Ticket Granting Ticket issuance and onward to service-ticket-based application access. The simulator separates Active Directory as the directory boundary from Kerberos as the ticket-based authentication protocol.",
    objectives: [
      "Contrast Active Directory with Kerberos instead of treating them as the same thing",
      "Show how a client gets a TGT during domain logon",
      "Trace how the client exchanges a TGT for a service ticket",
      "Explain why services validate tickets instead of handling the original password directly",
    ],
    components: [
      {
        name: "User Workstation",
        description: "Domain-joined client that initiates logon and later requests service tickets.",
      },
      {
        name: "Active Directory",
        description: "Directory and identity boundary of the Windows domain.",
      },
      {
        name: "Kerberos KDC",
        description: "Authentication service that issues TGTs and service tickets.",
      },
      {
        name: "Application Service",
        description: "Target service that consumes the service ticket.",
      },
    ],
    cloud: "aws",
    domain: "security",
    difficulty: "advanced",
    tags: ["Active Directory", "Kerberos", "KDC", "TGT", "Service Ticket"],
    htmlPath: "/simulations/aws_ad_kerberos_flow_interactive.html",
    createdAt: "2026-07-06",
  },
  {
    slug: "aws-saml-vs-oidc-federation",
    title: "SAML vs OIDC — Side-by-Side Federation Flow",
    description:
      "Side-by-side simulator comparing browser/workforce SAML flow with mobile/web OIDC flow.",
    longDescription:
      "Compare two federation patterns on one canvas. The SAML lane emphasizes browser and workforce SSO with XML assertions, while the OIDC lane emphasizes mobile or web applications consuming modern token-based identity artifacts such as ID Token JWTs.",
    objectives: [
      "Compare SAML and OIDC as flows, not just as acronyms",
      "Distinguish browser/workforce SSO from mobile/web token-oriented sign-in",
      "Explain how the same IdP can emit different federation artifacts",
      "Separate SAML assertions from OIDC ID Tokens (JWTs)",
    ],
    components: [
      {
        name: "Identity Provider (IdP)",
        description: "Shared authentication source that can issue SAML assertions or OIDC tokens.",
      },
      {
        name: "SAML Assertion",
        description: "Browser/workforce-oriented federation artifact used by service providers.",
      },
      {
        name: "OIDC ID Token",
        description: "JWT-based identity artifact used by modern clients and relying parties.",
      },
      {
        name: "Target Application / AWS Broker",
        description: "Consumes the federation artifact for the next access step.",
      },
    ],
    cloud: "aws",
    domain: "security",
    difficulty: "advanced",
    tags: ["SAML", "OIDC", "JWT", "Federation", "IdP"],
    htmlPath: "/simulations/aws_saml_vs_oidc_flow_interactive.html",
    createdAt: "2026-07-06",
  },
  {
    slug: "aws-cognito-identity-pool-sts-flow",
    title: "Cognito Identity Pool -> STS -> IAM Role Flow",
    description:
      "Flow-first simulator for trusted external identity becoming temporary AWS credentials through Identity Pool and STS.",
    longDescription:
      "See how an external identity token or assertion becomes temporary AWS access. The simulator highlights the trust boundary between upstream identity, Cognito Identity Pool role mapping, AWS STS temporary credentials, and final resource access through an IAM role session.",
    objectives: [
      "Show that Identity Pool brokers external identity instead of replacing upstream login",
      "Trace trusted provider input into Identity Pool role mapping",
      "Explain where STS issues temporary credentials",
      "Connect IAM role sessions to final AWS resource authorization",
    ],
    components: [
      {
        name: "External Identity Token",
        description: "OIDC token or SAML-backed identity input from a trusted provider.",
      },
      {
        name: "Cognito Identity Pool",
        description: "Maps external identities into AWS IAM roles.",
      },
      {
        name: "AWS STS",
        description: "Issues temporary AWS credentials after trust succeeds.",
      },
      {
        name: "IAM Role Session",
        description: "Final AWS authorization context used to access resources.",
      },
    ],
    cloud: "aws",
    domain: "security",
    difficulty: "advanced",
    tags: ["Cognito", "Identity Pool", "STS", "IAM Role", "Federation"],
    htmlPath: "/simulations/aws_cognito_identity_pool_flow_interactive.html",
    createdAt: "2026-07-06",
  },
  {
    slug: "aws-ssm-patch-manager-staggered-patch",
    title: "AWS SSM Patch Manager — Staggered Windows Patching",
    description:
      "9-step walkthrough of Patch Manager: Patch Groups, Patch Baselines, non-overlapping Maintenance Windows, and AWS-RunPatchBaseline for staggered reboots.",
    longDescription:
      "Explore how AWS Systems Manager Patch Manager automatically identifies and applies Windows patches across a large EC2 fleet without simultaneous reboots. Step through Patch Group tagging, baseline mapping, Maintenance Window scheduling, Run Command execution, and staggered patch/reboot cycles on Group-A and Group-B.",
    objectives: [
      "Understand Patch Group as an EC2 tag, not a standalone resource",
      "Map Patch Group tags to Patch Baselines in Patch Manager",
      "Use non-overlapping Maintenance Windows to stagger reboots",
      "Follow the AWS-RunPatchBaseline document flow: scan, install, reboot",
    ],
    components: [
      {
        name: "Patch Manager",
        description: "Maps Patch Group tags to Patch Baselines and reports compliance.",
      },
      {
        name: "Patch Group (tag)",
        description: "EC2 tag that divides the fleet for staggered patching schedules.",
      },
      {
        name: "Maintenance Window",
        description: "Scheduled window that registers targets and runs AWS-RunPatchBaseline.",
      },
      {
        name: "AWS-RunPatchBaseline",
        description: "SSM document that scans, installs approved patches, and reboots if needed.",
      },
    ],
    cloud: "aws",
    domain: "compute",
    difficulty: "intermediate",
    tags: ["Systems Manager", "Patch Manager", "Maintenance Window", "EC2", "Windows", "Run Command"],
    htmlPath: "/simulations/aws_ssm_patch_manager_interactive.html",
    createdAt: "2026-07-06",
  },
];
