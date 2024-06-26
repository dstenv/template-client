export enum ResultMsg {
  /** 成功 */
  '成功' = 200,
  /** 系统异常 */
  '系统异常' = 500,
  /** 参数异常 */
  '参数异常' = 501,
  /** 用户已存在 */
  '用户已存在' = 502,
  /** 账号或密码错误 */
  '账号错误' = 503,
  '密码错误' = 504,
  /** 未找到用户 */
  '未找到用户' = 505,
  /** 修改失败 */
  '修改失败' = 600,
  '未登录' = 401,
  /** 刷新token状态码 */
  '刷新token' = 410,
}

export enum STATUS_CODE {
  /** 成功 */
  SUCCESS = 200,
  /** 客户端错误 */
  CLIENT_ERROR = 400,
  /** 未登录 */
  INVALID_TOKEN = 401,
  /** 刷新token */
  REFRESH_TOKEN = 410,
  /** 未找到资源 */
  NOT_FOUND = 404,
  /** 系统异常 */
  ERROR = 500,
  /** 参数异常 */
  PARAM_ERROR = 501,
  /** 用户已存在 */
  USER_EXIST_ERROR = 502,
  /** 账号或密码错误 */
  USER_ACCOUNT_ERROR = 503,
  USER_PASSWORD_ERROR = 504,
  /** 未找到用户 */
  USER_NOT_EXIST_ERROR = 505,
  /** 修改失败 */
  USER_UPDATE_ERROR = 600,
}
