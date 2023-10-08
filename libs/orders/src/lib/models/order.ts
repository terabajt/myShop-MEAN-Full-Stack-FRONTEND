import { User } from '@webappshop/users';
import { OrderItem } from './order-item';

export class Order {
    id?: string;
    orderItems?: OrderItem[];
    shippingAddress?: string;
    ShippingAddress2?: string;
    city?: string;
    zip?: string;
    country?: string;
    phone?: string;
    status?: number;
    totalPrice?: number;
    user?: User;
    dateOrdered?: string;
}
