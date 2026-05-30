-- AI Chat Session History
-- Stores multi-session conversation history for the client AI assistant

create table if not exists ai_chat_sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  title text,
  agent_type text default 'general',
  jurisdictions text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  message_count int default 0
);

create table if not exists ai_chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references ai_chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  thinking text,
  agent_type text,
  files text[],
  created_at timestamptz default now()
);

create index if not exists ai_chat_sessions_profile_idx on ai_chat_sessions(profile_id, updated_at desc);
create index if not exists ai_chat_messages_session_idx on ai_chat_messages(session_id, created_at asc);

-- Auto-update session updated_at on new messages
create or replace function update_chat_session_on_message()
returns trigger language plpgsql as $$
begin
  update ai_chat_sessions
  set updated_at = now(),
      message_count = message_count + 1,
      title = case
        when title is null and new.role = 'user' then left(new.content, 80)
        else title
      end
  where id = new.session_id;
  return new;
end;
$$;

drop trigger if exists on_ai_chat_message_insert on ai_chat_messages;
create trigger on_ai_chat_message_insert
  after insert on ai_chat_messages
  for each row execute function update_chat_session_on_message();
