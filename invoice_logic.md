
**Post** to `invoice_module/`

type_request = create-collection

- Request Body

```json
{
    "company_id": "<company_id>"
}
```
- Response 200

```json
{
    {
        "message": "Collections created successfully"
    }
}
```
- Response 204

```json
{
  "message": "There are no onboarded candidates with this company id",
  "response": {
    "isSuccess": true,
    "data": []
  }
}
```
- Response 400

```json
{
  "message": "Failed to fetch onboarded candidates",
  "response": {
    "isSuccess": false,
    "error": "<error_message>"
  }
}
```
- Response 400

```json
{
  "message": "Company ID is required"
}
```



**Post** to `invoice_module/`

type_request = save-payment-records

- Request Body

```json
{
    "username": "<username>",
    "weekly_payment_amount": "<amount>",
    "currency": "<currency>"
}
```
- Response 200

```json
{
  "message": "Record saved successfully"
}
```
- Response 400

```json
{
  "message": "Username, weekly_payment_amount, and currency are required"
}
```

- Response 400

```json
{
  "message": "Record already saved"
}
```


**Post** to `invoice_module/`

type_request = update-payment-records

- Request Body

```json
{
    "username": "<username>",
    "weekly_payment_amount": "<amount>",
    "currency": "<currency>"
}
```

- Response 200

```json
{
  "message": "Record updated successfully"
}
```

- Response 404

```json
{
  "message": "Data does not exist, you need to save first"
}
```

- Response 400

```json
{
  "message": "Username, weekly_payment_amount, and currency are required"
}
```




