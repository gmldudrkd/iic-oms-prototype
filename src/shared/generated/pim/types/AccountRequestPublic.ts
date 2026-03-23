/* eslint-disable */
export interface CreateAccountRequestDTO {
  email: string;
  /**
   * @minLength 0
   * @maxLength 50
   */
  reason: string;
}
