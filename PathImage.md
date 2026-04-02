# Project: Veterinary Cytology AI Analysis System

เอกสารฉบับนี้รวบรวมข้อมูลการวางระบบวิเคราะห์ภาพ Cytology ขนาดใหญ่ (WSI)  ตั้งแต่โครงสร้างพื้นฐานจนถึงขั้นตอนการทำงาน

---

## 1. Development & Implementation Diagram
โครงสร้างการพัฒนาแบ่งออกเป็น 3 ส่วนหลัก: การเตรียมข้อมูล, การสร้างสมอง AI และการนำไปใช้งานจริง

[ PHASE 1: Data Acquisition ]
Slide Glass -> WSI Scanner -> Large Image (.svs/.ndpi) -> QuPath (QC & Tiling)

[ PHASE 2: AI Training ]
Tiled Images -> CVAT/Label Studio (Annotation by Pathologist) -> PyTorch (Training YOLO/EfficientNet) -> Validation

[ PHASE 3: Production Workflow ]
New Slide -> QuPath Interface -> Run Script -> AI Inference Engine -> Marking & Cell Counting -> Summary Report

---

## 2. รายละเอียด Software Stack (Full Stack) โดยละเอียด
เครื่องมือทั้งหมดเป็น Open-source (ไม่มีค่า License) แต่ต้องใช้ความเชี่ยวชาญในการปรับแต่งและเชื่อมต่อเข้าด้วยกัน

| เครื่องมือ | ประเภท | หน้าที่ | ค่าใช้จ่าย (License) | Link |
| :--- | :--- | :--- | :--- | :--- |
| OpenSlide | Library | อ่านไฟล์ภาพ Gigapixel (.svs, .ndpi) โดยไม่กิน RAM | ฟรี | openslide.org |
| PyTorch | AI Framework | สร้างและรัน Model Deep Learning (Detection/Classification) | ฟรี | pytorch.org |
| QuPath | Desktop App | หน้าจอหลักสำหรับส่องสไลด์, จัดการข้อมูล และแสดงผล Mark | ฟรี | qupath.github.io |
| CVAT | Web App | ให้พยาธิแพทย์ใช้ "วาดกรอบ" บนเซลล์เพื่อสอน AI (Annotation) | ฟรี | cvat.ai |
| Groovy/Python | Language | ภาษาหลักที่ใช้เขียน Script ควบคุมและเชื่อมต่อระบบทั้งหมด | ฟรี | python.org |

---

## 3. รายละเอียดไฟล์ภาพพยาธิวิทยา (WSI Formats)
ไฟล์เหล่านี้มีโครงสร้างแบบ Pyramid (เก็บภาพหลายระดับกำลังขยายในไฟล์เดียวเพื่อให้ซูมได้ลื่นไหล)

* .svs (Leica/Aperio): เป็นมาตรฐานที่นิยมที่สุดในโลก Digital Pathology สนับสนุนโดย Library เกือบทุกตัว (OpenSlide รองรับสมบูรณ์แบบ)
* .ndpi (Hamamatsu): ไฟล์เฉพาะของเครื่อง NanoZoomer รองรับการเก็บข้อมูลการโฟกัสหลายชั้น (Z-stack) ซึ่งจำเป็นมากสำหรับงาน Cytology เพื่อป้องกันภาพเบลอจากการที่เซลล์ซ้อนทับกันในมุมลึก

---

## 4. Hardware Recommendations (ปี 2026)

### ชุดแนะนำ: Mac Mini (M4 Pro / M5 Pro) ตามของที่มีอยู่
* CPU/GPU: Apple Silicon (M-Series Pro) มี Neural Engine ช่วยรัน AI ได้รวดเร็ว
* RAM (Unified Memory): 32GB หรือ 64GB (สำคัญที่สุดสำหรับการจัดการวัตถุ/เซลล์นับแสนตัวใน QuPath)
* OS: macOS (รองรับ QuPath และ PyTorch MPS Acceleration ได้เสถียรมาก)
* Storage: SSD 1TB (แนะนำให้มี External Thunderbolt SSD เพิ่มสำหรับเก็บคลังภาพ WSI)

---

## 5. แผนการดำเนินงาน (Step-by-Step Workflow)

