#!/usr/bin/env node

const readline = require('readline-sync');

/**
 * ====================================================================================
 * COBOL to Node.js Migration: Account Management System
 * ====================================================================================
 * This application preserves the original COBOL business logic and three-tier 
 * architecture (UI → Operations → Data) in a Node.js environment.
 * 
 * Original COBOL Programs:
 *   - MainProgram (main.cob): Menu interface and request routing
 *   - Operations (operations.cob): Business logic for account operations
 *   - DataProgram (data.cob): Persistent data storage layer
 * ====================================================================================
 */

// ====================================================================================
// LAYER 3: DATA PROGRAM EQUIVALENT - Persistent Storage
// ====================================================================================
/**
 * DataLayer: Manages account balance persistence
 * Equivalent to DataProgram (data.cob)
 */
class DataLayer {
  constructor() {
    // STORAGE-BALANCE (PIC 9(6)V99): Initial balance $1,000.00
    this.storageBalance = 1000.00;
  }

  /**
   * READ operation: Retrieve current balance from storage
   * @returns {number} Current account balance
   */
  read() {
    return this.storageBalance;
  }

  /**
   * WRITE operation: Update and persist account balance in storage
   * @param {number} newBalance - New balance amount to store
   */
  write(newBalance) {
    this.storageBalance = newBalance;
  }

  /**
   * Utility method: Format balance for display
   * COBOL Format: 9(6)V99 → "XXXXXX.XX"
   * @param {number} balance - Balance to format
   * @returns {string} Formatted balance string
   */
  formatBalance(balance) {
    return balance.toFixed(2).padStart(9, '0');
  }
}

// ====================================================================================
// LAYER 2: OPERATIONS EQUIVALENT - Business Logic
// ====================================================================================
/**
 * OperationsLayer: Handles business operations on student accounts
 * Equivalent to Operations (operations.cob)
 * 
 * Business Rules:
 * - Initial balance: $1,000.00
 * - Debit operations only allowed if account has sufficient funds
 * - All monetary values maintain two decimal place precision
 */
class OperationsLayer {
  constructor(dataLayer) {
    this.dataLayer = dataLayer;
  }

  /**
   * TOTAL operation: View current account balance
   * Equivalent to COBOL: IF OPERATION-TYPE = 'TOTAL '
   */
  viewBalance() {
    const balance = this.dataLayer.read();
    const formattedBalance = this.dataLayer.formatBalance(balance);
    console.log(`Current balance: ${formattedBalance}`);
    return balance;
  }

  /**
   * CREDIT operation: Add amount to account balance
   * Equivalent to COBOL: ELSE IF OPERATION-TYPE = 'CREDIT'
   * 
   * Process:
   * 1. Accept credit amount from user
   * 2. Read current balance from storage
   * 3. Add credit amount to balance
   * 4. Write new balance to storage
   */
  creditAccount() {
    // DISPLAY "Enter credit amount: "
    const amount = readline.questionFloat('Enter credit amount: $');

    // CALL 'DataProgram' USING 'READ', FINAL-BALANCE
    const currentBalance = this.dataLayer.read();

    // ADD AMOUNT TO FINAL-BALANCE
    const newBalance = currentBalance + amount;

    // CALL 'DataProgram' USING 'WRITE', FINAL-BALANCE
    this.dataLayer.write(newBalance);

    // DISPLAY "Amount credited. New balance: " FINAL-BALANCE
    const formattedBalance = this.dataLayer.formatBalance(newBalance);
    console.log(`Amount credited. New balance: ${formattedBalance}`);
    return newBalance;
  }

