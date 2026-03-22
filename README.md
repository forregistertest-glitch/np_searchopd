# 🔍 NP_SearchOPD - ระบบค้นหาข้อมูลสัตว์ป่วย

ระบบค้นหาข้อมูลสัตว์ป่วยหนองโพ พ.ศ. 2559-2569

---

## 📋 ภาพรวม

Web application สำหรับค้นหาข้อมูลสัตว์ป่วยจาก 12 ไฟล์ CSV (103,952 รายการ)

**คุณสมบัติ:**
- ✅ ค้นหาจาก ชื่อสกุล, OPD ก่อนแก้, OPD หลังแก้
- ✅ กรองตามปี (2566-2569)
- ✅ กรองตามช่วงเวลา (ในเวลาราชการ, นอกเวลาราชการ, วันหยุดราชการ)
- ✅ กรองตามจังหวัด
- ✅ แสดงผลแบบ pagination (50 รายการต่อหน้า)
- ✅ Highlight คำค้นหา
- ✅ แสดงเวลาค้นหา
- ✅ Responsive design (รองรับมือถือ)

---

## 🚀 วิธีใช้งาน

### **1. ทดสอบบนเครื่อง (Local)**

#### **ขั้นตอนที่ 1: เปิด Web Server**

**วิธีที่ 1: ใช้ Python (แนะนำ)**
```bash
# เปิด Terminal/Command Prompt ใน folder NP_SearchOPD
cd "C:\Users\PC-DIAG\Downloads\วิเคราะห์เลข opd\NP_SearchOPD"

# รัน web server
python -m http.server 8000
```

**วิธีที่ 2: ใช้ VS Code Live Server**
1. เปิด folder `NP_SearchOPD` ใน VS Code
2. คลิกขวาที่ `index.html`
3. เลือก "Open with Live Server"

**วิธีที่ 3: ใช้ Node.js**
```bash
# ติดตั้ง http-server
npm install -g http-server

# รัน server
http-server -p 8000
```

#### **ขั้นตอนที่ 2: เปิด Browser**

เปิด browser แล้วไปที่: `http://localhost:8000`

---

### **2. Deploy บน GitHub Pages (ฟรี)**

#### **ขั้นตอนที่ 1: สร้าง GitHub Repository**

1. ไปที่ https://github.com/new
2. ตั้งชื่อ repository เช่น `np-search-opd`
3. เลือก Public
4. คลิก "Create repository"

#### **ขั้นตอนที่ 2: Upload โค้ด**

**วิธีที่ 1: ใช้ Git Command Line**
```bash
cd "C:\Users\PC-DIAG\Downloads\วิเคราะห์เลข opd\NP_SearchOPD"

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/np-search-opd.git
git push -u origin main
```

**วิธีที่ 2: ใช้ GitHub Desktop**
1. เปิด GitHub Desktop
2. File → Add Local Repository
3. เลือก folder `NP_SearchOPD`
4. Publish repository

**วิธีที่ 3: Upload ผ่าน Web**
1. ไปที่ repository ที่สร้าง
2. คลิก "uploading an existing file"
3. ลากไฟล์ทั้งหมดมาวาง
4. คลิก "Commit changes"

#### **ขั้นตอนที่ 3: เปิดใช้งาน GitHub Pages**

1. ไปที่ repository settings
2. เลือก "Pages" จากเมนูซ้าย
3. ที่ "Source" เลือก "main" branch
4. คลิก "Save"
5. รอ 1-2 นาที
6. เข้าถึงได้ที่: `https://YOUR_USERNAME.github.io/np-search-opd/`

---

### **3. Deploy บน Netlify (ฟรี)**

#### **ขั้นตอนที่ 1: สร้างบัญชี Netlify**

1. ไปที่ https://www.netlify.com/
2. Sign up (ใช้ GitHub account)

#### **ขั้นตอนที่ 2: Deploy**

**วิธีที่ 1: Drag & Drop**
1. ลากทั้ง folder `NP_SearchOPD` มาวางที่ Netlify
2. รอ deploy เสร็จ (~30 วินาที)
3. ได้ URL เช่น `https://random-name-123.netlify.app`

**วิธีที่ 2: Connect GitHub**
1. คลิก "New site from Git"
2. เลือก GitHub repository
3. คลิก "Deploy site"

---

## 📂 โครงสร้างโปรเจค

