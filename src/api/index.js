const api = {
  Login: '/auth/login',
  Logout: '/auth/logout',
  ForgePassword: '/auth/forge-password',
  Register: '/auth/register',
  twoStepCode: '/auth/2step-code',
  SendSms: '/account/sms',
  SendSmsErr: '/account/sms_err',
  Settings: '/admin/api/rest/settings',
  Staff: '/admin/api/rest/staffs',

  TransferRecord: '/admin/api/rest/transfer_records',
  // get my info
  UserInfo: '/user/info'
}
export default api
