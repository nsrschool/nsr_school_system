# 🏫 ระบบบริหารจัดการโรงเรียนหนองสำโรงวิทยา

ระบบเว็บแอปพลิเคชันสำหรับโรงเรียน รวม **5 ระบบในหนึ่งเดียว** ทำงานแบบ Hybrid:
- **Frontend** → โฮสต์บน **GitHub Pages** (เร็ว ฟรี ใช้งานง่าย)
- **Backend** → **Google Apps Script** + **Google Sheets** (ฐานข้อมูลออนไลน์)

![Status](https://img.shields.io/badge/status-active-success)
![Platform](https://img.shields.io/badge/frontend-GitHub%20Pages-blue)
![Backend](https://img.shields.io/badge/backend-Apps%20Script%20API-orange)

---

## 🚀 เปิดใช้งานระบบ

### 👉 [**คลิกเข้าใช้งานที่นี่**](https://nsrschool.github.io/nsr_school_system/) 👈

```
https://nsrschool.github.io/nsr_school_system/
```

---

## 📋 ระบบทั้งหมด 5 ระบบ

| ระบบ | คำอธิบาย |
|------|----------|
| 🎒 **ของหายได้คืน** | บันทึกความดี ของหาย เงินหาย พร้อมประวัติ |
| ⚠️ **ตัดคะแนนความประพฤติ** | บันทึกการตัดคะแนน พร้อมสถิติ |
| ✅ **เช็คชื่อนักเรียน** | เช็คชื่อรายวันแยกชั้น พร้อมรายงาน |
| 👁️ **ตาวิเศษ** | แจ้งเหตุ +1 ผู้แจ้ง / -1 ผู้ทำผิด |
| 🕒 **บันทึกการมาสาย** | ส่งบันทึก → รออนุมัติ → หักคะแนน |

---

## 🏗️ สถาปัตยกรรมระบบ

```
┌─────────────────────────┐         ┌─────────────────────────┐
│   GitHub Pages          │  fetch  │   Google Apps Script    │
│   (Frontend HTML/JS)    │ ───────▶│   (Backend API)         │
│                         │ ◀───────│                         │
│  - index.html           │  JSON   │   doGet / doPost        │
│  - lostfound.html       │         │           │             │
│  - conduct.html         │         │           ▼             │
│  - attendance.html      │         │   ┌─────────────────┐   │
│  - magiceye.html        │         │   │ Google Sheets   │   │
│  - late.html            │         │   │ (Database)      │   │
│  - api-client.js        │         │   └─────────────────┘   │
└─────────────────────────┘         └─────────────────────────┘
```

---

## 🛠️ วิธีติดตั้งสำหรับนำไปใช้ในโรงเรียนอื่น

### 🔹 ส่วนที่ 1: ติดตั้ง Backend (Apps Script + Sheets)

**1.1 สร้าง Apps Script Project**
- ไปที่ [script.google.com](https://script.google.com) → **+ New project**
- ตั้งชื่อโปรเจกต์ เช่น `NSR School API`

**1.2 วางโค้ด Backend**
- ลบ `Code.gs` เดิม แล้ววางโค้ดจากไฟล์ `Code.gs` ในโฟลเดอร์ `backend/`
- กด **Save** (Ctrl+S)

**1.3 Deploy เป็น Web App**
- กด **Deploy** → **New deployment**
- เลือก type: **Web app**
- ตั้งค่า:
  - **Execute as:** Me
  - **Who has access:** **Anyone** ⚠️ (สำคัญ! ต้อง Anyone ไม่ใช่ Anyone with Google Account)
- กด **Deploy** → อนุญาต Permissions
- **คัดลอก Web App URL** ที่ได้ (ยาวประมาณ `https://script.google.com/macros/s/AKfycb.../exec`)

### 🔹 ส่วนที่ 2: ติดตั้ง Frontend (GitHub Pages)

**2.1 ดาวน์โหลด/Fork โปรเจกต์นี้**
- กดปุ่ม **Fork** ที่มุมขวาบนของหน้านี้ → ตั้งชื่อ repo ของตัวเอง
- หรือดาวน์โหลด ZIP แล้วอัปโหลดเข้า repo ใหม่

**2.2 แก้ไข API URL** ⚠️ **สำคัญ**
- เปิดไฟล์ `api-client.js`
- หาบรรทัด:
  ```javascript
  const API_URL = 'https://script.google.com/macros/s/AKfycb.../exec';
  ```
- เปลี่ยนเป็น URL ของคุณ (จากขั้นตอน 1.3)
- กด **Commit changes**

**2.3 เปิด GitHub Pages**
- ใน repo ของคุณ → **Settings** → **Pages**
- Source: เลือก **Deploy from a branch**
- Branch: เลือก **main** / **(root)**
- กด **Save**
- รอ ~1 นาที จะได้ URL: `https://USERNAME.github.io/REPO_NAME/`

### 🔹 ส่วนที่ 3: เริ่มใช้งาน

1. เปิด URL GitHub Pages ของคุณ
2. ระบบจะเรียก API → สร้าง Google Sheets อัตโนมัติ
3. ไปที่แท็บ **"จัดการนักเรียน"** → เพิ่มข้อมูลนักเรียน
4. เริ่มใช้งานทั้ง 5 ระบบได้ทันที!

---

## 📂 โครงสร้างไฟล์

```
nsr_school_system/
├── 📄 index.html              # หน้าหลัก (Frontend)
├── 📄 lostfound.html          # ระบบของหาย
├── 📄 conduct.html            # ระบบตัดคะแนน
├── 📄 attendance.html         # ระบบเช็คชื่อ
├── 📄 magiceye.html           # ระบบตาวิเศษ
├── 📄 late.html               # ระบบมาสาย
├── ⚙️ api-client.js           # ⚠️ ใส่ Web App URL ตรงนี้
├── 📂 backend/
│   └── Code.gs                # โค้ดสำหรับวางใน Apps Script
└── 📘 README.md
```

---

## ⚙️ การแก้ไขเชิงเทคนิค

### เปลี่ยน API URL
แก้ที่ไฟล์ `api-client.js` บรรทัดแรก:
```javascript
const API_URL = 'YOUR_WEB_APP_URL_HERE';
```

### Update Apps Script
หลังแก้ `Code.gs` ใน Apps Script ต้อง **Deploy ใหม่**:
- **Deploy** → **Manage deployments** → กดดินสอ ✏️
- Version: **New version** → **Deploy**
- URL จะเหมือนเดิม ไม่ต้องแก้ใน `api-client.js`

### ทำไมต้องตั้ง "Who has access" เป็น **Anyone**?
เพราะ Frontend (GitHub Pages) เรียก API จาก domain อื่น (cross-origin) ต้องเปิดให้ public เพื่อให้ fetch ได้ ข้อมูลยังคงปลอดภัยเพราะ Sheets อยู่ในไดรฟ์ของคุณ และ ID ของ student/record ยากต่อการเดา

---

## ❓ Troubleshooting

<details>
<summary><b>Spinner หมุนตลอด โหลดข้อมูลไม่ได้</b></summary>

ตรวจสอบ:
1. API URL ใน `api-client.js` ถูกต้องไหม
2. Apps Script Deploy แล้วเลือก "Anyone" ไหม (ไม่ใช่ "Anyone with Google account")
3. เปิด DevTools (F12) → Console → ดู error
4. ลอง Hard refresh (Ctrl+Shift+R)
</details>

<details>
<summary><b>CORS Error ใน Console</b></summary>

- ตรวจสอบว่า Deploy Apps Script ในโหมด **Web app** (ไม่ใช่ API executable)
- ตั้ง "Who has access" เป็น **Anyone**
- ลอง Deploy เป็น **New deployment** อีกครั้ง (ไม่ใช่ Manage version)
</details>

<details>
<summary><b>อัปโหลดรูปภาพช้า/ไม่สำเร็จ</b></summary>

ระบบจะบีบอัดรูปก่อนส่ง แต่ถ้ารูปยังใหญ่มาก (>3 MB):
- เปลี่ยนรูปให้เล็กลงก่อน
- หรือถ่ายภาพด้วยความละเอียดต่ำลง
</details>

<details>
<summary><b>เปลี่ยน Apps Script URL แล้วยังเรียก URL เก่า</b></summary>

Cache ของ browser:
- Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)
- หรือ Incognito mode ทดสอบ
</details>

---

## 🔐 ความปลอดภัย

- ✅ ข้อมูลทั้งหมดเก็บใน **Google Sheets ในไดรฟ์ของคุณ** ไม่มีใครเข้าถึงได้
- ✅ Frontend ไม่มี hard-coded credentials
- ✅ Apps Script รันด้วย account ของเจ้าของ (Execute as Me)
- ⚠️ API URL เป็น public — ใครเข้าได้ก็ใช้ระบบได้ จึงเหมาะกับใช้ภายในโรงเรียนเดียวกัน
- 💡 แนะนำให้ Backup ข้อมูลเป็น JSON ทุกสิ้นเดือน

---

## 👨‍🏫 ผู้พัฒนา

**ครูรุ่งนิรันดร์** — โรงเรียนหนองสำโรงวิทยา

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

[![Open Web App](https://img.shields.io/badge/🚀_เปิดใช้งานระบบ-คลิกที่นี่-success?style=for-the-badge)](https://nsrschool.github.io/nsr_school_system/)

⭐ ถ้าโครงการนี้มีประโยชน์ กด Star ให้กำลังใจด้วยนะครับ ⭐

</div>
