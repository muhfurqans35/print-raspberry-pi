# Print Management Application

A Print Job Management application using Laravel, PostgreSQL, Next.js, and Raspberry Pi. The application allows customers to place print job orders, which are processed by admins through several stages until the print job is completed and ready for customer pickup.

## Features

### Profile Update

- Users can update their profile information.

### Customer Side

- **Make order print job/item**: Customers can create print jobs and items.
- **View order list**: Customers can view their current and past orders.

### Admin/Staff Side

- **Add, edit, delete printer**: Admins and staff can manage printers in the system.
- **Change order status**: Admins and staff can update the status of customer orders (e.g., processing, completed).
- **View order list from all customers**: Admins can view all orders from customers in one place.
- **Print order print job**: Admins can print orders on the Raspberry Pi.
- **Add, edit, and delete items**: Admins can manage the items.
  
 **Customer Workflow**:
- Customers can place a print job or item order.
- Once ordered, the print job status is `new`.

**Admin Workflow**:
- Admin accepts the print job and changes the status to `accepted`.
- Admin starts printing or packaging, changing the status to `printing` or `packaging`.
- Once the print job is completed, the admin updates the status to `printed/pickup ready`.

**Customer Pickup**:
- After the customer picks up the print job, the status is updated to `finished`.
  
## Technologies Used
- **Backend**: Laravel
- **Frontend**: Next.js
- **Database**: PostgreSQL
- **Printer**: Raspberry Pi/Go (to handle print jobs)

