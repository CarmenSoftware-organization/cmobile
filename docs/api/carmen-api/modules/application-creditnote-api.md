### **Module: Application - Credit Note**

This module handles the creation, retrieval, update, and deletion of credit notes, as well as managing credit note reasons.

-----

### 1\. Find All Credit Notes

  * **GET** `/api/credit-note`
  * **Summary:** Retrieves a list of all credit notes.
  * **Description:** This endpoint fetches a paginated and filterable list of credit notes.
  * **Security:** `bearer`
  * **Parameters:**

| Name | In | Required | Description | Schema |
| :--- | :--- | :--- | :--- | :--- |
| x-tenant-id | header | true | Tenant ID | `string` |
| version | query | false | API Version | `string` (default: "latest") |
| page | query | false | Page number for pagination | `number` (default: 1) |
| perpage | query | false | Number of items per page | `number` (default: 10) |
| search | query | false | A general search term | `string` (default: "") |
| filter | query | false | Key-value pairs for filtering | `record<string, string>` (default: []) |
| searchfields | query | false | Fields to apply the search term to | `array` of `string` (default: []) |
| sort | query | false | Fields to sort by | `array` of `string` (default: []) |

  * **Responses:**
      * **200:** OK

-----

### 2\. Create a Credit Note

  * **POST** `/api/credit-note`
  * **Summary:** Creates a new credit note.
  * **Description:** This endpoint allows for the creation of a new credit note.
  * **Security:** `bearer`
  * **Parameters:**

