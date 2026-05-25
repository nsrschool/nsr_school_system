# 🏫 ระบบบริหารจัดการโรงเรียนหนองสำโรงวิทยา

ระบบเว็บแอปพลิเคชันสำหรับบริหารจัดการงานในโรงเรียน รวม **5 ระบบในหนึ่งเดียว** ทำงานบน **Google Apps Script** + **Google Sheets** เป็นฐานข้อมูล สามารถใช้งานออนไลน์ได้จากทุกอุปกรณ์ ทั้งคอมพิวเตอร์ แท็บเล็ต และมือถือ พร้อม**แชร์ข้อมูลร่วมกันแบบเรียลไทม์**

![Status](https://img.shields.io/badge/status-active-success)
![Platform](https://img.shields.io/badge/platform-Google%20Apps%20Script-blue)
![License](https://img.shields.io/badge/license-Educational%20Use%20Only-yellow)
![Made For](https://img.shields.io/badge/made%20for-โรงเรียนหนองสำโรงวิทยา-purple)

---

## 🚀 เปิดใช้งานระบบ (Live Demo)

### 👉 [**คลิกเข้าใช้งานระบบที่นี่**](https://script.google.com/macros/s/AKfycbzEI-BXDIOhO4FPIzPOcYGyHaVaNdH-dE4yDuL0I7fjGzJW7puGk2cbh_iBhn8Aq9sk-w/exec) 👈

```
https://script.google.com/macros/s/AKfycbzEI-BXDIOhO4FPIzPOcYGyHaVaNdH-dE4yDuL0I7fjGzJW7puGk2cbh_iBhn8Aq9sk-w/exec
```

> 💡 **แนะนำ:** เปิดบนเบราว์เซอร์ Chrome หรือ Edge เพื่อประสิทธิภาพสูงสุด

---

## 📋 ระบบทั้งหมด

| # | ระบบ | คำอธิบาย |
|---|------|----------|
| 🎒 | **ระบบกิจกรรมของหายได้คืน** | บันทึกความดี ของหาย-ของได้ เงินหาย และกิจกรรมอาสาช่วยเหลือต่างๆ |
| ⚠️ | **ระบบตัดคะแนนความประพฤติ** | บันทึกการตัดคะแนน พร้อมประวัติย้อนหลังและสถิติ |
| ✅ | **ระบบเช็คชื่อนักเรียน** | เช็คชื่อรายวันแยกชั้นเรียน พร้อมรายงานและสถิติย้อนหลัง |
| 👁️ | **ระบบตาวิเศษ** | รักษาความสะอาด แจ้งเหตุ +1 ผู้แจ้ง / -1 ผู้ทำผิด พร้อมทำเนียบเกียรติยศ |
| 🕒 | **ระบบบันทึกการมาสาย** | บันทึก → รออนุมัติ → หักคะแนน (3 บทบาท: ผู้บันทึก/ผู้อนุมัติ/ผู้ดูแล) |

### ✨ จุดเด่นของระบบ

- 🔗 **ฐานข้อมูลนักเรียนร่วมกัน** — เพิ่ม/แก้ครั้งเดียว ใช้ได้ทั้ง 5 ระบบ
- 💯 **คะแนนสะสมต่อเนื่อง** — เชื่อมโยงคะแนนระหว่างระบบอัตโนมัติ
- ☁️ **เก็บข้อมูลใน Google Sheets** ของคุณเอง ปลอดภัย ไม่ต้องเสียค่า hosting
- 📱 **Responsive Design** — ใช้งานบนมือถือ แท็บเล็ต และคอมพิวเตอร์ได้ลื่นไหล
- 💾 **Backup/Restore** — สำรองข้อมูลเป็นไฟล์ JSON ได้ทุกเมื่อ
- 📊 **Export Excel** — ส่งออกข้อมูลทุกระบบเป็นไฟล์ .xlsx ได้
- 🆓 **ใช้ฟรี 100%** — ไม่มีค่าใช้จ่ายซ่อนเร้น ไม่ต้องสมัครบริการเสริม

---

## 📖 วิธีใช้งานระบบ (สำหรับผู้ใช้)

### ขั้นตอนเริ่มต้น

1. **เข้าใช้งานครั้งแรก**
   - คลิกลิงก์ด้านบน → ระบบจะสร้าง Google Sheets อัตโนมัติในไดรฟ์ของคุณ
   - อาจต้องอนุญาต Permissions ครั้งแรก (กด **Advanced** → **Go to (unsafe)** → **Allow**)

2. **เพิ่มข้อมูลนักเรียน** (ทำก่อนเป็นอันดับแรก!)
   - ไปที่แท็บ **"จัดการนักเรียน"**
   - เลือกหนึ่งใน 3 วิธี:
     - ⌨️ พิมพ์เพิ่มทีละคน
     - 📥 ดาวน์โหลดไฟล์ฟอร์มตัวอย่าง → กรอกใน Excel → อัปโหลดกลับ
     - 📤 Import จากไฟล์ Excel/CSV ที่มีอยู่แล้ว

3. **ตั้งค่าระบบ** (ไม่บังคับ)
   - ไปที่แท็บ **"ตั้งค่าระบบ"**
   - กรอกชื่อโรงเรียน, ปีการศึกษา, อัปโหลดโลโก้ ฯลฯ

4. **เริ่มใช้งานระบบทั้ง 5 ได้เลย!**

### 📌 ทิปการใช้งาน

- **บันทึก URL ไว้:** Bookmark ลิงก์ Web App ไว้บนเบราว์เซอร์ เพื่อเข้าใช้สะดวก
- **ใช้งานพร้อมกันได้:** ครูหลายคนสามารถบันทึกข้อมูลพร้อมกันได้
- **Backup เป็นประจำ:** กด "สำรองข้อมูล" ทุกสิ้นเดือนเพื่อความปลอดภัย

---

## 🛠️ สำหรับครู/นักพัฒนาที่ต้องการนำไปติดตั้งใหม่

ถ้าคุณต้องการ**ติดตั้งระบบของตัวเอง** (มี Google Sheets แยกของตัวเอง):

### ขั้นตอนติดตั้ง (~5 นาที)

**1. ดาวน์โหลดไฟล์**
- กดปุ่ม 🟢 **Code** → **Download ZIP** ที่หน้านี้

**2. สร้าง Apps Script Project**
- ไปที่ [script.google.com](https://script.google.com)
- กด **+ New project** → ตั้งชื่อโปรเจกต์

**3. คัดลอกโค้ดเข้าไป**
- **Code.gs** — ลบเนื้อหาเดิม แล้ววางโค้ดจาก `Code.gs`
- กด ➕ ข้าง Files → **HTML** สร้างไฟล์ตามนี้:
  - `index`
  - `favicon`
  - `lostfound`
  - `conduct`
  - `attendance`
  - `magiceye`
  - `late`
- คัดลอกเนื้อหาแต่ละไฟล์ HTML วางลงไป (**ชื่อต้องตรงเป๊ะ ไม่ต้องใส่ .html**)

**4. Deploy เป็น Web App**
- กด **Deploy** → **New deployment**
- กดเฟือง ⚙️ → เลือก **Web app**
- ตั้งค่า:
  - **Execute as:** Me (ตัวเอง)
  - **Who has access:** Anyone (หรือ Anyone with Google account)
- กด **Deploy** → อนุญาต Permissions
- คัดลอก **Web app URL** ที่ได้ → เปิดใช้งานได้เลย!

---

## 📂 โครงสร้างไฟล์ในโปรเจกต์

```
nsr_school_system/
├── 📄 Code.gs              # Backend ทั้งหมด (CRUD + เชื่อม Google Sheets)
├── 🏠 index.html           # หน้าหลัก + จัดการนักเรียน + Backup/Restore
├── 🔖 favicon.html         # ไอคอนเว็บ (ฝัง base64)
├── 🎒 lostfound.html       # ระบบของหาย
├── ⚠️ conduct.html         # ระบบตัดคะแนน
├── ✅ attendance.html      # ระบบเช็คชื่อ
├── 👁️ magiceye.html        # ระบบตาวิเศษ
├── 🕒 late.html            # ระบบมาสาย
└── 📘 README.md            # ไฟล์นี้
```

---

## 🛠️ เทคโนโลยีที่ใช้

| หมวด | เทคโนโลยี |
|------|----------|
| **Backend** | Google Apps Script |
| **Database** | Google Sheets |
| **Frontend** | HTML5 + Tailwind CSS (CDN) + Vanilla JavaScript |
| **Libraries** | SheetJS (xlsx.js) สำหรับ Import/Export Excel |
| **Image Storage** | Google Drive (โลโก้/ลายเซ็น/รูปแจ้งเหตุ) |
| **Font** | Sarabun (Google Fonts) |

---

## ❓ คำถามที่พบบ่อย (FAQ)

<details>
<summary><b>Q: ข้อมูลปลอดภัยไหม? เก็บไว้ที่ไหน?</b></summary>

A: ปลอดภัย 100% เพราะข้อมูลทั้งหมดเก็บใน **Google Sheets ในไดรฟ์ของคุณเอง** ผู้พัฒนาไม่สามารถเข้าถึงข้อมูลได้ และไม่มีการส่งข้อมูลไปยังเซิร์ฟเวอร์ภายนอก
</details>

<details>
<summary><b>Q: ใช้งานได้กี่คนพร้อมกัน?</b></summary>

A: รองรับการใช้งานพร้อมกันได้หลายสิบคน ตามโควต้าของ Google Apps Script (6 นาทีต่อ script execution, 20,000 calls/วันสำหรับบัญชี Workspace)
</details>

<details>
<summary><b>Q: เปิดบนมือถือได้ไหม?</b></summary>

A: ได้ครับ ระบบออกแบบเป็น Responsive Design ใช้งานบนมือถือได้ลื่นไหล แนะนำให้ Bookmark ลิงก์ไว้เพื่อเข้าใช้ได้สะดวก
</details>

<details>
<summary><b>Q: ถ้าต้องการแก้ไขดีไซน์ ทำได้ไหม?</b></summary>

A: ทำได้ เปิด Apps Script Editor → แก้ไขไฟล์ HTML ตามต้องการ → Deploy ใหม่ (กด **Deploy → Manage deployments → Edit → New version**)
</details>

<details>
<summary><b>Q: ถ้าข้อมูลหาย จะกู้คืนได้ไหม?</b></summary>

A: ได้ครับ ระบบมีฟังก์ชัน **Backup** ให้กดสำรองข้อมูลเป็นไฟล์ JSON และ **Import** ให้นำเข้าคืนได้ แนะนำให้สำรองทุกสิ้นเดือน หรือก่อนการเปลี่ยนแปลงสำคัญ
</details>

<details>
<summary><b>Q: นำไปใช้เชิงพาณิชย์ได้ไหม?</b></summary>

A: ❌ **ไม่ได้** — โครงการนี้สำหรับใช้ในโรงเรียนเท่านั้น ห้ามดัดแปลง ทำซ้ำ เพื่อการพาณิชย์ หรือแอบอ้างเป็นผลงานตนเอง
</details>

<details>
<summary><b>Q: เปิดแล้วโหลดค้าง / Spinner หมุนตลอด แก้ยังไง?</b></summary>

A: ตรวจสอบว่า:
1. คุณเปิดผ่าน URL ของ **Apps Script** (`script.google.com/macros/...`) ไม่ใช่ GitHub Pages
2. อนุญาต Permissions ครบถ้วนแล้ว
3. ลอง Refresh หน้าหรือลอง Incognito Mode
4. ตรวจสอบว่า Internet เชื่อมต่อปกติ
</details>

---

## 👨‍🏫 ผู้พัฒนา

**ครูรุ่งนิรันดร์**
โรงเรียนหนองสำโรงวิทยา

---

## 📜 ลิขสิทธิ์

```
© พัฒนาโดย ครูรุ่งนิรันดร์
สำหรับใช้ภายในโรงเรียนหนองสำโรงวิทยาเท่านั้น
ห้ามทำซ้ำ ดัดแปลง เพื่อการพาณิชย์
หรือแอบอ้างเป็นผลงานตนเองโดยเด็ดขาด
```

---

<div align="center">

⭐ **ถ้าคิดว่าโครงการนี้มีประโยชน์ กด Star เพื่อเป็นกำลังใจให้ผู้พัฒนาด้วยนะครับ** ⭐

[![Open Web App](https://img.shields.io/badge/🚀_เปิดใช้งานระบบ-คลิกที่นี่-success?style=for-the-badge)](https://script.google.com/macros/s/AKfycbzEI-BXDIOhO4FPIzPOcYGyHaVaNdH-dE4yDuL0I7fjGzJW7puGk2cbh_iBhn8Aq9sk-w/exec)

</div>
