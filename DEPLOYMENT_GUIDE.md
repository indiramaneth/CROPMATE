# Commission System Changes Deployment Guide

This guide explains how to deploy the changes to the commission system.

## Changes Summary

1. **Admin commission reduced from 5% to 2% for farmers**

   - Updated in order.actions.ts where commission is calculated
   - Updated in frontend displays

2. **Added 2% commission for drivers**
   - New system for collecting commission from drivers
   - Drivers can upload bank slips as proof of payment
   - Admin can view and manage all driver commission payments

## Deployment Steps

### 1. Database Schema Changes

Several changes were made to the Prisma schema:

```prisma
// Added to DeliveryRequest model
adminCommissionPaid Boolean @default(false) // Track if 2% commission is paid to admin
paymentProof      String?  // URL to bank slip proof of payment
```

Push these schema changes to your production database:

```bash
npx prisma db push
```

### 2. Run Migration Script

After pushing the schema changes, run the migration script to update existing delivery requests:

```bash
node -e "import('./src/scripts/migrate-delivery-requests.js').then(m => m.default())"
```

### 3. Update Frontend Components

The following new components were created:

- AdminCommissionCard for drivers
- Driver Commission page for admin

### 4. Verify Changes

1. Log in as a driver and check the earnings page. You should see:

   - Admin commission card showing 2% of earnings
   - Ability to upload bank slip for payment

2. Log in as an admin and check the driver commissions page:
   - Should show all driver commissions (2% of their earnings)
   - Should display status (paid/pending)
   - Should allow viewing payment proofs

## Rollback Plan

If issues occur:

1. Revert the commission percentage changes in the code
2. Remove the new admin commission fields from the schema
3. Deploy the reverted code

## Notes

- **Test in staging first** if available
- Monitor the system after deployment for any issues
- Bank details are currently using dummy values - update them with real details when ready