| Name | In | Required | Description | Schema |
| :--- | :--- | :--- | :--- | :--- |
| x-tenant-id | header | true | Tenant ID | `string` |
| version | query | false | API Version | `string` (default: "latest") |

  * **Request Body:**
      * **Content-Type:** `application/json`
      * **Schema:** `CreateCreditNoteDto`
        ```json
        {
          "type": "object",
          "properties": {
            "cn_no": {
              "type": "string"
            },
            "cn_date": {
              "type": "string",
              "format": "date-time"
            },
            "doc_status": {
              "type": "string",
              "enum": [
                "draft",
                "in_progress",
                "completed",
                "cancelled",
                "voided"
              ],
              "default": "draft"
            },
            "credit_note_type": {
              "type": "string",
              "enum": [
                "quantity_return",
                "amount_discount"
              ]
            },
            "description": {
              "type": "string"
            },
            "cn_reason_id": {
              "type": "string",
              "format": "uuid"
            },
            "note": {
              "type": "string",
              "nullable": true
            },
            "info": {
              "type": "object",
              "properties": {
                "priority": {
                  "type": "string"
                },
                "budget_code": {
                  "type": "string"
                }
              },
              "required": [
                "priority",
                "budget_code"
              ],
              "nullable": true
            },
            "dimension": {
              "type": "object",
              "properties": {
                "cost_center": {
                  "type": "string"
                },
                "project": {
                  "type": "string"
                }
              },
              "required": [
                "cost_center",
                "project"
              ],
              "nullable": true
            },
            "created_at": {},
            "created_by_id": {
              "type": "string"
            },
            "update_by_id": {
              "type": "string"
            },
            "updated_at": {},
            "deleted_at": {},
            "deleted_by_id": {
              "type": "string"
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
              "items": {
                "type": "object",
                "properties": {
                  "status": {
                    "type": "string"
                  },
                  "timestamp": {},
                  "user": {
                    "type": "string"
                  }
                },
                "required": [
                  "status",
                  "timestamp",
                  "user"
                ]
              },
              "nullable": true
            },
            "workflow_name": {
              "type": "string"
            },
            "workflow_next_stage": {
              "type": "string"
            },
            "workflow_previous_stage": {
              "type": "string"
            },
            "workflow_current_stage": {
              "type": "string"
            },
            "user_action": {
              "type": "object",
              "properties": {}
            },
            "last_action_date_at": {},
            "last_action_by_id": {
              "type": "string"
            },
            "last_action_by_name": {
              "type": "string"
            },
            "last_action_name": {
              "type": "string"
            },
            "vendor_id": {
              "type": "string",
              "format": "uuid"
            },
            "vendor_name": {
              "type": "string"
            },
            "approved_conversion_rate": {
              "type": "number"
            },
            "requested_conversion_rate": {
              "type": "number"
            },
            "currency_id": {
              "type": "string",
              "format": "uuid"
            },
            "currency_name": {
              "type": "string"
            },
            "exchange_rate": {
              "type": "number"
            },
            "exchange_rate_date": {},
            "grn_id": {
              "type": "string",
              "format": "uuid"
            },
            "credit_note_detail": {
              "type": "object",
              "properties": {
                "add": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "inventory_transaction_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "amount": {
                        "type": "number"
                      },
                      "product_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "product_name": {
                        "type": "string"
                      },
                      "price": {
                        "type": "number"
                      },
                      "total_price": {
                        "type": "number"
                      },
                      "price_without_vat": {
                        "type": "number"
                      },
                      "price_with_vat": {
                        "type": "number"
                      },
                      "base_price": {
                        "type": "number"
                      },
                      "base_total_price": {
                        "type": "number"
                      },
                      "extra_cost": {
                        "type": "number"
                      },
                      "total_cost": {
                        "type": "number"
                      },
                      "note": {
                        "type": "string",
                        "nullable": true
                      },
                      "info": {
                        "type": "object",
                        "properties": {
                          "priority": {
                            "type": "string"
                          },
                          "budget_code": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "priority",
                          "budget_code"
                        ],
                        "nullable": true
                      },
                      "dimension": {
                        "type": "object",
                        "properties": {
                          "cost_center": {
                            "type": "string"
                          },
                          "project": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "cost_center",
                          "project"
                        ],
                        "nullable": true
                      },
                      "created_at": {},
                      "created_by_id": {
                        "type": "string"
                      },
                      "update_by_id": {
                        "type": "string"
                      },
                      "updated_at": {},
                      "deleted_at": {},
                      "deleted_by_id": {
                        "type": "string"
                      },
                      "requested_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "requested_unit_name": {
                        "type": "string"
                      },
                      "approved_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "approved_unit_name": {
                        "type": "string"
                      },
                      "requested_base_qty": {
                        "type": "number"
                      },
                      "requested_base_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "requested_base_unit_name": {
                        "type": "string"
                      },
                      "approved_base_qty": {
                        "type": "number"
                      },
                      "approved_base_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "approved_base_unit_name": {
                        "type": "string"
                      },
                      "foc_qty": {
                        "type": "number"
                      },
                      "foc_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "foc_unit_name": {
                        "type": "string"
                      },
                      "foc_base_qty": {
                        "type": "number"
                      },
                      "foc_base_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "foc_base_unit_name": {
                        "type": "string"
                      },
                      "foc_unit_conversion_rate": {
                        "type": "number"
                      },
                      "foc_base_unit_conversion_rate": {
                        "type": "number"
                      },
                      "inventory_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "inventory_unit_name": {
                        "type": "string"
                      },
                      "inventory_unit_qty": {
                        "type": "number"
                      },
                      "inventory_unit_conversion_rate": {
                        "type": "number"
                      },
                      "requested_unit_conversion_rate": {
                        "type": "number"
                      },
                      "approved_unit_conversion_rate": {
                        "type": "number"
                      },
                      "unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "unit_name": {
                        "type": "string"
                      },
                      "order_qty": {
                        "type": "number"
                      },
                      "order_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "order_unit_name": {
                        "type": "string"
                      },
                      "order_unit_conversion_rate": {
                        "type": "number"
                      },
                      "order_base_qty": {
                        "type": "number"
                      },
                      "order_base_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "order_base_unit_name": {
                        "type": "string"
                      },
                      "received_qty": {
                        "type": "number"
                      },
                      "received_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "received_unit_name": {
                        "type": "string"
                      },
                      "received_unit_conversion_rate": {
                        "type": "number"
                      },
                      "received_base_unit_conversion_rate": {
                        "type": "number"
                      },
                      "received_base_qty": {
                        "type": "number"
                      },
                      "received_base_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "received_base_unit_name": {
                        "type": "string"
                      },
                      "base_qty": {
                        "type": "number"
                      },
                      "return_qty": {
                        "type": "number"
                      },
                      "return_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "return_unit_name": {
                        "type": "string"
                      },
                      "return_conversion_rate": {
                        "type": "number"
                      },
                      "return_base_qty": {
                        "type": "number"
                      },
                      "location_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "location_name": {
                        "type": "string"
                      },
                      "tax_type_inventory_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "tax_type_inventory_name": {
                        "type": "string"
                      },
                      "tax_type": {
                        "type": "string",
                        "enum": [
                          "none",
                          "included",
                          "add"
                        ]
                      },
                      "tax_rate": {
                        "type": "number"
                      },
                      "tax_amount": {
                        "type": "number"
                      },
                      "is_tax_adjustment": {
                        "type": "boolean"
                      },
                      "base_tax_amount": {
                        "type": "number"
                      },
                      "total_amount": {
                        "type": "number"
                      }
                    },
                    "required": [
                      "product_id",
                      "note",
                      "info",
                      "dimension"
                    ]
                  }
                }
              }
            }
          },
          "required": [
            "credit_note_type",
            "note",
            "info",
            "dimension",
            "workflow_history",
            "grn_id"
          ]
        }
        ```
  * **Responses:**
      * **201:** Created

