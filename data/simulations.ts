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
];
