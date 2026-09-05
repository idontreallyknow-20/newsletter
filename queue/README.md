# Queued issues

One file per send day, named by the Toronto date the issue goes out:

- `YYYY-MM-DD.en.json` (required)
- `YYYY-MM-DD.zh.json` (optional, Chinese edition)

Shape:

```json
{ "subject": "Short subject line", "bodyMarkdown": "Markdown body without a SUBJECT line" }
```

The 5 AM job reads today's file straight from GitHub, previews it to the owner, and the 7 AM job sends it. Files stay here as a record. Anything committed to this folder is public, which is fine since the issue is public at 7 AM anyway.
