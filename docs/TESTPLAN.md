# Test Plan: COBOL Account Management System

## Purpose
This test plan documents all test cases for the COBOL Account Management System to validate business logic and implementation against stakeholder requirements. This test plan will serve as the basis for creating unit and integration tests in the Node.js application migration.

## Test Environment
- **Application:** COBOL Account Management System
- **Test Date:** [To be filled]
- **Tested By:** [To be filled]
- **Build Version:** [To be filled]

---

## Test Cases

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status | Comments |
|---|---|---|---|---|---|---|---|
| TC-001 | View initial account balance | Application started, no prior transactions | 1. Select menu option 1 (View Balance) | Display "Current balance: 001000.00" | | | Initial balance should be $1,000.00 |
| TC-002 | Credit account with valid amount | Application started, balance = $1,000.00 | 1. Select option 2 (Credit Account)<br/>2. Enter amount: 500.00 | Display "Amount credited. New balance: 001500.00" | | | Balance should increase by exact credit amount |
| TC-003 | Credit account with multiple transactions | Balance = $1,000.00 after TC-001 | 1. Select option 2<br/>2. Enter amount: 250.00<br/>3. Return to menu and select option 2<br/>4. Enter amount: 150.00 | First credit: "New balance: 001250.00"<br/>Second credit: "New balance: 001400.00" | | | Each credit should apply cumulatively |
| TC-004 | Credit account with minimum amount | Balance = $1,000.00 | 1. Select option 2<br/>2. Enter amount: 0.01 | Display "Amount credited. New balance: 001000.01" | | | System should handle smallest monetary unit (cents) |
| TC-005 | Credit account with large amount | Balance = $1,000.00 | 1. Select option 2<br/>2. Enter amount: 99999.00 | Display "Amount credited. New balance: 100999.00" | | | System should handle large amounts within PIC 9(6)V99 range |
| TC-006 | Debit account with valid amount | Balance = $1,000.00 | 1. Select option 3 (Debit Account)<br/>2. Enter amount: 200.00 | Display "Amount debited. New balance: 000800.00" | | | Balance should decrease by exact debit amount |
| TC-007 | Debit account with exact balance amount | Balance = $1,000.00 | 1. Select option 3<br/>2. Enter amount: 1000.00 | Display "Amount debited. New balance: 000000.00" | | | Debit should be allowed when amount equals balance |
| TC-008 | Debit account with insufficient funds | Balance = $500.00 | 1. Select option 3<br/>2. Enter amount: 600.00 | Display "Insufficient funds for this debit."<br/>Balance remains $500.00 | | | Debit should be rejected when amount exceeds balance |
| TC-009 | Debit account with minimum amount | Balance = $1,000.00 | 1. Select option 3<br/>2. Enter amount: 0.01 | Display "Amount debited. New balance: 000999.99" | | | System should handle smallest monetary unit (cents) |
| TC-010 | Multiple debit transactions | Balance = $1,000.00 | 1. Select option 3<br/>2. Enter amount: 100.00<br/>3. Return to menu and select option 3<br/>4. Enter amount: 200.00 | First debit: "New balance: 000900.00"<br/>Second debit: "New balance: 000700.00" | | | Each debit should apply cumulatively |
| TC-011 | Credit and debit operations in sequence | Balance = $1,000.00 | 1. Select option 2, enter 300.00<br/>2. Return to menu, select option 3, enter 200.00<br/>3. Return to menu, select option 1 | Credit: "New balance: 001300.00"<br/>Debit: "New balance: 001100.00"<br/>View: "Current balance: 001100.00" | | | Balance should reflect all operations in sequence |
| TC-012 | Balance persistence after view operation | Balance = $1,500.00 | 1. Select option 1 (View Balance)<br/>2. Return to menu, select option 1 again | Both displays show "Current balance: 001500.00" | | | Multiple view operations should not affect balance |
| TC-013 | Menu option validation - invalid choice 0 | Application at main menu | 1. Select option 0 | Display "Invalid choice, please select 1-4."<br/>Menu displays again | | | Invalid menu choice should show error and redisplay menu |
| TC-014 | Menu option validation - invalid choice 5 | Application at main menu | 1. Select option 5 | Display "Invalid choice, please select 1-4."<br/>Menu displays again | | | Invalid menu choice outside range should show error |
| TC-015 | Menu option validation - invalid choice letter | Application at main menu | 1. Select "A" or non-numeric input | Error handling and menu redisplay (behavior depends on input validation) | | | Non-numeric input handling validation |
| TC-016 | Exit program from main menu | Application running, completed some transactions | 1. Select option 4 (Exit) | Display "Exiting the program. Goodbye!"<br/>Program terminates | | | Exit should cleanly terminate the application |
| TC-017 | Program loop continues after invalid menu choice | Application at main menu | 1. Select option 5 (invalid)<br/>2. Select option 1 (valid) | First: Error message displayed<br/>Second: Correct operation executes | | | Loop should continue after invalid input |
| TC-018 | Debit when balance equals zero | Balance = $0.00 | 1. Select option 3<br/>2. Enter amount: 0.01 | Display "Insufficient funds for this debit."<br/>Balance remains $0.00 | | | Debit should be rejected at zero balance |
| TC-019 | Debit with amount greater than max balance | Balance = $999,999.99 | 1. Select option 3<br/>2. Enter amount: 500000.00 | Display "Insufficient funds for this debit."<br/>Balance remains $999,999.99 | | | System should reject debits exceeding current balance regardless of max range |
| TC-020 | Credit to approach maximum balance | Balance = $999,998.00 | 1. Select option 2<br/>2. Enter amount: 1.00 | Display "Amount credited. New balance: 999999.00" | | | System should handle balance near maximum allowable value |
| TC-021 | Balance format consistency | Various balance values | View balance after multiple operations | All displayed balances formatted as XXXXXX.XX with leading zeros | | | Numeric format should be consistent across all displays |
| TC-022 | Two decimal place precision in calculations | Balance = $100.00 | 1. Credit 33.33<br/>2. Credit 33.33<br/>3. Credit 33.34<br/>4. View balance | Final balance: 100.00 + 33.33 + 33.33 + 33.34 = 200.00 | | | Calculations should maintain exact two decimal place precision |
| TC-023 | Data isolation between menu loops | Balance at $1,000.00 | 1. View balance<br/>2. Credit 500.00<br/>3. Exit<br/>4. Restart app | Upon restart, balance should return to initial $1,000.00 | | | Balance should reset on new application instance (no persistent storage across sessions) |
| TC-024 | Successful sequence: Credit, View, Debit, View | Initial balance $1,000.00 | 1. Credit 250.00 verify<br/>2. Debit 100.00 verify<br/>3. View final balance | Step 1: $1,250.00<br/>Step 2: $1,150.00<br/>Step 3: Display $1,150.00 | | | Complete user workflow should execute correctly |