-----

### 3\. Find a Single Credit Note

  * **GET** `/api/credit-note/{id}`
  * **Summary:** Retrieves a single credit note by its ID.
  * **Description:** This endpoint fetches the details of a specific credit note using its unique identifier.
  * **Security:** `bearer`
  * **Parameters:**

| Name | In | Required | Description | Schema |
| :--- | :--- | :--- | :--- | :--- |
| x-tenant-id | header | true | Tenant ID | `string` |
| id | path | true | The unique identifier of the credit note. | `string` |
| version | query | false | API Version | `string` (default: "latest") |

  * **Responses:**
      * **200:** OK

-----

### 4\. Update a Credit Note

  * **PATCH** `/api/credit-note/{id}`
  * **Summary:** Updates an existing credit note.
  * **Description:** This endpoint allows for partial updates to a specific credit note's details.
  * **Security:** `bearer`
  * **Parameters:**

| Name | In | Required | Description | Schema |
| :--- | :--- | :--- | :--- | :--- |
| x-tenant-id | header | true | Tenant ID | `string` |
| id | path | true | The unique identifier of the credit note. | `string` |
| version | query | false | API Version | `string` (default: "latest") |

  * **Request Body:**
      * **Content-Type:** `application/json`
      * **Schema:** `UpdateCreditNoteDto`
        ```json
        {
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "format": "uuid"
            },
            "cn_no": {
              "type": "string"
            },
            "cn_date": {
              "type": "string",
              "format": "date-time"
            },
            "doc_status": {
              "type": "string",
              "enum": [
                "draft",
                "in_progress",
                "completed",
                "cancelled",
                "voided"
              ],
              "default": "draft"
            },
            "credit_note_type": {
              "type": "string",
              "enum": [
                "quantity_return",
                "amount_discount"
              ]
            },
            "description": {
              "type": "string"
            },
            "cn_reason_id": {
              "type": "string",
              "format": "uuid"
            },
            "note": {
              "type": "string",
              "nullable": true
            },
            "info": {
              "type": "object",
              "properties": {
                "priority": {
                  "type": "string"
                },
                "budget_code": {
                  "type": "string"
                }
              },
              "required": [
                "priority",
                "budget_code"
              ],
              "nullable": true
            },
            "dimension": {
              "type": "object",
              "properties": {
                "cost_center": {
                  "type": "string"
                },
                "project": {
                  "type": "string"
                }
              },
              "required": [
                "cost_center",
                "project"
              ],
              "nullable": true
            },
            "created_at": {},
            "created_by_id": {
              "type": "string"
            },
            "update_by_id": {
              "type": "string"
            },
            "updated_at": {},
            "deleted_at": {},
            "deleted_by_id": {
              "type": "string"
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
              "items": {
                "type": "object",
                "properties": {
                  "status": {
                    "type": "string"
                  },
                  "timestamp": {},
                  "user": {
                    "type": "string"
                  }
                },
                "required": [
                  "status",
                  "timestamp",
                  "user"
                ]
              },
              "nullable": true
            },
            "workflow_name": {
              "type": "string"
            },
            "workflow_next_stage": {
              "type": "string"
            },
            "workflow_previous_stage": {
              "type": "string"
            },
            "workflow_current_stage": {
              "type": "string"
            },
            "user_action": {
              "type": "object",
              "properties": {}
            },
            "last_action_date_at": {},
            "last_action_by_id": {
              "type": "string"
            },
            "last_action_by_name": {
              "type": "string"
            },
            "last_action_name": {
              "type": "string"
            },
            "vendor_id": {
              "type": "string",
              "format": "uuid"
            },
            "vendor_name": {
              "type": "string"
            },
            "approved_conversion_rate": {
              "type": "number"
            },
            "requested_conversion_rate": {
              "type": "number"
            },
            "currency_id": {
              "type": "string",
              "format": "uuid"
            },
            "currency_name": {
              "type": "string"
            },
            "exchange_rate": {
              "type": "number"
            },
            "exchange_rate_date": {},
            "grn_id": {
              "type": "string",
              "format": "uuid"
            },
            "credit_note_detail": {
              "type": "object",
              "properties": {
                "add": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "inventory_transaction_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "amount": {
                        "type": "number"
                      },
                      "product_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "product_name": {
                        "type": "string"
                      },
                      "price": {
                        "type": "number"
                      },
                      "total_price": {
                        "type": "number"
                      },
                      "price_without_vat": {
                        "type": "number"
                      },
                      "price_with_vat": {
                        "type": "number"
                      },
                      "base_price": {
                        "type": "number"
                      },
                      "base_total_price": {
                        "type": "number"
                      },
                      "extra_cost": {
                        "type": "number"
                      },
                      "total_cost": {
                        "type": "number"
                      },
                      "note": {
                        "type": "string",
                        "nullable": true
                      },
                      "info": {
                        "type": "object",
                        "properties": {
                          "priority": {
                            "type": "string"
                          },
                          "budget_code": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "priority",
                          "budget_code"
                        ],
                        "nullable": true
                      },
                      "dimension": {
                        "type": "object",
                        "properties": {
                          "cost_center": {
                            "type": "string"
                          },
                          "project": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "cost_center",
                          "project"
                        ],
                        "nullable": true
                      },
                      "created_at": {},
                      "created_by_id": {
                        "type": "string"
                      },
                      "update_by_id": {
                        "type": "string"
                      },
                      "updated_at": {},
                      "deleted_at": {},
                      "deleted_by_id": {
                        "type": "string"
                      },
                      "requested_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "requested_unit_name": {
                        "type": "string"
                      },
                      "approved_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "approved_unit_name": {
                        "type": "string"
                      },
                      "requested_base_qty": {
                        "type": "number"
                      },
                      "requested_base_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "requested_base_unit_name": {
                        "type": "string"
                      },
                      "approved_base_qty": {
                        "type": "number"
                      },
                      "approved_base_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "approved_base_unit_name": {
                        "type": "string"
                      },
                      "foc_qty": {
                        "type": "number"
                      },
                      "foc_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "foc_unit_name": {
                        "type": "string"
                      },
                      "foc_base_qty": {
                        "type": "number"
                      },
                      "foc_base_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "foc_base_unit_name": {
                        "type": "string"
                      },
                      "foc_unit_conversion_rate": {
                        "type": "number"
                      },
                      "foc_base_unit_conversion_rate": {
                        "type": "number"
                      },
                      "inventory_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "inventory_unit_name": {
                        "type": "string"
                      },
                      "inventory_unit_qty": {
                        "type": "number"
                      },
                      "inventory_unit_conversion_rate": {
                        "type": "number"
                      },
                      "requested_unit_conversion_rate": {
                        "type": "number"
                      },
                      "approved_unit_conversion_rate": {
                        "type": "number"
                      },
                      "unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "unit_name": {
                        "type": "string"
                      },
                      "order_qty": {
                        "type": "number"
                      },
                      "order_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "order_unit_name": {
                        "type": "string"
                      },
                      "order_unit_conversion_rate": {
                        "type": "number"
                      },
                      "order_base_qty": {
                        "type": "number"
                      },
                      "order_base_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "order_base_unit_name": {
                        "type": "string"
                      },
                      "received_qty": {
                        "type": "number"
                      },
                      "received_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "received_unit_name": {
                        "type": "string"
                      },
                      "received_unit_conversion_rate": {
                        "type": "number"
                      },
                      "received_base_unit_conversion_rate": {
                        "type": "number"
                      },
                      "received_base_qty": {
                        "type": "number"
                      },
                      "received_base_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "received_base_unit_name": {
                        "type": "string"
                      },
                      "base_qty": {
                        "type": "number"
                      },
                      "return_qty": {
                        "type": "number"
                      },
                      "return_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "return_unit_name": {
                        "type": "string"
                      },
                      "return_conversion_rate": {
                        "type": "number"
                      },
                      "return_base_qty": {
                        "type": "number"
                      },
                      "location_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "location_name": {
                        "type": "string"
                      },
                      "tax_type_inventory_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "tax_type_inventory_name": {
                        "type": "string"
                      },
                      "tax_type": {
                        "type": "string",
                        "enum": [
                          "none",
                          "included",
                          "add"
                        ]
                      },
                      "tax_rate": {
                        "type": "number"
                      },
                      "tax_amount": {
                        "type": "number"
                      },
                      "is_tax_adjustment": {
                        "type": "boolean"
                      },
                      "base_tax_amount": {
                        "type": "number"
                      },
                      "total_amount": {
                        "type": "number"
                      }
                    },
                    "required": [
                      "product_id",
                      "note",
                      "info",
                      "dimension"
                    ]
                  }
                },
                "update": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "inventory_transaction_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "credit_note_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "amount": {
                        "type": "number"
                      },
                      "product_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "product_name": {
                        "type": "string"
                      },
                      "price": {
                        "type": "number"
                      },
                      "total_price": {
                        "type": "number"
                      },
                      "price_without_vat": {
                        "type": "number"
                      },
                      "price_with_vat": {
                        "type": "number"
                      },
                      "base_price": {
                        "type": "number"
                      },
                      "base_total_price": {
                        "type": "number"
                      },
                      "extra_cost": {
                        "type": "number"
                      },
                      "total_cost": {
                        "type": "number"
                      },
                      "note": {
                        "type": "string",
                        "nullable": true
                      },
                      "info": {
                        "type": "object",
                        "properties": {
                          "priority": {
                            "type": "string"
                          },
                          "budget_code": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "priority",
                          "budget_code"
                        ],
                        "nullable": true
                      },
                      "dimension": {
                        "type": "object",
                        "properties": {
                          "cost_center": {
                            "type": "string"
                          },
                          "project": {
                            "type": "string"
                          }
                        },
                        "required": [
                          "cost_center",
                          "project"
                        ],
                        "nullable": true
                      },
                      "created_at": {},
                      "created_by_id": {
                        "type": "string"
                      },
                      "update_by_id": {
                        "type": "string"
                      },
                      "updated_at": {},
                      "deleted_at": {},
                      "deleted_by_id": {
                        "type": "string"
                      },
                      "requested_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "requested_unit_name": {
                        "type": "string"
                      },
                      "approved_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "approved_unit_name": {
                        "type": "string"
                      },
                      "requested_base_qty": {
                        "type": "number"
                      },
                      "requested_base_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "requested_base_unit_name": {
                        "type": "string"
                      },
                      "approved_base_qty": {
                        "type": "number"
                      },
                      "approved_base_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "approved_base_unit_name": {
                        "type": "string"
                      },
                      "foc_qty": {
                        "type": "number"
                      },
                      "foc_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "foc_unit_name": {
                        "type": "string"
                      },
                      "foc_base_qty": {
                        "type": "number"
                      },
                      "foc_base_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "foc_base_unit_name": {
                        "type": "string"
                      },
                      "foc_unit_conversion_rate": {
                        "type": "number"
                      },
                      "foc_base_unit_conversion_rate": {
                        "type": "number"
                      },
                      "inventory_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "inventory_unit_name": {
                        "type": "string"
                      },
                      "inventory_unit_qty": {
                        "type": "number"
                      },
                      "inventory_unit_conversion_rate": {
                        "type": "number"
                      },
                      "requested_unit_conversion_rate": {
                        "type": "number"
                      },
                      "approved_unit_conversion_rate": {
                        "type": "number"
                      },
                      "unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "unit_name": {
                        "type": "string"
                      },
                      "order_qty": {
                        "type": "number"
                      },
                      "order_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "order_unit_name": {
                        "type": "string"
                      },
                      "order_unit_conversion_rate": {
                        "type": "number"
                      },
                      "order_base_qty": {
                        "type": "number"
                      },
                      "order_base_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "order_base_unit_name": {
                        "type": "string"
                      },
                      "received_qty": {
                        "type": "number"
                      },
                      "received_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "received_unit_name": {
                        "type": "string"
                      },
                      "received_unit_conversion_rate": {
                        "type": "number"
                      },
                      "received_base_unit_conversion_rate": {
                        "type": "number"
                      },
                      "received_base_qty": {
                        "type": "number"
                      },
                      "received_base_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "received_base_unit_name": {
                        "type": "string"
                      },
                      "base_qty": {
                        "type": "number"
                      },
                      "return_qty": {
                        "type": "number"
                      },
                      "return_unit_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "return_unit_name": {
                        "type": "string"
                      },
                      "return_conversion_rate": {
                        "type": "number"
                      },
                      "return_base_qty": {
                        "type": "number"
                      },
                      "location_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "location_name": {
                        "type": "string"
                      },
                      "tax_type_inventory_id": {
                        "type": "string",
                        "format": "uuid"
                      },
                      "tax_type_inventory_name": {
                        "type": "string"
                      },
                      "tax_type": {
                        "type": "string",
                        "enum": [
                          "none",
                          "included",
                          "add"
                        ]
                      },
                      "tax_rate": {
                        "type": "number"
                      },
                      "tax_amount": {
                        "type": "number"
                      },
                      "is_tax_adjustment": {
                        "type": "boolean"
                      },
                      "base_tax_amount": {
                        "type": "number"
                      },
                      "total_amount": {
                        "type": "number"
                      }
                    },
                    "required": [
                      "id",
                      "credit_note_id",
                      "product_id",
                      "note",
                      "info",
                      "dimension"
                    ]
                  }
                },
                "delete": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "format": "uuid"
                      }
                    },
                    "required": [
                      "id"
                    ]
                  }
                }
              }
            }
          },
          "required": [
            "credit_note_type",
            "note",
            "info",
            "dimension",
            "workflow_history",
            "grn_id"
          ]
        }
        ```
  * **Responses:**
      * **200:** OK

