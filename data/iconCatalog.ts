export type IconProvider = "aws" | "azure" | "gcp" | "kubernetes" | "cisco" | "brand";

export interface CloudIcon {
  key: string;
  provider: IconProvider;
  label: string;
  path?: string;
  sourceUrl: string;
  status: "available" | "deferred";
  notes?: string;
  /** Links curated simulator keys to the full AWS manifest entry. */
  awsManifestKey?: string;
  /** Links curated simulator keys to the full Cisco manifest entry. */
  ciscoManifestKey?: string;
  /** Links curated simulator keys to the full brand manifest entry. */
  brandManifestKey?: string;
}

export {
  AWS_ICON_CANONICAL_FORMAT,
  AWS_ICON_CANONICAL_SIZE,
  AWS_ICON_PACKAGE,
  AWS_ICON_SOURCE,
  awsIconManifest,
  getAwsIcon,
  searchAwsIcons,
} from "./awsIconManifest";
export type { AwsIconEntry, AwsIconKind } from "./awsIconManifest";

export {
  CISCO_ICON_CANONICAL_FORMAT,
  CISCO_SAFE_SOURCE_URL,
  CISCO_TOPOLOGY_SOURCE_URL,
  ciscoIconManifest,
  getCiscoIcon,
  searchCiscoIcons,
} from "./ciscoIconManifest";
export type { CiscoIconEntry, CiscoIconKind, CiscoIconSource } from "./ciscoIconManifest";

export {
  BRAND_ICON_CANONICAL_FORMAT,
  BRAND_ICON_LICENSE,
  BRAND_ICON_PACKAGE,
  BRAND_ICON_SOURCE,
  brandIconManifest,
  getBrandIcon,
  searchBrandIcons,
} from "./brandIconManifest";
export type { BrandIconEntry } from "./brandIconManifest";

