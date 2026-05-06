// SMS service — Aliyun 号码认证服务 (Dypnsapi)
// Falls back to console.log when credentials are not configured.

let DypnsapiClient, OpenApi;
function loadSdk() {
  if (!DypnsapiClient) {
    try {
      DypnsapiClient = require('@alicloud/dypnsapi20170525').default;
      OpenApi = require('@alicloud/openapi-client');
    } catch (_) {
      // dev mode
    }
  }
}

const CONFIG = {
  accessKeyId:     process.env.ALIYUN_AK_ID || process.env.ALIYUN_SMS_AK_ID || '',
  accessKeySecret: process.env.ALIYUN_AK_SECRET || process.env.ALIYUN_SMS_AK_SECRET || '',
  signName:        process.env.ALIYUN_SMS_SIGN || '速通互联验证码',
  templateCode:    process.env.ALIYUN_SMS_TEMPLATE || '100001',
  regionId:        process.env.ALIYUN_SMS_REGION || 'cn-hangzhou',
  testPhone:       process.env.ALIYUN_SMS_TEST_PHONE || '',
};

const enabled = !!(CONFIG.accessKeyId && CONFIG.accessKeySecret);

let client = null;
function getClient() {
  if (client) return client;
  if (!enabled) return null;
  loadSdk();
  if (!DypnsapiClient) return null;
  const apiConfig = new OpenApi.Config({
    accessKeyId: CONFIG.accessKeyId,
    accessKeySecret: CONFIG.accessKeySecret,
  });
  apiConfig.endpoint = process.env.ALIYUN_SMS_ENDPOINT || 'dypnsapi.aliyuncs.com';
  client = new DypnsapiClient(apiConfig);
  return client;
}

/**
 * Send SMS verification code via Aliyun Dypnsapi.
 * @param {string} phone
 * @param {string} code  6-digit code (only used in dev mode; in prod the API generates it)
 * @returns {Promise<{ok: boolean, message: string, code?: string}>}
 */
async function sendSms(phone, code) {
  // Dev mode — no real SMS
  if (!enabled) {
    console.log(`[SMS] (dev) ${phone} → ${code}`);
    return { ok: true, message: '验证码已发送（开发模式）', code };
  }

  const c = getClient();
  if (!c) {
    console.log(`[SMS] (dev/fallback) ${phone} → ${code}`);
    return { ok: true, message: '验证码已发送（开发模式）', code };
  }

  try {
    const req = new (require('@alicloud/dypnsapi20170525').SendSmsVerifyCodeRequest)();
    req.phoneNumber = phone;
    req.signName = CONFIG.signName;
    req.templateCode = CONFIG.templateCode;
    req.templateParam = JSON.stringify({ code: '##code##', min: '5' });
    req.returnVerifyCode = true;  // return the generated code so we can store it
    req.codeLength = 6;
    req.validTime = 300;

    const resp = await c.sendSmsVerifyCode(req);

    if (resp.body.code === 'OK') {
      const sentCode = resp.body.model.verifyCode;
      console.log(`[SMS] ✓ ${phone} → ${sentCode}`);
      return { ok: true, message: '验证码已发送', code: sentCode };
    }

    console.error(`[SMS] ✗ ${phone} → ${resp.body.code}: ${resp.body.message}`);
    return { ok: false, message: `短信发送失败: ${resp.body.message}` };
  } catch (err) {
    console.error('[SMS] error:', err.message);
    return { ok: false, message: '短信发送异常，请稍后重试' };
  }
}

module.exports = { sendSms, CONFIG };
