/**
 * ===================================================================
 * 🏫 ระบบบริหารจัดการนักเรียน โรงเรียนหนองสำโรงวิทยา (API Mode)
 * ===================================================================
 * รวม 5 ระบบเข้าด้วยกัน โดยใช้ฐานข้อมูลนักเรียนร่วมกัน (Shared Students DB)
 *
 * ⚠️ MODE: API for GitHub Pages
 * Frontend รันบน GitHub Pages เรียก API นี้ผ่าน fetch() แทน google.script.run
 *
 *   1. ระบบกิจกรรมของหายได้คืน (Lost & Found)
 *   2. ระบบตัดคะแนนความประพฤติ (Conduct Deduction)
 *   3. ระบบเช็คชื่อนักเรียน (Attendance)
 *   4. ระบบตาวิเศษ NSR (Magic Eye)
 *   5. ระบบบันทึกการมาสาย (Late Record)
 *
 * พัฒนาโดย: ครูรุ่งนิรันดร์
 * สำหรับใช้ภายในโรงเรียนหนองสำโรงวิทยาเท่านั้น
 * ===================================================================
 */

// ============= ค่าคงที่ทั่วไป =============
const SS = SpreadsheetApp.getActiveSpreadsheet();
const DRIVE_FOLDER_NAME = 'School_System_Assets';

const SHEETS = {
  SETTINGS:        'Settings',
  STUDENTS:        'Students',
  LOST_FOUND:      'LostFound',
  CONDUCT:         'Conduct',
  ATTENDANCE:      'Attendance',
  MAGIC_EYE:       'MagicEye',
  LATE:            'Late',
  LATE_PENDING:    'LatePending'
};

const HEADERS = {
  Settings: ['Key', 'Value'],
  Students: ['ID', 'ชั้น', 'เลขที่', 'คำนำหน้า', 'ชื่อ', 'นามสกุล', 'คะแนน', 'วันที่เพิ่ม'],
  LostFound: ['ID', 'วันที่', 'StudentID', 'ชื่อ-นามสกุล', 'ชั้น', 'ประเภทกิจกรรม', 'รายละเอียดของ', 'จำนวนเงิน', 'รายละเอียด', 'คะแนน', 'สถานะ', 'ผู้รับคืน', 'วันที่รับคืน', 'Timestamp'],
  Conduct: ['ID', 'วันที่', 'StudentID', 'ชื่อ-นามสกุล', 'ชั้น', 'ประเภทความผิด', 'รายละเอียด', 'คะแนนที่ตัด', 'Timestamp'],
  Attendance: ['ID', 'วันที่', 'StudentID', 'ชื่อ-นามสกุล', 'ชั้น', 'สถานะ', 'หมายเหตุ', 'ผู้บันทึก', 'Timestamp'],
  MagicEye: ['ID', 'วันที่', 'OffenderID', 'ผู้ทำผิด', 'ชั้นผู้ทำผิด', 'ReporterID', 'ผู้แจ้ง', 'ชั้นผู้แจ้ง', 'จุดที่พบ', 'ประเภทขยะ', 'รายละเอียด', 'รูปภาพ', 'Timestamp'],
  Late: ['ID', 'วันที่', 'StudentID', 'ชื่อ-นามสกุล', 'ชั้น', 'เหตุผล', 'มาตรการ', 'คะแนน', 'ผู้บันทึก', 'สถานะ', 'Timestamp'],
  LatePending: ['ID', 'วันที่', 'StudentID', 'ชื่อ-นามสกุล', 'ชั้น', 'เหตุผล', 'มาตรการ', 'คะแนน', 'ผู้บันทึก', 'Timestamp']
};


// ===================================================================
// 🌐 API ENTRY POINTS - doGet & doPost (สำหรับ Fetch จาก GitHub Pages)
// ===================================================================

/**
 * doGet - รับ GET request
 * รูปแบบ: ?action=FUNCTION_NAME&p1=value1&p2=value2&callback=jsonp_callback
 * รองรับ JSONP (?callback=xxx) เพื่อหลีกเลี่ยงปัญหา CORS
 */
function doGet(e) {
  initSheets();
  return handleRequest(e, 'GET');
}

/**
 * doPost - รับ POST request (สำหรับข้อมูลใหญ่ เช่น รูปภาพ base64)
 * Body: JSON {action: "...", payload: {...}}
 */
function doPost(e) {
  initSheets();
  return handleRequest(e, 'POST');
}

