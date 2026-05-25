/**
 * ===================================================================
 * 🌐 API Client - Bridge between GitHub Pages and Google Apps Script
 * ===================================================================
 * ทำหน้าที่เรียก Apps Script API แทน google.script.run
 *
 * วิธีใช้ - แทนที่:
 *   google.script.run.withSuccessHandler(fn).withFailureHandler(fn2).action(args);
 *
 * เป็น:
 *   GAS.call('action', payload).then(fn).catch(fn2);
 *
 * รองรับ POST (สำหรับข้อมูลใหญ่) และ JSONP fallback (CORS-safe)
 * ===================================================================
 */

const GAS = (function() {
  // ⚠️ แก้ URL ตรงนี้ให้เป็น Web App URL ของคุณเอง
  const API_URL = 'https://script.google.com/macros/s/AKfycbzEI-BXDIOhO4FPIzPOcYGyHaVaNdH-dE4yDuL0I7fjGzJW7puGk2cbh_iBhn8Aq9sk-w/exec';

  /**
   * เรียก API ผ่าน POST (ใช้สำหรับงานทั่วไป)
   * @param {string} action - ชื่อ action ใน Code.gs dispatch
   * @param {object} payload - ข้อมูลที่จะส่ง
   * @returns {Promise<any>} - ข้อมูลที่ Apps Script ส่งกลับ
   */
  function call(action, payload) {
    payload = payload || {};
    return fetch(API_URL, {
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      // ใช้ text/plain เพื่อหลีกเลี่ยง CORS preflight (Apps Script ไม่รองรับ OPTIONS)
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: action, payload: payload })
    })
    .then(function(res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(function(result) {
      if (!result.ok) throw new Error(result.error || 'API error');
      return result.data;
    });
  }

  /**
   * เรียก API ผ่าน JSONP (สำหรับ fallback กรณี CORS error)
   * @param {string} action
   * @param {object} payload
   * @returns {Promise<any>}
   */
  function callJSONP(action, payload) {
    return new Promise(function(resolve, reject) {
      const cb = 'gas_cb_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8);
      const script = document.createElement('script');
      const timer = setTimeout(function() {
        cleanup();
        reject(new Error('JSONP timeout'));
      }, 60000);

      function cleanup() {
        clearTimeout(timer);
        delete window[cb];
        if (script.parentNode) script.parentNode.removeChild(script);
      }

      window[cb] = function(result) {
        cleanup();
        if (!result.ok) reject(new Error(result.error || 'API error'));
        else resolve(result.data);
      };

      const params = new URLSearchParams({
        action: action,
        callback: cb,
        payload: JSON.stringify(payload || {})
      });
      script.src = API_URL + '?' + params.toString();
      script.onerror = function() { cleanup(); reject(new Error('JSONP load failed')); };
      document.body.appendChild(script);
    });
  }

  /**
   * Smart call - ลอง POST ก่อน ถ้าล้มเหลวจาก CORS ใช้ JSONP
   * แต่ JSONP มีข้อจำกัด URL length (~8000 chars) จึงใช้ได้แค่กับ payload เล็ก
   */
  function smartCall(action, payload) {
    return call(action, payload).catch(function(err) {
      console.warn('POST failed, fallback to JSONP:', err.message);
      const payloadStr = JSON.stringify(payload || {});
      if (payloadStr.length > 6000) {
        throw new Error('Payload ใหญ่เกินไป กรุณาตรวจสอบการตั้งค่า CORS ของ Apps Script');
      }
      return callJSONP(action, payload);
    });
  }

  return {
    URL: API_URL,
    call: call,
    callJSONP: callJSONP,
    smartCall: smartCall
  };
})();
