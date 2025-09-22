### **Module: Application - Good Received Note**

This module is responsible for managing Good Received Notes (GRNs), which are documents that acknowledge the receipt of goods. It covers the creation, retrieval, updating, and deletion of GRNs.

-----

### 1\. Find All Good Received Notes

  * **GET** `/api/good-received-note`
  * **Summary:** Retrieves a list of all good received notes.
  * **Description:** This endpoint fetches a paginated, searchable, and filterable list of all good received notes within the tenant's scope.
  * **Security:** `bearer`
  * **Parameters:**

| Name | In | Required | Description | Schema |
| :--- | :--- | :--- | :--- | :--- |
| x-tenant-id | header | true | Tenant ID | `string` |
| version | query | false | API Version | `string` (default: "latest") |
| page | query | false | Page number for pagination. | `number` (default: 1) |
| perpage | query | false | Number of items per page. | `number` (default: 10) |
| search | query | false | A general search term to apply across searchable fields. | `string` (default: "") |
| filter | query | false | Key-value pairs for filtering results. | `record<string, string>` (default: []) |
| searchfields | query | false | Specific fields to apply the search term to. | `array` of `string` (default: []) |
| sort | query | false | Fields to sort the results by. | `array` of `string` (default: []) |

  * **Responses:**
      * **200:** OK

-----

### 2\. Create a Good Received Note

  * **POST** `/api/good-received-note`
  * **Summary:** Creates a new good received note.
  * **Description:** This endpoint allows for the creation of a new good received note, including details about the received products and any associated extra costs.
  * **Security:** `bearer`
  * **Parameters:**

| Name | In | Required | Description | Schema |
| :--- | :--- | :--- | :--- | :--- |
| x-tenant-id | header | true | Tenant ID | `string` |
| version | query | false | API Version | `string` (default: "latest") |

  * **Request Body:**
      * **Content-Type:** `application/json`
      * **Schema:** `GoodReceivedNoteCreateDto`
        ```json
        {
          "type": "object",
          "properties": {
            "invoice_no": { "type": "string" },
            "invoice_date": {},
            "description": { "type": "string" },
            "doc_status": { "type": "string", "enum": ["draft", "complete", "void"] },
            "doc_type": { "type": "string", "enum": ["manual", "purchase_order"] },
            "is_consignment": { "type": "boolean" },
            "is_cash": { "type": "boolean" },
            "signature_image_url": { "type": "string" },
            "received_by_id": { "type": "string", "format": "uuid" },
            "received_by_name": { "type": "string" },
            "received_at": {},
            "credit_term_id": { "type": "string", "format": "uuid" },
            "credit_term_name": { "type": "string" },
            "credit_term_days": { "type": "integer" },
            "payment_due_date": {},
            "is_active": { "type": "boolean", "default": true },
            "grn_date": {},
            "expired_date": {},
            "vendor_id": { "type": "string", "format": "uuid" },
            "vendor_name": { "type": "string" },
            "currency_id": { "type": "string", "format": "uuid" },
            "currency_name": { "type": "string" },
            "exchange_rate": { "type": "number" },
            "exchange_rate_date": {},
            "workflow_id": { "type": "string", "format": "uuid" },
            "current_workflow_status": { "type": "string" },
            "workflow_history": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "status": { "type": "string" },
                  "timestamp": {},
                  "user": { "type": "string" }
                },
                "required": ["status", "timestamp", "user"]
              },
              "nullable": true
            },
            "note": { "type": "string", "nullable": true },
            "info": {
              "type": "object",
              "properties": { "priority": { "type": "string" }, "budget_code": { "type": "string" } },
              "required": ["priority", "budget_code"],
              "nullable": true
            },
            "dimension": {
              "type": "object",
              "properties": { "cost_center": { "type": "string" }, "project": { "type": "string" } },
              "required": ["cost_center", "project"],
              "nullable": true
            },
            "good_received_note_detail": {
              "type": "object",
              "properties": {
                "add": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "purchase_order_detail_id": { "type": "string", "format": "uuid" },
                      "product_id": { "type": "string", "format": "uuid" },
                      "product_name": { "type": "string" },
                      "price": { "type": "number" },
                      "total_price": { "type": "number" },
                      "location_id": { "type": "string", "format": "uuid" },
                      "location_name": { "type": "string" },
                      "received_qty": { "type": "number" },
                      "tax_type_inventory_id": { "type": "string", "format": "uuid" }
                    },
                    "required": ["product_id"]
                  }
                }
              }
            },
            "extra_cost": {
              "type": "object",
              "properties": {
                "name": { "type": "string" },
                "allocate_extracost_type": { "type": "string", "enum": ["manual", "by_value", "by_qty"] },
                "extra_cost_detail": {
                  "type": "object",
                  "properties": {
                    "add": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "extra_cost_type_id": { "type": "string", "format": "uuid" },
                          "amount": { "type": "number" },
                          "tax_type_inventory_id": { "type": "string", "format": "uuid" }
                        },
                        "required": ["extra_cost_type_id", "note", "info", "dimension"]
                      }
                    }
                  }
                }
              },
              "required": ["note", "info", "dimension"]
            }
          },
          "required": ["workflow_history", "note", "info", "dimension"]
        }
        ```
  * **Responses:**
      * **201:** Created

