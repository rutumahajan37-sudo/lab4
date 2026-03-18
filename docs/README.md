# COBOL Account Management System - Documentation

## Overview
This is a COBOL-based Account Management System designed to handle basic financial operations for student accounts. The system provides a menu-driven interface allowing users to view balances, credit accounts, and debit accounts with built-in validation.

---

## Program Structure

### 1. **MainProgram** (main.cob)
**Purpose:** Entry point and user interface controller for the account management system.

**Key Functions:**
- Displays an interactive menu with four options
- Validates user input (choices 1-4)
- Routes user requests to the appropriate operations subprogram
- Implements a loop-based interface that continues until the user selects "Exit"

**Menu Options:**
- Option 1: View Balance
- Option 2: Credit Account
- Option 3: Debit Account
- Option 4: Exit Program

**Business Logic:**
- Runs in a continuous loop (`PERFORM UNTIL CONTINUE-FLAG = 'NO'`)
- Only exits when user explicitly selects option 4
- Displays an error message for invalid selections

---

### 2. **Operations** (operations.cob)
**Purpose:** Handles the core business operations on student accounts (balance inquiry, credit, debit).

**Key Functions:**
- **TOTAL (View Balance):** Retrieves and displays the current account balance
- **CREDIT (Credit Account):** Accepts a credit amount from the user, retrieves the current balance, adds the credit amount, and updates storage
- **DEBIT (Debit Account):** Accepts a debit amount, retrieves the current balance, validates sufficient funds, and processes the debit if funds are available

**Business Rules:**
- Initial balance: $1,000.00
- Debit operations are only allowed if the account has sufficient funds
- If insufficient funds exist, the transaction is rejected and an appropriate message is displayed
- All monetary values are stored with two decimal places (99 cents precision)

**Data Variables:**
- `OPERATION-TYPE`: Identifies which operation to perform
- `AMOUNT`: The transaction amount entered by the user
- `FINAL-BALANCE`: The current account balance

---

### 3. **DataProgram** (data.cob)
**Purpose:** Persistent data storage layer managing the account balance in working storage.

**Key Functions:**
- **READ Operation:** Retrieves the current balance from storage
- **WRITE Operation:** Updates and persists the account balance in storage

**Storage Details:**
- `STORAGE-BALANCE`: Main storage location for the account balance
- Initial value: $1,000.00
- Format: 9(6)V99 (supports balances up to $999,999.99)

**Design Pattern:**
- Implements a simple data abstraction layer using linkage section parameters
- Receives operations and balance values through the `USING` clause
- Returns updated balance values back to the calling program

---

## Program Flow Diagram

```
MainProgram (Entry Point)
    ↓
Display Menu → Accept User Choice
    ↓
EVALUATE Choice:
    ├─ 1 → Call Operations (TOTAL) → Call DataProgram (READ)
    ├─ 2 → Call Operations (CREDIT) → DataProgram (READ + WRITE)
    ├─ 3 → Call Operations (DEBIT) → DataProgram (READ + WRITE with validation)
    └─ 4 → Exit Program
```

---

## Business Rules for Student Accounts

1. **Initial Balance:** All student accounts start with $1,000.00
2. **Credit Transactions:** Any positive amount can be credited to the account
3. **Debit Transactions:** Only allowed if the account balance is equal to or greater than the debit amount
4. **Insufficient Funds:** Debit requests that exceed available balance are rejected without processing
5. **Precision:** All monetary values maintain two decimal place precision (cents)
6. **Data Persistence:** Balance updates are preserved during program execution through the DataProgram storage layer

---

## Technical Notes

- **Language:** COBOL
- **Architecture:** Three-tier structure (UI → Operations → Data)
- **Data Format:** 
  - Monetary values: PIC 9(6)V99 (6 digits before decimal, 2 after)
  - Operations: 6-character string identifiers
- **Control Flow:** Uses PERFORM UNTIL loops and EVALUATE conditional statements
- **Interprogram Communication:** Programs communicate via CALL statements with USING parameters

---

## Data Flow Sequence Diagrams