function handleRequest(e, method) {
  let action = '', payload = {}, callback = '';

  try {
    if (method === 'POST') {
      const body = JSON.parse(e.postData.contents || '{}');
      action = body.action || '';
      payload = body.payload || {};
      callback = body.callback || '';
    } else {
      action = (e.parameter.action) || '';
      callback = (e.parameter.callback) || '';
      // ถ้ามี payload เป็น JSON string
      if (e.parameter.payload) {
        try { payload = JSON.parse(e.parameter.payload); } catch(_) { payload = {}; }
      } else {
        // รวม parameter ทั้งหมด (ยกเว้น action, callback) เป็น payload
        for (const k in e.parameter) {
          if (k !== 'action' && k !== 'callback') payload[k] = e.parameter[k];
        }
      }
    }

    if (!action) {
      return jsonOut({ ok: false, error: 'Missing action parameter' }, callback);
    }

    const result = dispatch(action, payload);
    return jsonOut({ ok: true, data: result }, callback);

  } catch (err) {
    return jsonOut({ ok: false, error: err.message || String(err) }, callback);
  }
}

/**
 * ส่งคืน JSON หรือ JSONP (ถ้ามี callback)
 */
function jsonOut(obj, callback) {
  const text = JSON.stringify(obj);
  if (callback) {
    // JSONP - เลี่ยง CORS
    return ContentService
      .createTextOutput(callback + '(' + text + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(text)
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * mapping action -> function
 */
function dispatch(action, p) {
  switch (action) {
    // ===== Settings =====
    case 'getSettings':         return getSettings();
    case 'saveSettings':        return saveSettings(p);
    // ===== Students =====
    case 'getStudents':         return getStudents();
    case 'addStudent':          return addStudent(p);
    case 'updateStudent':       return updateStudent(p.id, p.data || p);
    case 'deleteStudent':       return deleteStudent(p.id);
    case 'bulkImportStudents':  return bulkImportStudents(p.arr || p);
    // ===== Lost & Found =====
    case 'lf_getRecords':       return lf_getRecords();
    case 'lf_addRecord':        return lf_addRecord(p);
    case 'lf_updateRecord':     return lf_updateRecord(p.id, p.data || p);
    case 'lf_deleteRecord':     return lf_deleteRecord(p.id);
    case 'lf_claimItem':        return lf_claimItem(p.id, p.claimerName);
    // ===== Conduct =====
    case 'cd_getRecords':       return cd_getRecords();
    case 'cd_addRecord':        return cd_addRecord(p);
    case 'cd_updateRecord':     return cd_updateRecord(p.id, p.data || p);
    case 'cd_deleteRecord':     return cd_deleteRecord(p.id);
    // ===== Attendance =====
    case 'at_getRecords':       return at_getRecords(p.date);
    case 'at_addRecord':        return at_addRecord(p);
    case 'at_bulkSave':         return at_bulkSave(p.records || p);
    case 'at_deleteRecord':     return at_deleteRecord(p.id);
    // ===== Magic Eye =====
    case 'me_getReports':       return me_getReports();
    case 'me_addReport':        return me_addReport(p);
    case 'me_updateReport':     return me_updateReport(p.id, p.data || p);
    case 'me_deleteReport':     return me_deleteReport(p.id);
    // ===== Late =====
    case 'lt_getRecords':       return lt_getRecords();
    case 'lt_getPending':       return lt_getPending();
    case 'lt_addPending':       return lt_addPending(p);
    case 'lt_approve':          return lt_approve(p.id);
    case 'lt_approveAll':       return lt_approveAll();
    case 'lt_rejectPending':    return lt_rejectPending(p.id);
    case 'lt_deleteRecord':     return lt_deleteRecord(p.id);
    // ===== Combined =====
    case 'getAllInitialData':   return getAllInitialData(p.systemType);
    case 'getReportData':       return getReportData(p.systemType);
    // ===== Backup =====
    case 'backupAllData':       return backupAllData();
    case 'importBackupData':    return importBackupData(p.json || p);
    case 'clearAllData':        return clearAllData();
    // ===== Drive =====
    case 'uploadImageToDrive':  return uploadImageToDrive(p.base64Data, p.fileName);
    // ===== Ping =====
    case 'ping':                return { pong: new Date().toISOString() };
    default: throw new Error('Unknown action: ' + action);
  }
}

function getWebAppUrl() {
  return ScriptApp.getService().getUrl();
}

// include is no longer needed but kept for compatibility
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function initSheets() {
  Object.keys(SHEETS).forEach(function(key) {
    const name = SHEETS[key];
    let sh = SS.getSheetByName(name);
    if (!sh) {
      sh = SS.insertSheet(name);
    }
    // เขียน header ถ้ายังไม่มี
    const headers = HEADERS[name];
    if (headers && sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, headers.length).setValues([headers]);
      sh.getRange(1, 1, 1, headers.length)
        .setBackground('#4A90E2')
        .setFontColor('#FFFFFF')
        .setFontWeight('bold');
      sh.setFrozenRows(1);
    }
  });

  // ตั้งค่าเริ่มต้นถ้ายังไม่มี
  const stg = SS.getSheetByName(SHEETS.SETTINGS);
  if (stg.getLastRow() <= 1) {
    const defaults = [
      ['schoolName',   'โรงเรียนหนองสำโรงวิทยา'],
      ['academicYear', '2569'],
      ['directorName', ''],
      ['viceDirectorName', ''],
      ['logoURL', ''],
      ['signatureURL', ''],
      ['viceSignatureURL', '']
    ];
    stg.getRange(2, 1, defaults.length, 2).setValues(defaults);
  }
}


// ===================================================================
// 🛠️ Helper Functions
// ===================================================================
function _genId() {
  return Utilities.getUuid();
}

function _now() {
  return new Date().toISOString();
}

function _sheetToObjects(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  const headers = data[0];
  const rows = [];
  for (let i = 1; i < data.length; i++) {
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = data[i][j];
    }
    obj._rowIndex = i + 1; // เก็บเลขแถวจริง
    rows.push(obj);
  }
  return rows;
}

function _findRowById(sheet, id) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) return i + 1;
  }
  return -1;
}


