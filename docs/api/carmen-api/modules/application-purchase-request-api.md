### **Module: Application - Purchase Request**

This module is responsible for managing purchase requests (PRs). It covers the entire lifecycle of a PR, from creation and submission to updates and deletion.

-----

### 1\. Find All Purchase Requests

  * **GET** `/api/purchase-request`
  * **Summary:** Get all purchase requests
  * **Description:** Retrieves a paginated list of all purchase requests associated with the tenant.
  * **Security:** `bearer`
  * **Parameters:**

| Name | In | Required | Description | Schema |
| :--- | :--- | :--- | :--- | :--- |
| x-tenant-id | header | true | Tenant ID | `string` |
| version | query | false | API Version | `string` (default: "latest") |

  * **Responses:**
      * **200:** The purchase requests were successfully retrieved
      * **404:** The purchase requests were not found

-----

### 2\. Create a Purchase Request

  * **POST** `/api/purchase-request`
  * **Summary:** Create a purchase request
  * **Description:** Creates a new purchase request with detailed line items.
  * **Security:** `bearer`
  * **Parameters:**

| Name | In | Required | Description | Schema |
| :--- | :--- | :--- | :--- | :--- |
| x-tenant-id | header | true | Tenant ID | `string` |
| version | query | false | API Version | `string` (default: "latest") |

  * **Request Body:**
      * **Description:** Purchase request data
      * **Content-Type:** `application/json`
      * **Schema:** `CreatePurchaseRequestDto`
        ```json
        {
          "type": "object",
          "properties": {
            "pr_date": {},
            "description": {
              "type": "string",
              "nullable": true
            },
            "pr_status": {
              "type": "string",
              "enum": [ "draft", "pending", "approved", "rejected" ],
              "default": "draft"
            },
            "workflow_id": {
              "type": "string",
              "format": "uuid"
            },
            "current_workflow_status": {
              "type": "string"
            },
            "workflow_history": {
              "type": "array",
              "nullable": true,
              "items": {
                "type": "object",
                "required": [ "status", "timestamp", "user" ],
                "properties": {
                  "status": { "type": "string" },
                  "timestamp": {},
                  "user": { "type": "string" }
                }
              }
            },
            "department_id": {
              "type": "string",
              "format": "uuid"
            },
            "requestor_id": {
              "type": "string",
              "format": "uuid"
            },
            "note": {
              "type": "string",
              "nullable": true
            },
            "info": {
              "type": "object",
              "nullable": true,
              "required": [ "priority", "budget_code" ],
              "properties": {
                "priority": { "type": "string" },
                "budget_code": { "type": "string" }
              }
            },
            "dimension": {
              "type": "object",
              "nullable": true,
              "required": [ "cost_center", "project" ],
              "properties": {
                "cost_center": { "type": "string" },
                "project": { "type": "string" }
              }
            },
            "purchase_request_detail": {
              "type": "object",
              "properties": {
                "add": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "required": [ "pricelist_detail_id", "description", "product_id" ],
                    "properties": {
                      "pricelist_detail_id": { "type": "string", "format": "uuid", "nullable": true },
                      "description": { "type": "string", "nullable": true },
                      "product_id": { "type": "string", "format": "uuid" },
                      "product_name": { "type": "string" },
                      "requested_qty": { "type": "number" },
                      "location_id": { "type": "string", "format": "uuid" },
                      "vendor_id": { "type": "string", "format": "uuid" }
                    }
                  }
                }
              }
            }
          },
          "required": [ "pr_date", "description", "workflow_history", "note", "info", "dimension" ]
        }
        ```
      * **Example:**
        ```json
        {
          "pr_date": "2025-06-30T10:59:32Z",
          "description": "Purchase request for new office equipment",
          "workflow_id": "0090b76d-e4f4-415c-8a1b-4b4f06fc2ecb",
          "workflow_history": [
            {
              "status": "draft",
              "timestamp": "2025-06-30T10:59:32Z",
              "user": "user123"
            }
          ],
          "requestor_id": "123e4567-e89b-12d3-a456-426614174002",
          "department_id": "123e4567-e89b-12d3-a456-426614174003",
          "note": "Urgent request for Q3 budget.",
          "info": {
            "priority": "high",
            "budget_code": "BUD-2025-002"
          },
          "dimension": {
            "cost_center": "CC-002",
            "project": "Project Phoenix"
          },
          "purchase_request_detail": {
            "add": [
              {
                "location_id": "3ded4758-46f5-4995-bd0b-69f7ef464f92",
                "product_id": "0f9955f0-2f5b-437d-a787-7c79a043da38",
                "vendor_id": "82756e45-6354-4a6f-b3ee-c0b0a4ec6e61",
                "description": "Ergonomic Office Chairs",
                "requested_qty": 10
              }
            ]
          }
        }
        ```
  * **Responses:**
      * **201:** The purchase request was successfully created
      * **401:** Unauthorized
      * **404:** The purchase request was not found