### View Balance Operation
```mermaid
sequenceDiagram
    participant User
    participant MainProgram
    participant Operations
    participant DataProgram

    User->>MainProgram: Enter choice (1)
    MainProgram->>Operations: CALL 'Operations' USING 'TOTAL '
    Operations->>DataProgram: CALL 'DataProgram' USING 'READ', FINAL-BALANCE
    DataProgram->>DataProgram: MOVE STORAGE-BALANCE TO BALANCE
    DataProgram->>Operations: Return FINAL-BALANCE = $1,000.00
    Operations->>User: DISPLAY "Current balance: $1,000.00"
```

### Credit Account Operation
```mermaid
sequenceDiagram
    participant User
    participant MainProgram
    participant Operations
    participant DataProgram

    User->>MainProgram: Enter choice (2)
    MainProgram->>Operations: CALL 'Operations' USING 'CREDIT'
    Operations->>User: DISPLAY "Enter credit amount: "
    User->>Operations: Enter amount (e.g., $500.00)
    Operations->>DataProgram: CALL 'DataProgram' USING 'READ', FINAL-BALANCE
    DataProgram->>Operations: Return FINAL-BALANCE = $1,000.00
    Operations->>Operations: ADD $500.00 TO FINAL-BALANCE = $1,500.00
    Operations->>DataProgram: CALL 'DataProgram' USING 'WRITE', $1,500.00
    DataProgram->>DataProgram: MOVE $1,500.00 TO STORAGE-BALANCE
    DataProgram->>Operations: Confirm write complete
    Operations->>User: DISPLAY "Amount credited. New balance: $1,500.00"
```

### Debit Account Operation (Success & Failure Cases)
```mermaid
sequenceDiagram
    participant User
    participant MainProgram
    participant Operations
    participant DataProgram

    User->>MainProgram: Enter choice (3)
    MainProgram->>Operations: CALL 'Operations' USING 'DEBIT '
    Operations->>User: DISPLAY "Enter debit amount: "
    User->>Operations: Enter amount
    Operations->>DataProgram: CALL 'DataProgram' USING 'READ', FINAL-BALANCE
    DataProgram->>Operations: Return FINAL-BALANCE
    
    alt Sufficient Funds
        Operations->>Operations: Validate FINAL-BALANCE >= AMOUNT
        Operations->>Operations: SUBTRACT AMOUNT FROM FINAL-BALANCE
        Operations->>DataProgram: CALL 'DataProgram' USING 'WRITE', New Balance
        DataProgram->>DataProgram: MOVE New Balance TO STORAGE-BALANCE
        DataProgram->>Operations: Confirm write complete
        Operations->>User: DISPLAY "Amount debited. New balance: $X.XX"
    else Insufficient Funds
        Operations->>Operations: Validate FINAL-BALANCE < AMOUNT (FAILS)
        Operations->>User: DISPLAY "Insufficient funds for this debit."
        Note over Operations: Transaction rejected, balance unchanged
    end
```

### Complete System Data Flow
```mermaid
sequenceDiagram
    participant User
    participant MainProgram as MainProgram<br/>(UI Layer)
    participant Operations as Operations<br/>(Business Logic)
    participant DataProgram as DataProgram<br/>(Data Layer)
    participant Storage as STORAGE-BALANCE<br/>(Persistent Storage)

    loop User Session
        User->>MainProgram: Display menu & select option
        MainProgram->>Operations: CALL Operations<br/>(Operation Type)
        
        alt Option: View Balance
            Operations->>DataProgram: READ current balance
            DataProgram->>Storage: Fetch STORAGE-BALANCE
            Storage->>DataProgram: Return balance value
            DataProgram->>Operations: Return balance
            Operations->>User: Display balance
        else Option: Credit/Debit
            User->>Operations: Enter transaction amount
            Operations->>DataProgram: READ current balance
            DataProgram->>Storage: Fetch STORAGE-BALANCE
            Storage->>DataProgram: Return balance value
            DataProgram->>Operations: Return balance
            Operations->>Operations: Calculate new balance +/<br/>validate funds
            Operations->>DataProgram: WRITE new balance
            DataProgram->>Storage: Update STORAGE-BALANCE
            Storage->>DataProgram: Confirm update
            DataProgram->>Operations: Confirm write
            Operations->>User: Display result
        else Option: Exit
            MainProgram->>MainProgram: Set CONTINUE-FLAG = 'NO'
            MainProgram->>User: Exit program
        end
    end
```