// ===================================================================
// ⚙️ SETTINGS - ตั้งค่าทั่วไป
// ===================================================================
function getSettings() {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.SETTINGS);
  const data = sh.getDataRange().getValues();
  const obj = {};
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) obj[data[i][0]] = data[i][1] || '';
  }
  return obj;
}

function saveSettings(data) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.SETTINGS);
  // อัปเดตหรือเพิ่มใหม่
  const existing = sh.getDataRange().getValues();
  const keyToRow = {};
  for (let i = 1; i < existing.length; i++) {
    if (existing[i][0]) keyToRow[existing[i][0]] = i + 1;
  }

  Object.keys(data).forEach(function(k) {
    if (keyToRow[k]) {
      sh.getRange(keyToRow[k], 2).setValue(data[k]);
    } else {
      sh.appendRow([k, data[k]]);
    }
  });
  return { success: true, message: 'บันทึกการตั้งค่าสำเร็จ' };
}


// ===================================================================
// 🧑‍🎓 STUDENTS - ฐานข้อมูลนักเรียนร่วม
// ===================================================================
function getStudents() {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.STUDENTS);
  const list = _sheetToObjects(sh);
  return list.map(function(s) {
    return {
      id: s.ID,
      classLevel: s['ชั้น'],
      no: s['เลขที่'],
      title: s['คำนำหน้า'],
      firstName: s['ชื่อ'],
      lastName: s['นามสกุล'],
      points: Number(s['คะแนน']) || 100,
      fullName: ((s['คำนำหน้า'] || '') + (s['ชื่อ'] || '') + ' ' + (s['นามสกุล'] || '')).trim(),
      addedAt: s['วันที่เพิ่ม']
    };
  });
}

function addStudent(data) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.STUDENTS);
  const id = _genId();
  const points = (typeof data.points === 'number') ? data.points : 100;
  sh.appendRow([
    id,
    data.classLevel || '',
    data.no || '',
    data.title || '',
    data.firstName || '',
    data.lastName || '',
    points,
    new Date()
  ]);
  return { success: true, id: id, message: 'เพิ่มนักเรียนสำเร็จ' };
}

function updateStudent(id, data) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.STUDENTS);
  const row = _findRowById(sh, id);
  if (row < 0) return { success: false, message: 'ไม่พบนักเรียน' };

  if (data.classLevel !== undefined) sh.getRange(row, 2).setValue(data.classLevel);
  if (data.no !== undefined)         sh.getRange(row, 3).setValue(data.no);
  if (data.title !== undefined)      sh.getRange(row, 4).setValue(data.title);
  if (data.firstName !== undefined)  sh.getRange(row, 5).setValue(data.firstName);
  if (data.lastName !== undefined)   sh.getRange(row, 6).setValue(data.lastName);
  if (data.points !== undefined)     sh.getRange(row, 7).setValue(data.points);

  return { success: true, message: 'อัปเดตข้อมูลสำเร็จ' };
}

