from django.db import migrations, models

# Hardcoded rather than imported from snippets.device: a migration must keep
# working even if that module later changes. Kept in sync with LEGACY_DEVICE_ID.
LEGACY_DEVICE_ID = '00000000-0000-4000-8000-000000000001'


def assign_legacy_device(apps, schema_editor):
    """Carry account-owned snippets over to a single placeholder device.

    Runs while `favorited_by` still exists (the RemoveField operations come
    after this one), so the old many-to-many can be collapsed into the new
    boolean without losing which snippets were starred.
    """
    CodeSnippet = apps.get_model('snippets', 'CodeSnippet')
    for snippet in CodeSnippet.objects.all():
        snippet.device_id = LEGACY_DEVICE_ID
        snippet.is_favorited = snippet.favorited_by.exists()
        snippet.save(update_fields=['device_id', 'is_favorited'])


class Migration(migrations.Migration):
    """Drops user ownership in favour of a per-browser device token.

    Not reversible: `owner` was a non-null FK and the migration discards which
    user each row belonged to, so there is nothing to restore it from.
    """

    dependencies = [
        ('snippets', '0003_remove_codesnippet_is_public'),
    ]

    operations = [
        # 1. Add the new columns with defaults so existing rows stay valid.
        migrations.AddField(
            model_name='codesnippet',
            name='device_id',
            field=models.CharField(db_index=True, default='', max_length=64),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='codesnippet',
            name='is_favorited',
            field=models.BooleanField(default=False),
        ),
        # 2. Backfill before the old columns disappear.
        migrations.RunPython(assign_legacy_device, migrations.RunPython.noop),
        # 3. Now the account-based ownership can go.
        migrations.RemoveField(model_name='codesnippet', name='owner'),
        migrations.RemoveField(model_name='codesnippet', name='favorited_by'),
        migrations.AddIndex(
            model_name='codesnippet',
            index=models.Index(
                fields=['device_id', '-created_at'],
                name='snippets_co_device__0f3a1c_idx',
            ),
        ),
    ]
