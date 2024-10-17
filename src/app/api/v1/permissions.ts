import { MemberRole } from "@/app/api/v1/data";

export const PERMISSIONS = {
  ADD_CARD: [MemberRole.Admin],
  ADD_POLICY: [MemberRole.Admin, MemberRole.Assistant],
  ADD_NOTE: [MemberRole.Admin, MemberRole.Assistant, MemberRole.Member],
  SHOW_TRANSACTIONS: [
    MemberRole.Admin,
    MemberRole.Assistant,
    MemberRole.Member,
  ],
  SET_PIN: [MemberRole.Admin, MemberRole.Assistant, MemberRole.Member],
  APPROVE_TRANSACTION: [MemberRole.Admin, MemberRole.Assistant],
  READ_MSA: [MemberRole.Admin],
};
