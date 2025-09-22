# Carmen API Reference (Swagger Summary)

## Base URL
```
https://carmen-api.semapru.com/api
```

## Required Headers
```http
Authorization: Bearer <access_token>   # (where required)
Content-Type: application/json
x-tenant-id: <tenant_uuid>             # (if multi-tenant)
```

All endpoints require the query parameter `version=latest`.

---

## Authentication

### Login
- **POST** `/api/auth/login?version=latest`
- **Description:** Login to the application
- **Request Body:**
```json
{
  "email": "test@test.com",
  "password": "123456"
}
```
- **Response:**
```json
{
  "access_token": "<jwt_token>",
  "refresh_token": "<refresh_token>"
}
```
- **Error Response:**
```json
{
  "status": 401,
  "message": "Invalid login credentials"
}
```

### Logout
- **POST** `/api/auth/logout?version=latest`
- **Description:** Logout from the application
- **Headers:** Requires `Authorization` and `x-tenant-id`
- **Response:**
```json
{
  "response": {
    "status": 200,
    "message": "Logout successful"
  }
}
```

---

## Business Units

### Set Default Tenant
- **POST** `/api/business-unit/default?version=latest`
- **Headers:**
  - `x-tenant-id: <tenant_uuid>` (required)
  - `Authorization: Bearer <access_token>`
- **Description:** Set the default tenant for the session
- **Response:**
```json
{
  "status": 200,
  "message": "Default tenant set successfully"
}
```

---

## General Notes
- All endpoints require `version=latest` as a query parameter.
- Most endpoints require `Authorization` and `x-tenant-id` headers.
- Refer to the full Swagger at [https://carmen-api.semapru.com/swagger-json](https://carmen-api.semapru.com/swagger-json) for detailed schemas and additional endpoints. 