# Database Schema

This is a simplified relational schema designed for PostgreSQL / MySQL.

---

## **Key Tables:**

### **users**

| Field | Type | Notes |
| :--- | :--- | :--- |
| id | UUID / INT | Primary Key |
| full_name | VARCHAR | |
| email | VARCHAR | Unique |
| phone | VARCHAR | Optional |
| password_hash | TEXT | Encrypted |
| role | ENUM | 'customer', 'vendor', 'admin' |
| created_at | TIMESTAMP | |

---

### **vendors**

| Field | Type | Notes |
| :--- | :--- | :--- |
| id | UUID / INT | Primary Key |
| user_id | FK (users) | Vendor account |
| business_name | VARCHAR | |
| category | ENUM | 'photography', 'catering', etc. |
| location | VARCHAR | City / Area |
| min_price | INT | Starting rate |
| max_price | INT | Max rate |
| rating | DECIMAL | Avg user rating |
| description | TEXT | |
| profile_img | TEXT | URL / Path to image |

---

### **services**

| Field | Type | Notes |
| :--- | :--- | :--- |
| id | UUID / INT | Primary Key |
| vendor_id | FK (vendors) | |
| title | VARCHAR | e.g. "Gold Wedding Package" |
| description | TEXT | |
| price | INT | |
| availability | JSONB | Dates available (optional) |

---

### **events**

| Field | Type | Notes |
| :--- | :--- | :--- |
| id | UUID / INT | Primary Key |
| user_id | FK (users) | Who is planning the event |
| event_type | VARCHAR | e.g., "Wedding" |
| location | VARCHAR | |
| date | DATE | |
| budget | INT | |
| created_at | TIMESTAMP | |

---

### **event_vendors** (Pivot table for bookings)

| Field | Type | Notes |
| :--- | :--- | :--- |
| id | UUID / INT | Primary Key |
| event_id | FK (events) | |
| vendor_id | FK (vendors) | |
| service_id | FK (services) | |
| agreed_price | INT | Final booked price |
| status | ENUM | 'pending', 'confirmed', 'paid' |

---

### **reviews**

| Field | Type | Notes |
| :--- | :--- | :--- |
| id | UUID / INT | Primary Key |
| user_id | FK (users) | Who left the review |
| vendor_id | FK (vendors) | |
| event_id | FK (events) | |
| rating | INT | 1 to 5 |
| review_text | TEXT | Optional |
| created_at | TIMESTAMP | |