-----

### 5\. Delete a Credit Note

  * **DELETE** `/api/credit-note/{id}`
  * **Summary:** Deletes a credit note.
  * **Description:** This endpoint permanently deletes a specific credit note by its unique identifier.
  * **Security:** `bearer`
  * **Parameters:**

| Name | In | Required | Description | Schema |
| :--- | :--- | :--- | :--- | :--- |
| x-tenant-id | header | true | Tenant ID | `string` |
| id | path | true | The unique identifier of the credit note. | `string` |
| version | query | false | API Version | `string` (default: "latest") |

  * **Responses:**
      * **200:** OK

-----

### 6\. Find All Credit Note Reasons

  * **GET** `/api/credit-note-reason`
  * **Summary:** Retrieves a list of all credit note reasons.
  * **Description:** This endpoint fetches a paginated and filterable list of available reasons for creating a credit note.
  * **Security:** `bearer`
  * **Parameters:**

| Name | In | Required | Description | Schema |
| :--- | :--- | :--- | :--- | :--- |
| x-tenant-id | header | true | Tenant ID | `string` |
| version | query | false | API Version | `string` (default: "latest") |
| page | query | false | Page number for pagination | `number` (default: 1) |
| perpage | query | false | Number of items per page | `number` (default: 10) |
| search | query | false | A general search term | `string` (default: "") |
| filter | query | false | Key-value pairs for filtering | `record<string, string>` (default: []) |
| searchfields | query | false | Fields to apply the search term to | `array` of `string` (default: []) |
| sort | query | false | Fields to sort by | `array` of `string` (default: []) |

  * **Responses:**
      * **200:** OK