1. สแกนสไลด์ (Scanning): นำตัวอย่าง FNA จากต่อมน้ำเหลืองสุนัข/แมว สแกนเป็นไฟล์ .svs หรือ .ndpi (แนะนำสแกนแบบ Z-stack)
2. เตรียมข้อมูล (Tiling): ใช้ QuPath ตัดภาพขนาดใหญ่เป็นภาพเล็กขนาด 512 x 512 พิกเซล เพื่อให้ AI ประมวลผลได้ทีละส่วน
3. สอน AI (Annotation): ให้ผู้เชี่ยวชาญใช้ CVAT หรือ QuPath ระบุชนิดเซลล์ (เช่น Normal Lymphocyte, Lymphoblast, Mitotic figure)
4. เทรนโมเดล (Training): ใช้ PyTorch สร้าง Model สำหรับ Object Detection (เช่น YOLOv11) เพื่อหาตำแหน่งและจำแนกชนิดเซลล์พร้อมกัน
5. เชื่อมต่อระบบ (Inference): เขียน Script ใน QuPath เพื่อส่งภาพไปให้ Model วิเคราะห์ และดึงพิกัดกลับมาวาด Mark ลงบนสไลด์ต้นฉบับ
6. สรุปผล (Reporting): ระบบนับจำนวนเซลล์แต่ละชนิด คำนวณเป็นเปอร์เซ็นต์ และออกรายงานสรุปสถิติ (Differential Count) อัตโนมัติ

---

## 6. แนวทางการคุยกับ Developer (Technical Specs)
* หัวข้อ: "สร้างระบบ AI สำหรับ Whole Slide Imaging (WSI) โดยใช้ OpenSlide และ PyTorch"
* เป้าหมาย: "ตรวจจับเซลล์เม็ดเลือดขาวชนิดจำเพาะในภาพ Gigapixel และแสดงผล/นับจำนวนบน QuPath"
* จุดเน้นทางเทคนิค: "ต้องจัดการเรื่อง Sliding Window Inference และ Non-Maximum Suppression (NMS) เพื่อไม่ให้นับเซลล์ซ้ำตรงรอยต่อของภาพ และปรับแต่งให้ใช้ MPS Acceleration สำหรับชิปตระกูล M-Series บน Mac"

---

## 7. ประมาณการงบประมาณ (ไม่รวมเครื่องสแกน)

| รายการ | รายละเอียด | ค่าใช้จ่ายประมาณการ |
| :--- | :--- | :--- |
| Hardware | Mac Mini M4 Pro (RAM 64GB) + Monitor + External Storage | 80,000 - 120,000 บาท |
| Software License | Open-source Stack (OpenSlide, PyTorch, QuPath, CVAT) | 0 บาท |
| Infrastructure | ค่าไฟ, Cloud Storage (ถ้ามี), ระบบ NAS สำหรับเก็บข้อมูลดิบ | 2,000 - 5,000 บาท/เดือน |
| Development | ค่าจ้าง AI Engineer และค่าตอบแทนพยาธิแพทย์ (Labeling) | ตามตกลง (Project-based) |

---
**หมายเหตุ:** ความแม่นยำของระบบขึ้นอยู่กับปริมาณและคุณภาพของภาพตัวอย่าง (Annotation) ที่ผ่านการตรวจสอบโดยพยาธิแพทย์เป็นสำคัญ ยิ่งมีข้อมูลที่หลากหลาย ระบบจะยิ่งวิเคราะห์ได้แม่นยำขึ้น

---


```mermaid
graph TD
    %% Phase 1: การเตรียมข้อมูล
    subgraph "Phase 1: Data Acquisition"
        A[<b>1. Slide Glass</b><br/>Lymph Node FNA] -->|Scanning| B[<b>2. Digital Image</b><br/>.svs / .ndpi]
        B --> C[<b>3. QuPath QC</b><br/>Tiling & Patching 512px]
    end

    %% Phase 2: การพัฒนา AI
    subgraph "Phase 2: AI Development"
        C --> D[<b>4. CVAT Annotation</b><br/>Labeling by Pathologist]
        D --> E[<b>5. PyTorch Training</b><br/>Model: YOLOv11]
        E --> F[<b>6. AI Model Saved</b><br/>File: .pth / .onnx]
    end

    %% Phase 3: การวิเคราะห์และรายงานผล
    subgraph "Phase 3: Production & Analysis"
        F --> G[<b>7. Inference Engine</b><br/>MPS / GPU Acceleration]
        G --> H[<b>8. QuPath Interface</b><br/>Detection & Counting]
        H --> I[<b>9. Final Report</b><br/>% Differential Count]
    end

    %% การตกแต่งสี (Styles)
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style F fill:#dfd,stroke:#333,stroke-width:2px
    style I fill:#dff,stroke:#333,stroke-width:2px
    
    %% เส้นประแสดงการเชื่อมโยงข้อมูลเสริม
    B -.->|Z-Stack Info| G
