# Queued issues

One file per send day, named by the Toronto date the issue goes out:

- `YYYY-MM-DD.en.json` (required)
- `YYYY-MM-DD.zh.json` (optional, Chinese edition)

Shape:

```json
{ "subject": "Short subject line", "bodyMarkdown": "Markdown body without a SUBJECT line" }
```

## Which branch

Commit these to the **`queue`** branch, not `main`. `vercel.json` only deploys `main`, so
writing here every night would fire a pointless production redeploy and put a deploy on the
critical path of the morning send. The 5 AM job checks `queue` first and falls back to `main`,
so a hand-committed file on either branch works.

The job fetches the file straight from `raw.githubusercontent.com`, stamps it with the day,
previews it to the owner with a Skip link, and the 7 AM job sends it. Files stay here as a
record. Anything committed is public, which is fine: the issue is public at 7 AM anyway.