function deleteStudent(id) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.STUDENTS);
  const row = _findRowById(sh, id);
  if (row < 0) return { success: false, message: 'ไม่พบนักเรียน' };
  sh.deleteRow(row);
  return { success: true, message: 'ลบนักเรียนสำเร็จ' };
}

function bulkImportStudents(arr) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.STUDENTS);
  if (!arr || arr.length === 0) return { success: false, message: 'ไม่มีข้อมูล' };

  const rows = arr.map(function(s) {
    return [
      _genId(),
      s.classLevel || s['ชั้น'] || '',
      s.no || s['เลขที่'] || '',
      s.title || s['คำนำหน้า'] || '',
      s.firstName || s['ชื่อ'] || '',
      s.lastName || s['นามสกุล'] || '',
      typeof s.points === 'number' ? s.points : 100,
      new Date()
    ];
  });

  sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
  return { success: true, count: rows.length, message: 'นำเข้า ' + rows.length + ' รายการสำเร็จ' };
}

// ปรับคะแนนนักเรียน (บวก/ลบ)
function adjustStudentPoints(studentId, delta) {
  const sh = SS.getSheetByName(SHEETS.STUDENTS);
  const row = _findRowById(sh, studentId);
  if (row < 0) return false;
  const current = Number(sh.getRange(row, 7).getValue()) || 100;
  sh.getRange(row, 7).setValue(current + Number(delta));
  return true;
}


// ===================================================================
// 🏆 LOST & FOUND - ระบบของหายได้คืน
// ===================================================================
function lf_getRecords() {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.LOST_FOUND);
  return _sheetToObjects(sh).map(function(r) {
    return {
      id: r.ID,
      date: r['วันที่'] instanceof Date ? Utilities.formatDate(r['วันที่'], Session.getScriptTimeZone(), 'yyyy-MM-dd') : r['วันที่'],
      studentId: r.StudentID,
      studentName: r['ชื่อ-นามสกุล'],
      classLevel: r['ชั้น'],
      activity: r['ประเภทกิจกรรม'],
      itemDescription: r['รายละเอียดของ'],
      moneyAmount: r['จำนวนเงิน'],
      description: r['รายละเอียด'],
      points: Number(r['คะแนน']) || 0,
      status: r['สถานะ'] || 'active',
      claimedBy: r['ผู้รับคืน'] || '',
      claimedDate: r['วันที่รับคืน'] || '',
      timestamp: r.Timestamp
    };
  });
}

function lf_addRecord(data) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.LOST_FOUND);
  const id = _genId();
  sh.appendRow([
    id,
    data.date || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
    data.studentId || '',
    data.studentName || '',
    data.classLevel || '',
    data.activity || '',
    data.itemDescription || '',
    data.moneyAmount || '',
    data.description || '',
    Number(data.points) || 0,
    'active',
    '',
    '',
    new Date()
  ]);
  return { success: true, id: id, message: 'บันทึกความดีสำเร็จ' };
}

function lf_updateRecord(id, data) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.LOST_FOUND);
  const row = _findRowById(sh, id);
  if (row < 0) return { success: false, message: 'ไม่พบรายการ' };

  if (data.date !== undefined)            sh.getRange(row, 2).setValue(data.date);
  if (data.studentId !== undefined)       sh.getRange(row, 3).setValue(data.studentId);
  if (data.studentName !== undefined)     sh.getRange(row, 4).setValue(data.studentName);
  if (data.classLevel !== undefined)      sh.getRange(row, 5).setValue(data.classLevel);
  if (data.activity !== undefined)        sh.getRange(row, 6).setValue(data.activity);
  if (data.itemDescription !== undefined) sh.getRange(row, 7).setValue(data.itemDescription);
  if (data.moneyAmount !== undefined)     sh.getRange(row, 8).setValue(data.moneyAmount);
  if (data.description !== undefined)     sh.getRange(row, 9).setValue(data.description);
  if (data.points !== undefined)          sh.getRange(row, 10).setValue(data.points);

  return { success: true, message: 'อัปเดตสำเร็จ' };
}

function lf_deleteRecord(id) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.LOST_FOUND);
  const row = _findRowById(sh, id);
  if (row < 0) return { success: false, message: 'ไม่พบรายการ' };
  sh.deleteRow(row);
  return { success: true, message: 'ลบสำเร็จ' };
}

function lf_claimItem(id, claimerName) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.LOST_FOUND);
  const row = _findRowById(sh, id);
  if (row < 0) return { success: false, message: 'ไม่พบรายการ' };
  sh.getRange(row, 11).setValue('claimed');
  sh.getRange(row, 12).setValue(claimerName || '');
  sh.getRange(row, 13).setValue(Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'));
  return { success: true, message: 'บันทึกการรับคืนสำเร็จ' };
}