-----

### 3\. Find a Single Purchase Request

  * **GET** `/api/purchase-request/{id}`
  * **Summary:** Get a purchase request by ID
  * **Description:** Retrieves a purchase request by its unique identifier.
  * **Security:** `bearer`
  * **Parameters:**

| Name | In | Required | Description | Schema |
| :--- | :--- | :--- | :--- | :--- |
| x-tenant-id | header | true | Tenant ID | `string` |
| id | path | true | The unique identifier of the purchase request. | `string` |
| version | query | false | API Version | `string` (default: "latest") |

  * **Responses:**
      * **200:** The purchase request was successfully retrieved
      * **404:** The purchase request was not found

-----

### 4\. Update a Purchase Request

  * **PUT** `/api/purchase-request/{id}`
  * **Summary:** Update a purchase request
  * **Description:** Updates an existing purchase request. Note that this is a `PUT` operation, which typically implies a full replacement of the resource.
  * **Security:** `bearer`
  * **Parameters:**

| Name | In | Required | Description | Schema |
| :--- | :--- | :--- | :--- | :--- |
| x-tenant-id | header | true | Tenant ID | `string` |
| id | path | true | The unique identifier of the purchase request. | `string` |
| version | query | false | API Version | `string` (default: "latest") |

  * **Request Body:**
      * **Content-Type:** `application/json`
      * **Schema:** `UpdatePurchaseRequestDto`
        ```json
        {
          "type": "object",
          "properties": {
            "pr_date": {},
            "description": { "type": "string", "nullable": true },
            "pr_status": { "type": "string", "enum": [ "draft", "pending", "approved", "rejected" ], "default": "draft" },
            "doc_version": { "type": "number" },
            "workflow_id": { "type": "string", "format": "uuid" },
            "current_workflow_status": { "type": "string" },
            "workflow_history": {
              "type": "array",
              "nullable": true,
              "items": {
                "type": "object",
                "required": [ "status", "timestamp", "user" ],
                "properties": { "status": { "type": "string" }, "timestamp": {}, "user": { "type": "string" } }
              }
            },
            "purchase_request_detail": {
              "type": "object",
              "properties": {
                "add": {
                  "type": "array",
                  "items": { /* Identical to CreatePurchaseRequestDto.purchase_request_detail.add */ }
                },
                "update": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "required": [ "id", "pricelist_detail_id", "description", "product_id" ],
                    "properties": {
                      "id": { "type": "string", "format": "uuid" },
                      "pricelist_detail_id": { "type": "string", "format": "uuid", "nullable": true },
                      "description": { "type": "string", "nullable": true },
                      "product_id": { "type": "string", "format": "uuid" },
                      "requested_qty": { "type": "number" }
                    }
                  }
                },
                "remove": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "required": [ "id" ],
                    "properties": { "id": { "type": "string", "format": "uuid" } }
                  }
                }
              }
            }
          },
          "required": [ "pr_date", "description", "doc_version", "workflow_history", "note", "info", "dimension" ]
        }
        ```
  * **Responses:**
      * **200:** The purchase request was successfully updated
      * **404:** The purchase request was not found

-----

### 5\. Delete a Purchase Request

  * **DELETE** `/api/purchase-request/{id}`
  * **Summary:** Delete a purchase request
  * **Description:** Deletes an existing purchase request.
  * **Security:** `bearer`
  * **Parameters:**

| Name | In | Required | Description | Schema |
| :--- | :--- | :--- | :--- | :--- |
| x-tenant-id | header | true | Tenant ID | `string` |
| id | path | true | The unique identifier of the purchase request. | `string` |
| version | query | false | API Version | `string` (default: "latest") |

  * **Responses:**
      * **200:** The purchase request was successfully deleted
      * **404:** The purchase request was not found

-----

### 6\. Submit a Purchase Request

  * **PATCH** `/api/purchase-request/{id}/submit`
  * **Summary:** Submit a purchase request
  * **Description:** Submits an existing purchase request, likely triggering a workflow.
  * **Security:** `bearer`
  * **Parameters:**

| Name | In | Required | Description | Schema |
| :--- | :--- | :--- | :--- | :--- |
| x-tenant-id | header | true | Tenant ID | `string` |
| id | path | true | The unique identifier of the purchase request. | `string` |
| version | query | false | API Version | `string` (default: "latest") |

  * **Responses:**
      * **200:** OK