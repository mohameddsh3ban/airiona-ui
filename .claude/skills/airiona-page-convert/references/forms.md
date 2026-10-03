# Forms and validation

Every Airiona form control works with Angular reactive forms (`formControlName`), `ngModel` and `[(value)]`. The scaffold builds a `FormGroup` from the spec and uses `shared/page-form.ts` to show messages and `shared/validators.ts` for rules Angular does not ship.

## Choosing the control

| The person… | Control |
|---|---|
| types free text (name, email, phone, passport, address) | `TextField` with `type`, `inputMode`, `autocomplete` |
| picks one of 2–3 options that are always visible | `MobileSegmented` (phone) or `SegmentedControl` |
| picks one of 4–12 options | `Select` (`searchable` above ~10) |
| picks one of many short options in a row (categories, filters) | `ChipScroller` |
| toggles a filter on and off | `Chip` |
| picks a date or a date range | `DatePicker` (`mode: range`, `variant: tiles` in booking search) |
| sees a month of availability inline | `Calendar` |
| counts guests, rooms, bags | `QuantityStepper` (several in a sheet behind a `FieldTile`) |
| agrees to terms, or turns on one optional thing in a form | `Checkbox` (`requiredTrue` for consent) |
| changes a setting that applies immediately | `Switch` (not inside a submit form unless it is part of the submission) |
| searches | `SearchField` |

## Rules per field

- **Visible label always.** Placeholders are examples, not labels.
- **Validators** (spec `validators[].type`): `required`, `requiredTrue`, `email`, `minLength`, `maxLength`, `min`, `max`, `pattern`, `phone`, `dateRange`, `futureDate`, `minAge`, `passport`, `postalCode`.
- **Messages say what to do**, in the person's words: "Enter your email so we can send the booking." not "Invalid input". One message per validator, keyed by the error (`minlength` for `minLength`, `required` for `requiredTrue`).
- **When to show errors:** after the field is left (touched) or on submit, never while typing the first characters. `page-form.ts` does this.
- **On submit:** mark all fields touched, show every message, move focus to the first invalid field and scroll it into view. `page-form.ts` does this; `check` verifies it on the phone.
- **Keyboard and autofill** for every `TextField`:

| Field | `type` | `inputMode` | `autocomplete` |
|---|---|---|---|
| Full name | text | text | `name` |
| Given / family name | text | text | `given-name` / `family-name` |
| Email | email | email | `email` |
| Phone | tel | tel | `tel` |
| Password (sign in) | password | | `current-password` |
| Password (sign up) | password | | `new-password` |
| Street address | text | | `address-line1` |
| City | text | | `address-level2` |
| Postal code | text | text | `postal-code` |
| Country | use `Select` | | `country-name` |
| One-time code | text | numeric | `one-time-code` |
| Passport number | text | text | `off` |

- **Lengths:** names `maxLength` 60–80; free text 500 unless the backend says otherwise. Put the same limits the server enforces.
- **Dates** are ISO strings (`2026-10-15`), never `Date` objects with times. Booking ranges use `dateRange` (both ends set, end after start) and usually `futureDate`. Birth dates use `minAge` where an age rule exists.
- **Cross-field rules** (confirm email, password confirmation): note them in `notes`; `shared/validators.ts` has `match(path, other)` for the group.
- **Payments:** never collect card or bank numbers in our forms. The payment step embeds the provider's UI (Stripe Elements, Adyen Drop-in); record it as a `GAP` element with the provider as the proposal. Lint errors on fields named like card, cvc, iban.
- **Passwords:** `TextField` with `type: "password"` has a built-in Show password button. Never block paste.

## Submit

- The button label is a verb with the outcome: "Pay $1,284", "Search flights", "Log in". `"submit": true` on that element.
- **Pending:** the button shows `loading` while the request runs (the scaffold binds it when the component has `loading`), and the form stays filled.
- **Success:** `burst` for the end of a booking (Dialog + SuccessBurst, one per flow), `toast` for small saves, `navigate` for multi-step flows.
- **Failure:** say it in `submit.failure`: usually a danger `Toast` with the server's message and the form kept as typed; field errors from the server map back onto the fields.

## Accessibility

- Messages render as `role="alert"` next to their field; the field itself carries `aria-invalid` (the components do this).
- Group related controls (traveller details, contact) in their own section with a heading.
- Keep tab order equal to visual order; the phone layout decides both.