// ===================================================================
// ⚠️ CONDUCT - ระบบตัดคะแนนความประพฤติ
// ===================================================================
function cd_getRecords() {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.CONDUCT);
  return _sheetToObjects(sh).map(function(r) {
    return {
      id: r.ID,
      date: r['วันที่'] instanceof Date ? Utilities.formatDate(r['วันที่'], Session.getScriptTimeZone(), 'yyyy-MM-dd') : r['วันที่'],
      studentId: r.StudentID,
      studentName: r['ชื่อ-นามสกุล'],
      classLevel: r['ชั้น'],
      violationType: r['ประเภทความผิด'],
      description: r['รายละเอียด'],
      points: Number(r['คะแนนที่ตัด']) || 0,
      timestamp: r.Timestamp
    };
  });
}

function cd_addRecord(data) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.CONDUCT);
  const id = _genId();
  sh.appendRow([
    id,
    data.date || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
    data.studentId || '',
    data.studentName || '',
    data.classLevel || '',
    data.violationType || '',
    data.description || '',
    Number(data.points) || 0,
    new Date()
  ]);
  // หักคะแนนความประพฤติ
  if (data.studentId) adjustStudentPoints(data.studentId, -Number(data.points || 0));
  return { success: true, id: id, message: 'บันทึกสำเร็จ' };
}

function cd_updateRecord(id, data) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.CONDUCT);
  const row = _findRowById(sh, id);
  if (row < 0) return { success: false, message: 'ไม่พบรายการ' };

  // คืนคะแนนเก่าก่อน
  const oldPoints = Number(sh.getRange(row, 8).getValue()) || 0;
  const oldStudentId = sh.getRange(row, 3).getValue();
  if (oldStudentId) adjustStudentPoints(oldStudentId, oldPoints);

  if (data.date !== undefined)          sh.getRange(row, 2).setValue(data.date);
  if (data.studentId !== undefined)     sh.getRange(row, 3).setValue(data.studentId);
  if (data.studentName !== undefined)   sh.getRange(row, 4).setValue(data.studentName);
  if (data.classLevel !== undefined)    sh.getRange(row, 5).setValue(data.classLevel);
  if (data.violationType !== undefined) sh.getRange(row, 6).setValue(data.violationType);
  if (data.description !== undefined)   sh.getRange(row, 7).setValue(data.description);
  if (data.points !== undefined)        sh.getRange(row, 8).setValue(data.points);

  // หักคะแนนใหม่
  if (data.studentId !== undefined && data.points !== undefined) {
    adjustStudentPoints(data.studentId, -Number(data.points));
  }
  return { success: true, message: 'อัปเดตสำเร็จ' };
}

function cd_deleteRecord(id) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.CONDUCT);
  const row = _findRowById(sh, id);
  if (row < 0) return { success: false, message: 'ไม่พบรายการ' };
  // คืนคะแนน
  const points = Number(sh.getRange(row, 8).getValue()) || 0;
  const sid = sh.getRange(row, 3).getValue();
  if (sid) adjustStudentPoints(sid, points);
  sh.deleteRow(row);
  return { success: true, message: 'ลบสำเร็จ' };
}


// ===================================================================
// 📋 ATTENDANCE - ระบบเช็คชื่อ
// ===================================================================
function at_getRecords(date) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.ATTENDANCE);
  let records = _sheetToObjects(sh).map(function(r) {
    return {
      id: r.ID,
      date: r['วันที่'] instanceof Date ? Utilities.formatDate(r['วันที่'], Session.getScriptTimeZone(), 'yyyy-MM-dd') : r['วันที่'],
      studentId: r.StudentID,
      studentName: r['ชื่อ-นามสกุล'],
      classLevel: r['ชั้น'],
      status: r['สถานะ'],
      note: r['หมายเหตุ'],
      recorder: r['ผู้บันทึก'],
      timestamp: r.Timestamp
    };
  });
  if (date) records = records.filter(function(r) { return r.date === date; });
  return records;
}

function at_addRecord(data) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.ATTENDANCE);
  const id = _genId();
  sh.appendRow([
    id,
    data.date || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
    data.studentId || '',
    data.studentName || '',
    data.classLevel || '',
    data.status || 'present',
    data.note || '',
    data.recorder || '',
    new Date()
  ]);
  return { success: true, id: id, message: 'บันทึกสำเร็จ' };
}

