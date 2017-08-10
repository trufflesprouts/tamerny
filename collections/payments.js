import { Mongo } from 'meteor/mongo';

export const Payments = new Mongo.Collection('payments');

SourceSchema = new SimpleSchema({
    type: {
      type: String,
      label: "Type",
      optional: false
    },
    company: {
      type: String,
      label: "Company",
      optional: true
    },
    username: {
      type: String,
      label: "User Name",
      optional: true
    },
    name: {
      type: String,
      label: "Name",
      optional: true
    },
    number: {
      type: String,
      label: "Number",
      optional: true
    },
    message: {
      type: String,
      label: "Type",
      optional: true
    },
    transaction_url: {
      type: String,
      label: "Transaction URL",
      optional: true
    },
    error_code: {
      type: String,
      label: "Error Code",
      optional: true
    }
});

PaymentSchema = new SimpleSchema({
  id: {
    type: String,
    label: "Payment ID",
    optional: false
  },
  status: {
    type: String,
    label: "Status",
    optional: false
  },
  amount: {
    type: Number,
    label: "Amount",
    optional: false
  },
  fee: {
    type: Number,
    label: "Fee",
    optional: true
  },
  currency: {
    type: String,
    label: "Currency",
    optional: false
  },
  refunded: {
    type: Number,
    label: "Refunded",
    optional: true
  },
  refunded_at: {
    type: Date,
    label: "Refunded At",
    optional: true
  },
  description: {
    type: String,
    label: "Description",
    optional: true
  },
  amount_format: {
    type: String,
    label: "Amount Format",
    optional: false
  },
  fee_format: {
    type: String,
    label: "Amount Format",
    optional: true
  },
  invoice_id: {
    type: String,
    label: "Invoice ID",
    optional: true
  },
  ip: {
    type: String,
    label: "IP",
    optional: true
  },
  created_at: {
    type: Date,
    label: "Created At",
    optional: false
  },
  updated_at: {
    type: Date,
    label: "Updated At",
    optional: false
  },
  source: {
    type: SourceSchema,
    label: "Source",
    optional: false
  }
});

PaymentsSchema = new SimpleSchema({
  userId: {
    type: String,
    label: "User ID",
    optional: false,
  },

  payment: {
    type: [PaymentSchema],
    label: "Payment",
    optional: true
  }
});

Payments.attachSchema(PaymentsSchema);
