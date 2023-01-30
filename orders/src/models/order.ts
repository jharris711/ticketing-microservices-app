import mongoose from 'mongoose';
import { OrderStatus } from '@jheezytix/common/build/events/types';
import { TicketDoc } from './ticket';

export { OrderStatus };
/**
 * Properties that go into creating an order
 */
interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

/**
 * Instance of an order
 */
interface OrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
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

orderSchema.set(`versionKey`, `version`);
// schema.plugin(updateIfCurrentPlugin);
// Instead of using the updateIfCurrent plugin,
// define a pre-save hook for the schema
orderSchema.pre('save', function (done) {
  // Set the $where property on the document to be saved
  // to the previous version of the document
  this.$where = {
    version:
      this.get('version') > 0 ? this.get('version') - 1 : this.get('version'),
  };

  // Call the done callback to signal that the hook is complete
  done();
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};
orderSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Order.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>(`Order`, orderSchema);

export default Order;