function at_bulkSave(records) {
  initSheets();
  if (!records || records.length === 0) return { success: false, message: 'ไม่มีข้อมูล' };
  const sh = SS.getSheetByName(SHEETS.ATTENDANCE);

  // ลบรายการเดิมของวันและห้องเดียวกันก่อน (เพื่อ overwrite)
  const date = records[0].date;
  const classLevel = records[0].classLevel;
  const all = sh.getDataRange().getValues();
  for (let i = all.length - 1; i >= 1; i--) {
    const d = all[i][1];
    const ds = d instanceof Date ? Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd') : d;
    if (ds === date && all[i][4] === classLevel) sh.deleteRow(i + 1);
  }

  const rows = records.map(function(r) {
    return [
      _genId(),
      r.date,
      r.studentId || '',
      r.studentName || '',
      r.classLevel || '',
      r.status || 'present',
      r.note || '',
      r.recorder || '',
      new Date()
    ];
  });
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
  return { success: true, count: rows.length, message: 'บันทึก ' + rows.length + ' รายการสำเร็จ' };
}

function at_deleteRecord(id) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.ATTENDANCE);
  const row = _findRowById(sh, id);
  if (row < 0) return { success: false, message: 'ไม่พบรายการ' };
  sh.deleteRow(row);
  return { success: true };
}


// ===================================================================
// 👁️ MAGIC EYE - ระบบตาวิเศษ
// ===================================================================
function me_getReports() {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.MAGIC_EYE);
  return _sheetToObjects(sh).map(function(r) {
    return {
      id: r.ID,
      date: r['วันที่'] instanceof Date ? Utilities.formatDate(r['วันที่'], Session.getScriptTimeZone(), 'yyyy-MM-dd') : r['วันที่'],
      offenderId: r.OffenderID,
      offenderName: r['ผู้ทำผิด'],
      offenderClass: r['ชั้นผู้ทำผิด'],
      reporterId: r.ReporterID,
      reporterName: r['ผู้แจ้ง'],
      reporterClass: r['ชั้นผู้แจ้ง'],
      location: r['จุดที่พบ'],
      trashType: r['ประเภทขยะ'],
      details: r['รายละเอียด'],
      image: r['รูปภาพ'] || '',
      timestamp: r.Timestamp
    };
  });
}

function me_addReport(data) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.MAGIC_EYE);
  const id = _genId();
  sh.appendRow([
    id,
    data.date || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'),
    data.offenderId || '',
    data.offenderName || '',
    data.offenderClass || '',
    data.reporterId || '',
    data.reporterName || '',
    data.reporterClass || '',
    data.location || '',
    data.trashType || '',
    data.details || '',
    data.image || '',
    new Date()
  ]);
  // ผู้แจ้ง +1 ผู้ทำผิด -1
  if (data.reporterId) adjustStudentPoints(data.reporterId, 1);
  if (data.offenderId) adjustStudentPoints(data.offenderId, -1);
  return { success: true, id: id, message: 'บันทึกสำเร็จ' };
}

function me_updateReport(id, data) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.MAGIC_EYE);
  const row = _findRowById(sh, id);
  if (row < 0) return { success: false, message: 'ไม่พบรายการ' };

  if (data.date !== undefined)          sh.getRange(row, 2).setValue(data.date);
  if (data.offenderId !== undefined)    sh.getRange(row, 3).setValue(data.offenderId);
  if (data.offenderName !== undefined)  sh.getRange(row, 4).setValue(data.offenderName);
  if (data.offenderClass !== undefined) sh.getRange(row, 5).setValue(data.offenderClass);
  if (data.reporterId !== undefined)    sh.getRange(row, 6).setValue(data.reporterId);
  if (data.reporterName !== undefined)  sh.getRange(row, 7).setValue(data.reporterName);
  if (data.reporterClass !== undefined) sh.getRange(row, 8).setValue(data.reporterClass);
  if (data.location !== undefined)      sh.getRange(row, 9).setValue(data.location);
  if (data.trashType !== undefined)     sh.getRange(row, 10).setValue(data.trashType);
  if (data.details !== undefined)       sh.getRange(row, 11).setValue(data.details);
  if (data.image !== undefined)         sh.getRange(row, 12).setValue(data.image);

  return { success: true, message: 'อัปเดตสำเร็จ' };
}

function me_deleteReport(id) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.MAGIC_EYE);
  const row = _findRowById(sh, id);
  if (row < 0) return { success: false, message: 'ไม่พบรายการ' };
  // คืนคะแนน
  const reporterId = sh.getRange(row, 6).getValue();
  const offenderId = sh.getRange(row, 3).getValue();
  if (reporterId) adjustStudentPoints(reporterId, -1);
  if (offenderId) adjustStudentPoints(offenderId, 1);
  sh.deleteRow(row);
  return { success: true, message: 'ลบสำเร็จ' };
}


