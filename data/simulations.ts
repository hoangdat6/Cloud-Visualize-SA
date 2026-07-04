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
    longDescription:
      "Mô phỏng chi tiết kiến trúc AWS Direct Connect kết nối On-Premise với AWS qua Direct Connect Gateway và Transit Gateway. Chuyển đổi giữa chế độ xem vật lý (cáp quang, cross-connect, PE Router) và logic (VLAN/VIF, định tuyến BGP) để hiểu rõ từng lớp của kết nối. Kích hoạt mô phỏng luồng gói tin cho 3 loại VIF (Private, Transit, Public) và bấm vào từng thiết bị để xem cấu hình chi tiết.",
    objectives: [
      "Phân biệt Private VIF, Transit VIF và Public VIF",
      "Hiểu vai trò của Direct Connect Gateway trong việc kết nối nhiều VPC/tài khoản",
      "Nắm được cách Transit Gateway định tuyến giữa on-premise và các VPC spoke",
      "Nhận diện điểm phân định trách nhiệm vật lý (cross-connect, demarcation) giữa khách hàng và AWS",
    ],
    components: [
      {
        name: "Customer Edge (CE) Router",
        description: "Router BGP phía khách hàng, kết nối MACsec/BFD tới AWS.",
      },
      {
        name: "AWS Direct Connect Endpoint",
        description: "Điểm neo dịch vụ nhận kết nối vật lý và phân phối vào VIFs.",
      },
      {
        name: "Direct Connect Gateway (DXGW)",
        description: "Hub logic toàn cầu, trung chuyển tuyến giữa CE Router và Transit Gateway.",
      },
      {
        name: "Transit Gateway (TGW)",
        description: "Router trung tâm hub-and-spoke kết nối nhiều VPC qua các attachment.",
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
