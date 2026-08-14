-- ============================================================================
-- FITS YOU — split SMS consent into service vs. marketing (TCPA evidence)
-- ============================================================================
-- The opt-in forms (subscribe popup + Plan Builder) now present TWO separate,
-- unchecked SMS boxes:
--   1. consent_sms           — express consent for recurring automated SERVICE
--                              updates and account notifications (existing column,
--                              semantics narrowed to transactional/service).
--   2. consent_sms_marketing — separate consent for MARKETING communications
--                              and promotions (new).
-- Each carries its own timestamp so the two consents can be evidenced and
-- revoked independently. Additive only — existing rows keep consent_sms as-is
-- and default to false for marketing (no prior marketing consent is implied).
-- ============================================================================

alter table public.subscribers
  add column if not exists consent_sms_marketing    boolean not null default false,
  add column if not exists sms_marketing_consent_at timestamptz;

alter table public.intake
  add column if not exists consent_sms_marketing    boolean not null default false,
  add column if not exists sms_marketing_consent_at timestamptz;
