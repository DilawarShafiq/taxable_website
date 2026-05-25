-- Performance indexes
create index idx_cases_client_id on cases(client_id);
create index idx_cases_assigned_staff_id on cases(assigned_staff_id);
create index idx_cases_status on cases(status);
create index idx_cases_jurisdiction on cases(jurisdiction);
create index idx_documents_case_id on documents(case_id);
create index idx_documents_client_id on documents(client_id);
create index idx_messages_case_id on messages(case_id);
create index idx_messages_created_at on messages(created_at desc);
create index idx_appointments_client_id on appointments(client_id);
create index idx_appointments_staff_id on appointments(staff_id);
create index idx_appointments_starts_at on appointments(starts_at);
create index idx_invoices_client_id on invoices(client_id);
create index idx_invoices_status on invoices(status);
create index idx_asset_cache_symbol on asset_cache(symbol, time_range);
create index idx_audit_log_actor on audit_log(actor_id);
create index idx_audit_log_created_at on audit_log(created_at desc);
create index idx_leads_created_at on leads(created_at desc);