// ===================================================================
// 🕒 LATE - ระบบบันทึกการมาสาย
// ===================================================================
function lt_getRecords() {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.LATE);
  return _sheetToObjects(sh).map(function(r) {
    return {
      id: r.ID,
      date: r['วันที่'] instanceof Date ? Utilities.formatDate(r['วันที่'], Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm') : r['วันที่'],
      studentId: r.StudentID,
      studentName: r['ชื่อ-นามสกุล'],
      classLevel: r['ชั้น'],
      reason: r['เหตุผล'],
      action: r['มาตรการ'],
      points: Number(r['คะแนน']) || 0,
      recorder: r['ผู้บันทึก'],
      status: r['สถานะ'] || 'approved',
      timestamp: r.Timestamp
    };
  });
}

function lt_getPending() {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.LATE_PENDING);
  return _sheetToObjects(sh).map(function(r) {
    return {
      id: r.ID,
      date: r['วันที่'] instanceof Date ? Utilities.formatDate(r['วันที่'], Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm') : r['วันที่'],
      studentId: r.StudentID,
      studentName: r['ชื่อ-นามสกุล'],
      classLevel: r['ชั้น'],
      reason: r['เหตุผล'],
      action: r['มาตรการ'],
      points: Number(r['คะแนน']) || 0,
      recorder: r['ผู้บันทึก'],
      timestamp: r.Timestamp
    };
  });
}

function lt_addPending(data) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.LATE_PENDING);
  const id = _genId();
  sh.appendRow([
    id,
    new Date(),
    data.studentId || '',
    data.studentName || '',
    data.classLevel || '',
    data.reason || '',
    data.action || '',
    Number(data.points) || 0,
    data.recorder || '',
    new Date()
  ]);
  return { success: true, id: id, message: 'ส่งข้อมูลรอตรวจทาน' };
}

function lt_approve(id) {
  initSheets();
  const pendingSh = SS.getSheetByName(SHEETS.LATE_PENDING);
  const lateSh = SS.getSheetByName(SHEETS.LATE);
  const row = _findRowById(pendingSh, id);
  if (row < 0) return { success: false, message: 'ไม่พบรายการ' };
  const data = pendingSh.getRange(row, 1, 1, HEADERS.LatePending.length).getValues()[0];
  // คัดลอกไป Late + เพิ่มสถานะ
  lateSh.appendRow([
    _genId(),
    data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8],
    'approved',
    new Date()
  ]);
  // หักคะแนน
  if (data[2]) adjustStudentPoints(data[2], -Number(data[7] || 0));
  pendingSh.deleteRow(row);
  return { success: true, message: 'อนุมัติสำเร็จ' };
}

function lt_approveAll() {
  initSheets();
  const pendingSh = SS.getSheetByName(SHEETS.LATE_PENDING);
  const lateSh = SS.getSheetByName(SHEETS.LATE);
  const all = pendingSh.getDataRange().getValues();
  let count = 0;
  if (all.length <= 1) return { success: true, count: 0 };
  const newRows = [];
  for (let i = 1; i < all.length; i++) {
    const d = all[i];
    newRows.push([
      _genId(),
      d[1], d[2], d[3], d[4], d[5], d[6], d[7], d[8],
      'approved',
      new Date()
    ]);
    if (d[2]) adjustStudentPoints(d[2], -Number(d[7] || 0));
    count++;
  }
  if (newRows.length > 0) {
    lateSh.getRange(lateSh.getLastRow() + 1, 1, newRows.length, newRows[0].length).setValues(newRows);
  }
  if (pendingSh.getLastRow() > 1) pendingSh.deleteRows(2, pendingSh.getLastRow() - 1);
  return { success: true, count: count, message: 'อนุมัติทั้งหมด ' + count + ' รายการ' };
}

function lt_rejectPending(id) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.LATE_PENDING);
  const row = _findRowById(sh, id);
  if (row < 0) return { success: false, message: 'ไม่พบรายการ' };
  sh.deleteRow(row);
  return { success: true, message: 'ลบรายการสำเร็จ' };
}