```
NP_SearchOPD/
├── index.html              # หน้าหลัก
├── css/
│   └── style.css          # Styles
├── js/
│   └── app.js             # Search logic
├── data/                  # CSV files (12 files)
│   ├── 66_ในเวลาราชการ_final_date_v2.csv
│   ├── 66_นอกเวลาราชการ_final_date_v2.csv
│   ├── 66_วันหยุดราชการ_final_date_v2.csv
│   ├── 67_ในเวลาราชการ_final_date_v2.csv
│   ├── 67_นอกเวลาราชการ_final_date_v2.csv
│   ├── 67_วันหยุดราชการ_final_date_v2.csv
│   ├── 68_ในเวลาราชการ_final_date_v2.csv
│   ├── 68_นอกเวลาราชการ_final_date_v2.csv
│   ├── 68_วันหยุดราชการ_final_date_v2.csv
│   ├── 69_ในเวลาราชการ_final_date_v2.csv
│   ├── 69_นอกเวลาราชการ_final_date_v2.csv
│   └── 69_วันหยุดราชการ_final_date_v2.csv
└── README.md              # Documentation
```

---

## 🎯 วิธีใช้งาน Web App

### **1. ค้นหาข้อมูล**

พิมพ์คำค้นหาในช่อง search:
- **ชื่อสกุล:** เช่น "วันเพ็ญ", "สมชาย"
- **OPD ก่อนแก้:** เช่น "68000503"
- **OPD หลังแก้:** เช่น "66002189"

### **2. กรองข้อมูล**

ใช้ตัวกรองเพื่อจำกัดผลลัพธ์:
- **ปี:** 2566, 2567, 2568, 2569
- **ช่วงเวลา:** ในเวลาราชการ, นอกเวลาราชการ, วันหยุดราชการ
- **จังหวัด:** เลือกจากรายการ

### **3. ดูผลลัพธ์**

- แสดง 50 รายการต่อหน้า
- คำค้นหาจะถูก highlight สีเหลือง
- แสดงเวลาค้นหา (ms)
- ใช้ปุ่ม "ก่อนหน้า" / "ถัดไป" เพื่อเปลี่ยนหน้า

---

## 🔧 Technical Details

### **Tech Stack:**
- **Frontend:** HTML5 + CSS3 + Vanilla JavaScript
- **CSV Parser:** PapaParse (CDN)
- **Hosting:** Static hosting (GitHub Pages / Netlify)

### **Performance:**
- **Load Time:** 2-3 วินาที (first load)
- **Search Time:** 50-100ms (103,952 records)
- **Memory Usage:** ~50-80 MB
- **File Size:** ~12-15 MB (12 CSV files)

### **Browser Support:**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 📊 ข้อมูล

### **จำนวนข้อมูล:**
- **ทั้งหมด:** 103,952 รายการ
- **ปี 2566:** 29,616 รายการ
- **ปี 2567:** 29,355 รายการ
- **ปี 2568:** 30,286 รายการ
- **ปี 2569:** 14,695 รายการ

### **ไฟล์ข้อมูล:**
- 12 ไฟล์ CSV
- Format: UTF-8 with BOM
- ขนาดรวม: ~12-15 MB

---

## 🐛 Troubleshooting

### **ปัญหา: ไม่สามารถโหลดข้อมูลได้**

**สาเหตุ:** CORS policy (เปิดไฟล์ HTML โดยตรง)

**วิธีแก้:**
- ใช้ web server (Python, Live Server, หรือ http-server)
- อย่าเปิดไฟล์ HTML โดยตรง (file://)

### **ปัญหา: ค้นหาช้า**

**สาเหตุ:** Browser ไม่มี RAM เพียงพอ

**วิธีแก้:**
- ปิด tabs อื่นๆ
- ใช้ browser ที่มี performance ดีกว่า (Chrome)
- รีสตาร์ท browser

### **ปัญหา: ข้อมูลไม่ถูกต้อง**

**สาเหตุ:** CSV files ไม่ถูกต้อง

**วิธีแก้:**
- ตรวจสอบว่าไฟล์ CSV อยู่ใน folder `data/`
- ตรวจสอบชื่อไฟล์ว่าตรงกับ `app.js`
- ตรวจสอบ encoding เป็น UTF-8

---

## 🔄 การอัพเดทข้อมูล

ถ้าต้องการอัพเดทข้อมูล:

1. แทนที่ไฟล์ CSV ใน folder `data/`
2. ตรวจสอบชื่อไฟล์ให้ตรงกับ `app.js`
3. Commit และ push ไปยัง GitHub
4. GitHub Pages จะ deploy อัตโนมัติ

---

## 📝 License

ข้อมูลจาก: รายงานสัตว์ป่วยหนองโพ พ.ศ. 2559-2569

---

## 📞 Support

หากมีปัญหาหรือข้อสงสัย:
1. ตรวจสอบ Console ใน Browser (F12)
2. ดู error message
3. ติดต่อผู้พัฒนา

---

**สร้างเมื่อ:** 22 มีนาคม 2026  
**เวอร์ชัน:** 1.0
