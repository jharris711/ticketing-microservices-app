import mongoose from 'mongoose';
import Order, { OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// Versioning
schema.set(`versionKey`, `version`);
// schema.plugin(updateIfCurrentPlugin);
// Instead of using the updateIfCurrent plugin,
// define a pre-save hook for the schema
schema.pre('save', function (done) {
  // Set the $where property on the document to be saved
  // to the previous version of the document
  this.$where = {
    version:
      this.get('version') > 0 ? this.get('version') - 1 : this.get('version'),
  };

  // Call the done callback to signal that the hook is complete
  done();
});

schema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({ _id: attrs.id, ...attrs });
};
schema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

schema.methods.isReserved = async function () {
  // this === the ticket document (instance) that we
  // are calling 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        // Make Mongo look at all orders and find a
        // status where the status is provided in
        // this array
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', schema);

export default Ticket;
