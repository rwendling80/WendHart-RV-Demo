insert into storage.buckets (id, name, public)
values ('unit-photos', 'unit-photos', true)
on conflict (id) do nothing;

create policy "public can read unit-photos"
on storage.objects for select
using (bucket_id = 'unit-photos');