export const cloudIcons: CloudIcon[] = [
  {
    key: "aws-direct-connect",
    provider: "aws",
    label: "AWS Direct Connect",
    path: "/icons/aws/services/networking-content-delivery/aws-direct-connect.svg",
    sourceUrl: "https://aws.amazon.com/architecture/icons/",
    status: "available",
    awsManifestKey: "aws-service-networking-content-delivery-aws-direct-connect",
  },
  {
    key: "aws-transit-gateway",
    provider: "aws",
    label: "AWS Transit Gateway",
    path: "/icons/aws/services/networking-content-delivery/aws-transit-gateway.svg",
    sourceUrl: "https://aws.amazon.com/architecture/icons/",
    status: "available",
    awsManifestKey: "aws-service-networking-content-delivery-aws-transit-gateway",
  },
  {
    key: "aws-vpc",
    provider: "aws",
    label: "Amazon VPC",
    path: "/icons/aws/services/networking-content-delivery/amazon-virtual-private-cloud.svg",
    sourceUrl: "https://aws.amazon.com/architecture/icons/",
    status: "available",
    awsManifestKey: "aws-service-networking-content-delivery-amazon-virtual-private-cloud",
  },
  {
    key: "aws-s3",
    provider: "aws",
    label: "Amazon S3",
    path: "/icons/aws/services/storage/amazon-simple-storage-service.svg",
    sourceUrl: "https://aws.amazon.com/architecture/icons/",
    status: "available",
    awsManifestKey: "aws-service-storage-amazon-simple-storage-service",
  },
  {
    key: "aws-ec2",
    provider: "aws",
    label: "Amazon EC2",
    path: "/icons/aws/services/compute/amazon-ec2.svg",
    sourceUrl: "https://aws.amazon.com/architecture/icons/",
    status: "available",
    awsManifestKey: "aws-service-compute-amazon-ec2",
  },
  {
    key: "aws-ebs",
    provider: "aws",
    label: "Amazon EBS",
    path: "/icons/aws/services/storage/amazon-elastic-block-store.svg",
    sourceUrl: "https://aws.amazon.com/architecture/icons/",
    status: "available",
    awsManifestKey: "aws-service-storage-amazon-elastic-block-store",
  },
  {
    key: "aws-mgn",
    provider: "aws",
    label: "AWS Application Migration Service",
    path: "/icons/aws/services/migration-modernization/aws-application-migration-service.svg",
    sourceUrl: "https://aws.amazon.com/architecture/icons/",
    status: "available",
    awsManifestKey: "aws-service-migration-modernization-aws-application-migration-service",
  },
  {
    key: "azure-virtual-network",
    provider: "azure",
    label: "Azure Virtual Network",
    path: "/icons/azure/icons/10061-icon-service-virtual-networks.svg",
    sourceUrl: "https://learn.microsoft.com/en-us/azure/architecture/icons/",
    status: "available",
  },
  {
    key: "azure-virtual-network-gateway",
    provider: "azure",
    label: "Azure Virtual Network Gateway",
    path: "/icons/azure/icons/10063-icon-service-virtual-network-gateways.svg",
    sourceUrl: "https://learn.microsoft.com/en-us/azure/architecture/icons/",
    status: "available",
  },
  {
    key: "azure-virtual-machine",
    provider: "azure",
    label: "Azure Virtual Machine",
    path: "/icons/azure/icons/10021-icon-service-virtual-machine.svg",
    sourceUrl: "https://learn.microsoft.com/en-us/azure/architecture/icons/",
    status: "available",
  },
  {
    key: "azure-storage-account",
    provider: "azure",
    label: "Azure Storage Account",
    path: "/icons/azure/icons/10086-icon-service-storage-accounts.svg",
    sourceUrl: "https://learn.microsoft.com/en-us/azure/architecture/icons/",
    status: "available",
  },
  {
    key: "gcp-compute-engine",
    provider: "gcp",
    label: "Compute Engine",
    path: "/icons/gcp/core/svg/computeengine-512-color-rgb.svg",
    sourceUrl: "https://cloud.google.com/icons",
    status: "available",
  },
  {
    key: "gcp-cloud-storage",
    provider: "gcp",
    label: "Cloud Storage",
    path: "/icons/gcp/core/svg/cloud-storage-512-color.svg",
    sourceUrl: "https://cloud.google.com/icons",
    status: "available",
  },
  {
    key: "gcp-networking",
    provider: "gcp",
    label: "Google Cloud Networking",
    path: "/icons/gcp/category/svg/networking-512-color-rgb.svg",
    sourceUrl: "https://cloud.google.com/icons",
    status: "available",
  },
  {
    key: "kubernetes-pod",
    provider: "kubernetes",
    label: "Kubernetes Pod",
    path: "/icons/third-party/kubernetes/resources/unlabeled/pod.svg",
    sourceUrl: "https://github.com/kubernetes/community/tree/master/icons",
    status: "available",
  },
  {
    key: "kubernetes-service",
    provider: "kubernetes",
    label: "Kubernetes Service",
    path: "/icons/third-party/kubernetes/resources/unlabeled/svc.svg",
    sourceUrl: "https://github.com/kubernetes/community/tree/master/icons",
    status: "available",
  },
  {
    key: "cisco-router",
    provider: "cisco",
    label: "Cisco Router",
    path: "/icons/third-party/cisco/topology/router.svg",
    sourceUrl: "https://www.cisco.com/c/en/us/about/brand-center/network-topology-icons.html",
    status: "available",
    ciscoManifestKey: "cisco-topology-router",
  },
  {
    key: "cisco-switch",
    provider: "cisco",
    label: "Cisco Switch",
    path: "/icons/third-party/cisco/topology/layer-2-remote-switch.svg",
    sourceUrl: "https://www.cisco.com/c/en/us/about/brand-center/network-topology-icons.html",
    status: "available",
    ciscoManifestKey: "cisco-topology-layer-2-remote-switch",
  },
  {
    key: "cisco-firewall",
    provider: "cisco",
    label: "Cisco Firewall",
    path: "/icons/third-party/cisco/topology/firewall.svg",
    sourceUrl: "https://www.cisco.com/c/en/us/about/brand-center/network-topology-icons.html",
    status: "available",
    ciscoManifestKey: "cisco-topology-firewall",
  },
  {
    key: "cisco-safe-router",
    provider: "cisco",
    label: "Cisco SAFE Router",
    path: "/icons/third-party/cisco/safe/architecture/router.svg",
    sourceUrl:
      "https://www.cisco.com/c/en/us/solutions/collateral/enterprise/design-zone-security/safe-icon-library.html",
    status: "available",
    ciscoManifestKey: "cisco-safe-architecture-router",
  },
  {
    key: "generic-user",
    provider: "cisco",
    label: "User",
    path: "/icons/third-party/cisco/topology/androgenous-person.svg",
    sourceUrl: "https://www.cisco.com/c/en/us/about/brand-center/network-topology-icons.html",
    status: "available",
    ciscoManifestKey: "cisco-topology-androgenous-person",
  },
  {
    key: "brand-go",
    provider: "brand",
    label: "Go",
    path: "/icons/third-party/brands/go.svg",
    sourceUrl: "https://github.com/simple-icons/simple-icons",
    status: "available",
    brandManifestKey: "brand-go",
  },
  {
    key: "brand-nginx",
    provider: "brand",
    label: "Nginx",
    path: "/icons/third-party/brands/nginx.svg",
    sourceUrl: "https://github.com/simple-icons/simple-icons",
    status: "available",
    brandManifestKey: "brand-nginx",
  },
  {
    key: "brand-docker",
    provider: "brand",
    label: "Docker",
    path: "/icons/third-party/brands/docker.svg",
    sourceUrl: "https://github.com/simple-icons/simple-icons",
    status: "available",
    brandManifestKey: "brand-docker",
  },
  {
    key: "brand-postgresql",
    provider: "brand",
    label: "PostgreSQL",
    path: "/icons/third-party/brands/postgresql.svg",
    sourceUrl: "https://github.com/simple-icons/simple-icons",
    status: "available",
    brandManifestKey: "brand-postgresql",
  },
  {
    key: "brand-redis",
    provider: "brand",
    label: "Redis",
    path: "/icons/third-party/brands/redis.svg",
    sourceUrl: "https://github.com/simple-icons/simple-icons",
    status: "available",
    brandManifestKey: "brand-redis",
  },
  {
    key: "brand-terraform",
    provider: "brand",
    label: "Terraform",
    path: "/icons/third-party/brands/terraform.svg",
    sourceUrl: "https://github.com/simple-icons/simple-icons",
    status: "available",
    brandManifestKey: "brand-terraform",
  },
];

export function getIcon(key: string): CloudIcon | undefined {
  return cloudIcons.find((icon) => icon.key === key);
}

export function getAvailableIcons(provider?: IconProvider): CloudIcon[] {
  return cloudIcons.filter(
    (icon) => icon.status === "available" && (!provider || icon.provider === provider),
  );
}
