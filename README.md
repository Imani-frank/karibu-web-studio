# KGL Groceries LTD Management System

## Project Overview

Karibu Groceries LTD (KGL) is a wholesale produce distributor specializing in cereals like beans, grain maize, cow peas, G-nuts, and soybeans. The company operates two branches in different locations. This project aims to transition KGL from manual record-keeping in "black books" to a digital software solution that automates procurement, sales, and credit tracking.

---

## Core Features

### 1. Produce Procurement

* 
**Sourcing**: Records produce obtained from individual dealers (minimum 1000kg), other companies, and KGL’s private farms in Maganjo and Matugga.


* 
**Detailed Logs**: Captures name, type, date, time, tonnage (kg), cost (UgX), dealer name, contact, and sales price.


* 
**Input Validation**: Ensures produce types use alphabets only (min 2 characters) and tonnage/cost meet specific numeric lengths.



### 2. Sales Management
**Inventory Tracking**: Automatically reduces stock tonnage whenever a sale is recorded.
* 
**Availability Checks**: Only products currently in stock can be sold; the system notifies the manager when items run out.
* 
**Sales Records**: Captures buyer details, amount paid, and the identity of the sales agent.

### 3. Credit & Deferred Payments
* 
**Trusted Buyers**: Allows for separate recording of produce taken on credit.
* 
**Legal Documentation**: Requires the buyer's National ID (NIN), location, contact, amount due, and the specific due date.
  
---

## User Roles & Permissions

| Role | Responsibilities |
| --- | --- |
| **Manager** | Records procurement, manages stock/prices, and can record sales.

 |
| **Sales Agent** | Records sales and credit transactions; strictly prohibited from entering procurement.

 |
| **Director** | Authorized only to view aggregated sales totals and summaries across all branches.

 |

---

## Business Rules

* 
**Pricing**: Sales prices are pre-set by the manager and pre-populated for agents.
* 
**Branch Access**: Agents record sales only at their respective assigned branch.
* 
**Role Integrity**: No sales agent is allowed to record any produce entry/procurement.

---

## Technical Stack

* 
**Frontend**: HTML, CSS, JavaScript.
  
* 
**Backend**: Node.js (Express.js).

* 
**Database**: MongoDB.

## Project Constraints

* 
**Duration**: The project is designed to be implemented individually over 6 weeks.
  
* 
**Accessibility**: The solution must be a web-based system accessible via modern browsers.

