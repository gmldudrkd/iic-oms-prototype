/* eslint-disable */
export interface SmsSendRequest {
  REQ_SYS?: string;
  rcontents?: MessagePayload;
  rid?: string;
}

export interface MessagePayload {
  contents?: string;
  send_name?: string;
  send_tel?: string;
}

export interface SmsSendResponse {
  result?: Result;
}

export interface Result {
  /** @format int64 */
  code?: number;
  msg?: string;
}

export interface LmsSendRequest {
  REQ_SYS?: string;
  rcontents?: LmsMessagePayload;
  rid?: string;
}

export interface LmsMessagePayload {
  contents?: string;
  send_name?: string;
  send_tel?: string;
  subject?: string;
}

export interface LmsSendResponse {
  result?: Result;
}

export interface KakaoSendOneRequest {
  param?: Record<string, string>;
  rbtn?: KakaoButton[];
  rcv?: string;
  rcvnm?: string;
  rid?: string;
  templateCode?: string;
}

export interface KakaoButton {
  u1?: string;
  u2?: string;
  n?: string;
  t?: string;
  tg?: string;
}

export interface KakaoSendResponse {
  receiptNum?: string;
}

export interface KakaoSendBulkRequest {
  buttons?: KakaoButton[];
  revList?: Receiver[];
  rid?: string;
  templateCode?: string;
}

export interface Receiver {
  param?: Record<string, string>;
  rcv?: string;
  rcvnm?: string;
}
