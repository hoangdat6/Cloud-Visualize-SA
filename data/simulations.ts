import type { Simulation } from "@/lib/types";

/**
 * Manifest — nguồn sự thật duy nhất về danh mục mô phỏng.
 * Xem docs/06-quy-trinh-them-mo-phong.md để biết cách thêm mục mới.
 */
export const simulations: Simulation[] = [
  {
    slug: "aws-direct-connect",
    title: "AWS Direct Connect — Global Topology",
    description:
      "Mổ xẻ topology Direct Connect + Transit Gateway đa VPC: Private/Transit/Public VIF, BGP, cross-connect, chế độ xem Physical/Logical.",
    cloud: "aws",
    domain: "networking",
    difficulty: "advanced",
    tags: [
      "Direct Connect",
      "Transit Gateway",
      "BGP",
      "VIF",
      "VPC",
      "DXGW",
    ],
    htmlPath: "/simulations/aws_direct_connect_topology_simulator.html",
    createdAt: "2026-07-04",
  },
];