---

## Test Summary

| Category | Total Cases | Passed | Failed | Blocked |
|---|---|---|---|---|
| Balance Viewing (TC-001, TC-012) | 2 | | | |
| Credit Operations (TC-002 through TC-005) | 4 | | | |
| Debit Operations (TC-006 through TC-011) | 6 | | | |
| Menu Validation (TC-013 through TC-017) | 5 | | | |
| Edge Cases & Precision (TC-018 through TC-023) | 6 | | | |
| Integration/Full Workflows (TC-024) | 1 | | | |
| **Total** | **24** | | | |

---

## Business Logic Coverage

### Requirement 1: Menu-Driven Interface
- **Covered by:** TC-013, TC-014, TC-015, TC-016, TC-017
- **Status:** ✓

### Requirement 2: View Balance
- **Covered by:** TC-001, TC-012, TC-024
- **Status:** ✓

### Requirement 3: Credit Transactions
- **Covered by:** TC-002, TC-003, TC-004, TC-005, TC-024
- **Status:** ✓

### Requirement 4: Debit Transactions with Validation
- **Covered by:** TC-006, TC-007, TC-008, TC-009, TC-010, TC-018, TC-019
- **Status:** ✓

### Requirement 5: Data Persistence During Session
- **Covered by:** TC-003, TC-010, TC-011
- **Status:** ✓

### Requirement 6: Accurate Monetary Calculations
- **Covered by:** TC-004, TC-009, TC-021, TC-022
- **Status:** ✓

### Requirement 7: Program Loop and Menu Continue
- **Covered by:** TC-017, TC-024
- **Status:** ✓

---

## Notes for Node.js Migration

When converting these test cases to Node.js unit and integration tests, consider the following:

1. **Input Validation:** Test framework should mock user input and verify menu option validation
2. **Balance Management:** Use dependency injection to mock the data storage layer
3. **Transaction Logic:** Create separate test suites for each operation type (View, Credit, Debit)
4. **Precision Testing:** Use a testing library that handles floating-point precision (e.g., use fixed decimal arithmetic)
5. **Integration Tests:** Mock the three-tier architecture to test interactions between MainProgram, Operations, and DataProgram layers
6. **Error Handling:** Create tests for error messages and rejection scenarios
7. **State Management:** Test balance state before/after each operation to verify correctness

---

## Sign-Off

| Role | Name | Date | Signature |
|---|---|---|---|
| Test Plan Created By | [Name] | [Date] | |
| Reviewed By | [Name] | [Date] | |
| Approved By | [Name] | [Date] | |