function lt_deleteRecord(id) {
  initSheets();
  const sh = SS.getSheetByName(SHEETS.LATE);
  const row = _findRowById(sh, id);
  if (row < 0) return { success: false, message: 'ไม่พบรายการ' };
  // คืนคะแนน
  const points = Number(sh.getRange(row, 8).getValue()) || 0;
  const sid = sh.getRange(row, 3).getValue();
  if (sid) adjustStudentPoints(sid, points);
  sh.deleteRow(row);
  return { success: true, message: 'ลบสำเร็จ' };
}


// ===================================================================
// 📊 REPORTS - รายงานรวม
// ===================================================================
function getReportData(systemType) {
  initSheets();
  switch (systemType) {
    case 'lostfound':  return { records: lf_getRecords(),    students: getStudents() };
    case 'conduct':    return { records: cd_getRecords(),    students: getStudents() };
    case 'attendance': return { records: at_getRecords(),    students: getStudents() };
    case 'magiceye':   return { reports: me_getReports(),    students: getStudents() };
    case 'late':       return { records: lt_getRecords(), pending: lt_getPending(), students: getStudents() };
    default:           return { students: getStudents(), settings: getSettings() };
  }
}

function getAllInitialData(systemType) {
  initSheets();
  const result = {
    settings: getSettings(),
    students: getStudents(),
    webAppUrl: ScriptApp.getService().getUrl()
  };
  if (systemType === 'lostfound')   result.records = lf_getRecords();
  if (systemType === 'conduct')     result.records = cd_getRecords();
  if (systemType === 'attendance')  result.records = at_getRecords();
  if (systemType === 'magiceye')    result.reports = me_getReports();
  if (systemType === 'late')      { result.records = lt_getRecords(); result.pending = lt_getPending(); }
  return result;
}


// ===================================================================
// 💾 BACKUP & RESTORE
// ===================================================================
function backupAllData() {
  initSheets();
  return {
    timestamp: new Date().toISOString(),
    settings: getSettings(),
    students: getStudents(),
    lostFound: lf_getRecords(),
    conduct: cd_getRecords(),
    attendance: at_getRecords(),
    magicEye: me_getReports(),
    late: lt_getRecords(),
    latePending: lt_getPending()
  };
}

function importBackupData(json) {
  initSheets();
  let data = typeof json === 'string' ? JSON.parse(json) : json;
  clearAllData();

  // restore settings
  if (data.settings) saveSettings(data.settings);

  // restore students
  if (data.students && data.students.length > 0) {
    const sh = SS.getSheetByName(SHEETS.STUDENTS);
    const rows = data.students.map(function(s) {
      return [
        s.id || _genId(),
        s.classLevel || '',
        s.no || '',
        s.title || '',
        s.firstName || '',
        s.lastName || '',
        s.points || 100,
        s.addedAt || new Date()
      ];
    });
    sh.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
  }

  return { success: true, message: 'นำเข้าข้อมูลสำเร็จ' };
}

function clearAllData() {
  initSheets();
  const sheetsToClear = [
    SHEETS.STUDENTS, SHEETS.LOST_FOUND, SHEETS.CONDUCT,
    SHEETS.ATTENDANCE, SHEETS.MAGIC_EYE, SHEETS.LATE, SHEETS.LATE_PENDING
  ];
  sheetsToClear.forEach(function(name) {
    const sh = SS.getSheetByName(name);
    if (sh && sh.getLastRow() > 1) {
      sh.deleteRows(2, sh.getLastRow() - 1);
    }
  });
  return { success: true, message: 'ล้างข้อมูลทั้งหมดสำเร็จ' };
}


// ===================================================================
// 📸 อัปโหลดรูปขึ้น Drive (สำหรับโลโก้/ลายเซ็น/หลักฐาน)
// ===================================================================
function uploadImageToDrive(base64Data, fileName) {
  try {
    // หา/สร้างโฟลเดอร์
    let folder;
    const folders = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(DRIVE_FOLDER_NAME);
    }

    // ตัด data URI prefix ออกถ้ามี
    let cleanData = base64Data;
    let mimeType = 'image/jpeg';
    const match = base64Data.match(/^data:(image\/\w+);base64,(.+)$/);
    if (match) {
      mimeType = match[1];
      cleanData = match[2];
    }

    const decoded = Utilities.base64Decode(cleanData);
    const blob = Utilities.newBlob(decoded, mimeType, fileName || ('image_' + new Date().getTime() + '.jpg'));
    const file = folder.createFile(blob);

    // ตั้งสิทธิ์ให้ดูได้
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

    const fileId = file.getId();
    return {
      success: true,
      url: 'https://drive.google.com/uc?export=view&id=' + fileId,
      fileId: fileId
    };
  } catch (err) {
    return { success: false, message: err.toString() };
  }
}