-----

### 3\. Find a Single Good Received Note

  * **GET** `/api/good-received-note/{id}`
  * **Summary:** Retrieves a single good received note by its ID.
  * **Description:** Fetches the complete details of a specific GRN using its unique identifier.
  * **Security:** `bearer`
  * **Parameters:**

| Name | In | Required | Description | Schema |
| :--- | :--- | :--- | :--- | :--- |
| x-tenant-id | header | true | Tenant ID | `string` |
| id | path | true | The unique identifier of the GRN. | `string` |
| version | query | false | API Version | `string` (default: "latest") |

  * **Responses:**
      * **200:** OK

-----

### 4\. Update a Good Received Note

  * **PATCH** `/api/good-received-note/{id}`
  * **Summary:** Updates an existing good received note.
  * **Description:** This endpoint allows for partial updates to a specific GRN, including its details and extra costs.
  * **Security:** `bearer`
  * **Parameters:**

| Name | In | Required | Description | Schema |
| :--- | :--- | :--- | :--- | :--- |
| x-tenant-id | header | true | Tenant ID | `string` |
| id | path | true | The unique identifier of the GRN. | `string` |
| version | query | false | API Version | `string` (default: "latest") |

  * **Request Body:**
      * **Content-Type:** `application/json`
      * **Schema:** `GoodReceivedNoteUpdateDto`
        ```json
        {
          "type": "object",
          "properties": {
            "name": { "type": "string" },
            "grn_no": { "type": "string" },
            "invoice_no": { "type": "string" },
            "invoice_f": {},
            "description": { "type": "string" },
            "doc_status": { "type": "string", "enum": ["draft", "complete", "void"] },
            "doc_type": { "type": "string", "enum": ["manual", "purchase_order"] },
            "vendor_id": { "type": "string", "format": "uuid" },
            "currency_id": { "type": "string", "format": "uuid" },
            "currency_rate": { "type": "number" },
            "workflow_id": { "type": "string", "format": "uuid" },
            "workflow_obj": {},
            "workflow_history": {},
            "current_workflow_status": { "type": "string" },
            "is_consignment": { "type": "boolean" },
            "is_cash": { "type": "boolean" },
            "signature_image_url": { "type": "string" },
            "received_by_id": { "type": "string", "format": "uuid" },
            "received_at": {},
            "credit_term_id": { "type": "string", "format": "uuid" },
            "payment_due_date": {},
            "is_active": { "type": "boolean" },
            "note": { "type": "string" },
            "info": {},
            "dimension": {},
            "good_received_note_detail": {
              "type": "object",
              "properties": {
                "add": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "purchase_order_detail_id": { "type": "string", "format": "uuid" },
                      "product_id": { "type": "string", "format": "uuid" },
                      "product_name": { "type": "string" },
                      "price": { "type": "number" }
                    },
                    "required": ["product_id"]
                  }
                },
                "update": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": { "type": "string", "format": "uuid" },
                      "good_received_note_id": { "type": "string", "format": "uuid" },
                      "product_id": { "type": "string", "format": "uuid" }
                    },
                    "required": ["id", "good_received_note_id", "product_id"]
                  }
                },
                "remove": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": { "id": { "type": "string", "format": "uuid" } },
                    "required": ["id"]
                  }
                }
              }
            },
            "extra_cost": {
              "type": "object",
              "properties": {
                "id": { "type": "string", "format": "uuid" },
                "name": { "type": "string" },
                "allocate_extracost_type": { "type": "string", "enum": ["manual", "by_value", "by_qty"] },
                "extra_cost_detail": {
                  "type": "object",
                  "properties": {
                    "add": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "extra_cost_type_id": { "type": "string", "format": "uuid" },
                          "amount": { "type": "number" }
                        },
                        "required": ["extra_cost_type_id", "note", "info", "dimension"]
                      }
                    },
                    "update": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": { "type": "string", "format": "uuid" },
                          "extra_cost_type_id": { "type": "string", "format": "uuid" },
                          "amount": { "type": "number" }
                        },
                        "required": ["extra_cost_type_id", "note", "info", "dimension", "id"]
                      }
                    },
                    "remove": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": { "id": { "type": "string", "format": "uuid" } },
                        "required": ["id"]
                      }
                    }
                  }
                }
              }
            }
          }
        }
        ```
  * **Responses:**
      * **200:** OK

-----

### 5\. Delete a Good Received Note

  * **DELETE** `/api/good-received-note/{id}`
  * **Summary:** Deletes a good received note.
  * **Description:** This endpoint permanently deletes a specific GRN by its unique identifier.
  * **Security:** `bearer`
  * **Parameters:**

| Name | In | Required | Description | Schema |
| :--- | :--- | :--- | :--- | :--- |
| x-tenant-id | header | true | Tenant ID | `string` |
| id | path | true | The unique identifier of the GRN. | `string` |
| version | query | false | API Version | `string` (default: "latest") |

  * **Responses:**
      * **200:** OK