  /**
   * DEBIT operation: Subtract amount from account balance with validation
   * Equivalent to COBOL: ELSE IF OPERATION-TYPE = 'DEBIT '
   * 
   * Business Rule: Only allow debit if sufficient funds exist
   * 
   * Process:
   * 1. Accept debit amount from user
   * 2. Read current balance from storage
   * 3. Validate: IF FINAL-BALANCE >= AMOUNT
   *    - SUBTRACT AMOUNT FROM FINAL-BALANCE
   *    - Write new balance to storage
   *    - Display success message
   * 4. Else: Display insufficient funds message
   */
  debitAccount() {
    // DISPLAY "Enter debit amount: "
    const amount = readline.questionFloat('Enter debit amount: $');

    // CALL 'DataProgram' USING 'READ', FINAL-BALANCE
    const currentBalance = this.dataLayer.read();

    // IF FINAL-BALANCE >= AMOUNT
    if (currentBalance >= amount) {
      // SUBTRACT AMOUNT FROM FINAL-BALANCE
      const newBalance = currentBalance - amount;

      // CALL 'DataProgram' USING 'WRITE', FINAL-BALANCE
      this.dataLayer.write(newBalance);

      // DISPLAY "Amount debited. New balance: " FINAL-BALANCE
      const formattedBalance = this.dataLayer.formatBalance(newBalance);
      console.log(`Amount debited. New balance: ${formattedBalance}`);
      return newBalance;
    } else {
      // Display insufficient funds message
      console.log('Insufficient funds for this debit.');
      return currentBalance;
    }
  }
}

// ====================================================================================
// LAYER 1: MAIN PROGRAM EQUIVALENT - User Interface & Menu
// ====================================================================================
/**
 * MainLayer: Entry point and user interface controller
 * Equivalent to MainProgram (main.cob)
 * 
 * Features:
 * - Menu-driven interface with 4 options
 * - Routes user requests to appropriate operations
 * - Validates user input
 * - Implements continuous loop until user exits
 */
class MainLayer {
  constructor(operationsLayer) {
    this.operationsLayer = operationsLayer;
    this.continueFlag = true;
  }

  /**
   * Display main menu
   * Equivalent to COBOL: DISPLAY "Account Management System"
   */
  displayMenu() {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');
  }

  /**
   * Get and validate user choice
   * @returns {number} User's menu selection (1-4)
   */
  getUserChoice() {
    const choice = readline.questionInt('Enter your choice (1-4): ');
    return choice;
  }

  /**
   * Process user menu selection
   * Equivalent to COBOL: EVALUATE USER-CHOICE
   * @param {number} choice - User's menu selection
   */
  processMenuChoice(choice) {
    switch (choice) {
      case 1:
        // WHEN 1: CALL 'Operations' USING 'TOTAL '
        this.operationsLayer.viewBalance();
        break;
      case 2:
        // WHEN 2: CALL 'Operations' USING 'CREDIT'
        this.operationsLayer.creditAccount();
        break;
      case 3:
        // WHEN 3: CALL 'Operations' USING 'DEBIT '
        this.operationsLayer.debitAccount();
        break;
      case 4:
        // WHEN 4: MOVE 'NO' TO CONTINUE-FLAG
        this.continueFlag = false;
        break;
      default:
        // WHEN OTHER
        console.log('Invalid choice, please select 1-4.');
    }
  }

  /**
   * Main application loop
   * Equivalent to COBOL: PERFORM UNTIL CONTINUE-FLAG = 'NO'
   */
  runMainLoop() {
    console.log(''); // Add spacing
    while (this.continueFlag) {
      this.displayMenu();
      const choice = this.getUserChoice();
      this.processMenuChoice(choice);
      console.log(''); // Add spacing between iterations
    }
  }

  /**
   * Exit application
   * Equivalent to COBOL: DISPLAY "Exiting the program. Goodbye!" / STOP RUN
   */
  exitProgram() {
    console.log('Exiting the program. Goodbye!');
  }

  /**
   * Start the application - entry point
   */
  start() {
    this.runMainLoop();
    this.exitProgram();
  }
}

// ====================================================================================
// APPLICATION INITIALIZATION
// ====================================================================================
/**
 * Application Factory: Create and wire the three-tier architecture
 * This preserves the original COBOL design pattern in Node.js
 */
function initializeApplication() {
  // Layer 3: Create data persistence layer (equivalent to DataProgram)
  const dataLayer = new DataLayer();

  // Layer 2: Create business operations layer (equivalent to Operations)
  const operationsLayer = new OperationsLayer(dataLayer);

  // Layer 1: Create UI and menu layer (equivalent to MainProgram)
  const mainLayer = new MainLayer(operationsLayer);

  return mainLayer;
}

// ====================================================================================
// APPLICATION ENTRY POINT
// ====================================================================================
if (require.main === module) {
  try {
    const app = initializeApplication();
    app.start();
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
}

// Export for testing purposes
module.exports = {
  DataLayer,
  OperationsLayer,
  MainLayer,
  initializeApplication
};
