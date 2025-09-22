## Configuration - Currencies

### **GET** `/api/config/currencies`

  * **Summary**: Get all currencies
  * **Description**: Retrieve all currencies.
  * **Security**: Bearer Authentication required.
  * **Parameters**:
      * `x-tenant-id` (header, required): Tenant ID.
      * `page` (query, optional): Page number, defaults to 1.
      * `perpage` (query, optional): Items per page, defaults to 10.
  * **Responses**:
      * `200`: Currencies retrieved successfully.
      * `404`: Currencies not found.

### **POST** `/api/config/currencies`

  * **Summary**: Create a new currency
  * **Description**: Create a new currency.
  * **Security**: Bearer Authentication required.
  * **Parameters**:
      * `x-tenant-id` (header, required): Tenant ID.
  * **Request Body**:
      * **Content-Type**: `application/json`
      * **Schema**: `CurrenciesCreateDto`
        ```json
        {
          "code": "string",
          "name": "string",
          "symbol": "string (optional)",
          "description": "string (optional)",
          "is_active": "boolean (optional, default: true)",
          "exchange_rate": "number (optional, default: 1)"
        }
        ```
  * **Responses**:
      * `201`: Currency created successfully.

### **GET** `/api/config/currencies/{id}`

  * **Summary**: Get a currency by ID
  * **Description**: Retrieve a currency by its unique identifier.
  * **Security**: Bearer Authentication required.
  * **Parameters**:
      * `x-tenant-id` (header, required): Tenant ID.
      * `id` (path, required): The ID of the currency.
  * **Responses**:
      * `200`: Currency retrieved successfully.
      * `404`: Currency not found.

### **PUT** `/api/config/currencies/{id}`

  * **Summary**: Update a currency
  * **Description**: Update a currency.
  * **Security**: Bearer Authentication required.
  * **Parameters**:
      * `x-tenant-id` (header, required): Tenant ID.
      * `id` (path, required): The ID of the currency.
  * **Request Body**:
      * **Content-Type**: `application/json`
      * **Schema**: `CurrenciesUpdateDto`
  * **Responses**:
      * `200`: Currency updated successfully.
      * `404`: Currency not found.

### **DELETE** `/api/config/currencies/{id}`

  * **Summary**: Delete a currency
  * **Description**: Delete a currency.
  * **Security**: Bearer Authentication required.
  * **Parameters**:
      * `x-tenant-id` (header, required): Tenant ID.
      * `id` (path, required): The ID of the currency.
  * **Responses**:
      * `200`: Currency deleted successfully.

-----

## Configuration - Locations

### **GET** `/api/config/locations`

  * **Summary**: Get all locations
  * **Description**: Get all locations.
  * **Security**: Bearer Authentication required.
  * **Parameters**:
      * `x-tenant-id` (header, required): Tenant ID.
      * `page` (query, optional): Page number, defaults to 1.
      * `perpage` (query, optional): Items per page, defaults to 10.
  * **Responses**:
      * `200`: Locations retrieved successfully.

### **POST** `/api/config/locations`

  * **Summary**: Create a new location
  * **Description**: Create a new location.
  * **Security**: Bearer Authentication required.
  * **Parameters**:
      * `x-tenant-id` (header, required): Tenant ID.
  * **Request Body**:
      * **Content-Type**: `application/json`
      * **Schema**: `LocationCreateDto`
        ```json
        {
          "name": "string",
          "location_type": "string (enum: inventory, direct, consignment)",
          "description": "string (optional)",
          "is_active": "boolean (optional, default: true)",
          "delivery_point_id": "string (uuid, optional)",
          "info": "object (optional)",
          "users": {
            "add": [
              { "id": "string (uuid)" }
            ]
          }
        }
        ```
  * **Responses**:
      * `201`: Location created successfully.

### **GET** `/api/config/locations/{id}`

  * **Summary**: Get a location by ID
  * **Description**: Get a location by ID.
  * **Security**: Bearer Authentication required.
  * **Parameters**:
      * `x-tenant-id` (header, required): Tenant ID.
      * `id` (path, required): The ID of the location.
  * **Responses**:
      * `200`: Location retrieved successfully.

### **PATCH** `/api/config/locations/{id}`

  * **Summary**: Update a location
  * **Description**: Update a location.
  * **Security**: Bearer Authentication required.
  * **Parameters**:
      * `x-tenant-id` (header, required): Tenant ID.
      * `id` (path, required): The ID of the location.
  * **Request Body**:
      * **Content-Type**: `application/json`
      * **Schema**: `LocationUpdateDto`
  * **Responses**:
      * `200`: Location updated successfully.

### **DELETE** `/api/config/locations/{id}`

  * **Summary**: Delete a location
  * **Description**: Delete a location.
  * **Security**: Bearer Authentication required.
  * **Parameters**:
      * `x-tenant-id` (header, required): Tenant ID.
      * `id` (path, required): The ID of the location.
  * **Responses**:
      * `200`: Location deleted successfully.

-----

## Configuration - Products

### **GET** `/api/config/products`

  * **Summary**: Get all products
  * **Security**: Bearer Authentication required.
  * **Parameters**:
      * `x-tenant-id` (header, required): Tenant ID.
  * **Responses**:
      * `200`: Successful operation.

### **POST** `/api/config/products`

  * **Summary**: Create a new product
  * **Security**: Bearer Authentication required.
  * **Parameters**:
      * `x-tenant-id` (header, required): Tenant ID.
  * **Request Body**:
      * **Content-Type**: `application/json`
      * **Schema**: `ProductCreateDto`
  * **Responses**:
      * `201`: Successful creation.

### **GET** `/api/config/products/{id}`

  * **Summary**: Get a product by ID
  * **Security**: Bearer Authentication required.
  * **Parameters**:
      * `x-tenant-id` (header, required): Tenant ID.
      * `id` (path, required): The ID of the product.
  * **Responses**:
      * `200`: Successful operation.

### **PATCH** `/api/config/products/{id}`

  * **Summary**: Update a product
  * **Security**: Bearer Authentication required.
  * **Parameters**:
      * `x-tenant-id` (header, required): Tenant ID.
      * `id` (path, required): The ID of the product.
  * **Request Body**:
      * **Content-Type**: `application/json`
      * **Schema**: `ProductUpdateDto`
  * **Responses**:
      * `200`: Successful operation.

### **DELETE** `/api/config/products/{id}`

  * **Summary**: Delete a product
  * **Security**: Bearer Authentication required.
  * **Parameters**:
      * `x-tenant-id` (header, required): Tenant ID.
      * `id` (path, required): The ID of the product.
  * **Responses**:
      * `200`: Successful operation.

-----
  * Any other specific configuration module.