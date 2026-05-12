# Razorpay Integration – NeuralNexus

## FSM Diagram

```
POST /api/razorpay/order
         │
         ▼
     INITIATED ──── webhook: payment.failed ────▶ FAILED
         │
    webhook: payment.captured
         │
         ▼
      SUCCESS
```

State is stored in `payments.status`. Only forward transitions are allowed — the webhook
handler guards each update with `.eq('status', 'INITIATED')` so a successful webhook can
never overwrite a FAILED row or vice-versa.

---

## Endpoints

### `POST /api/razorpay/order`

Creates a Razorpay order and records an `INITIATED` payment row.

**Auth**: Requires logged-in session (returns `401` otherwise).

**Request body**
```json
{ "amount": 500 }    // INR, integer
```

**Response**
```json
{
  "order_id": "order_xxx",
  "amount": 50000,      // paise
  "currency": "INR",
  "receipt": "nn_abc12345_1715512345678"
}
```

**Error responses**
| Status | Reason |
|--------|--------|
| 400 | Missing / invalid amount |
| 401 | Not logged in |
| 500 | Razorpay API or DB error |

---

### `POST /api/razorpay/webhook`

Receives Razorpay webhook events, verifies HMAC-SHA256 signature, and transitions the FSM.

**Auth**: Verified via `x-razorpay-signature` header (no user session needed).

**Handled events**
| Event | FSM Transition |
|-------|---------------|
| `payment.captured` | `INITIATED → SUCCESS`, stores `razorpay_payment_id` |
| `payment.failed` | `INITIATED → FAILED` |
| anything else | Acknowledged, no DB change |

> Always returns `200 { received: true }` after signature validation succeeds —
> Razorpay retries on non-2xx.

**Webhook URL to register in Razorpay dashboard (test mode)**
```
https://<your-domain>/api/razorpay/webhook
```

---

## Front-End States (`PayButton` component)

| State | Trigger | UI |
|-------|---------|-----|
| `idle` | Initial | "💳 Pay ₹500" button |
| `pending` | After click, awaiting order / modal open | Spinner + "Opening payment…" |
| `success` | `handler` callback from Razorpay modal | Green success banner |
| `failed` | Modal dismissed / network error | Red banner + "Try again" link |

> The webhook is the **ground truth** for the DB. The UI optimistically shows `success`
> on `handler` callback; if the webhook later marks the row `FAILED`, the DB is correct
> even if the UI already showed success (edge case only in test mode).

---

## Environment Variables

| Variable | Scope | Description |
|----------|-------|-------------|
| `RAZORPAY_KEY_ID` | Server | Test/Live key ID from Razorpay dashboard |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Browser | Same value — needed by `checkout.js` |
| `RAZORPAY_KEY_SECRET` | Server | Secret key — never expose to browser |
| `RAZORPAY_WEBHOOK_SECRET` | Server | Webhook secret set in Razorpay dashboard |

---

## Test-Mode Checklist

1. Replace placeholder keys in `.env.local` with real test keys from [dashboard.razorpay.com](https://dashboard.razorpay.com).
2. Register `POST /api/razorpay/webhook` in **Razorpay → Settings → Webhooks** (use `ngrok` or similar for local dev).
3. Set **Active Events**: `payment.captured`, `payment.failed`.
4. Use [Razorpay test cards](https://razorpay.com/docs/payments/payments/test-card-details/) to simulate success and failure.
5. Check `payments` table in Supabase to confirm FSM transitions.

---

## Admin / Judge Access Control

`/dashboard/admin` and `/dashboard/judge` routes are protected in middleware:

1. User must be **logged in** — unauthenticated visitors are redirected to `/auth?next=<path>`.
2. User's `profiles.role` must be `ADMIN` or `JUDGE` respectively — any other role is redirected to `/dashboard`.

**To grant access**: update the user's row in the `profiles` table:
```sql
update profiles set role = 'ADMIN' where email = 'admin@yourdomain.com';
update profiles set role = 'JUDGE' where email = 'judge@yourdomain.com';
```

All other users default to `role = 'USER'`.
