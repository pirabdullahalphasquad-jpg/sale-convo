import React, { useState, useMemo } from 'react';
import {
  Search,
  Package,
  TrendingUp,
  Clock,
  ChevronDown,
  ChevronUp,
  X,
  MapPin,
  Phone,
  User,
  CreditCard,
  Calendar,
  StickyNote,
  CheckCircle2,
  Truck,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus = 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';

interface OrderItem {
  name: string;
  qty: number;
  unitPrice: number;
}

interface Order {
  id: string;
  createdAt: string; // ISO date string
  customer: {
    name: string;
    phone: string;
  };
  items: OrderItem[];
  deliveryAddress: string;
  city: string;
  notes?: string;
  paymentMethod: 'COD' | 'Bank Transfer' | 'EasyPaisa' | 'JazzCash';
  status: OrderStatus;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const orderTotal = (order: Order): number =>
  order.items.reduce((sum, i) => sum + i.qty * i.unitPrice, 0) + 200; // +200 delivery

const formatPKR = (amount: number) =>
  `PKR ${amount.toLocaleString('en-PK')}`;

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
};

const formatTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
};

// ─── Status Badge Config ──────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; classes: string; icon: React.ReactNode }
> = {
  Pending: {
    label: 'Pending',
    classes: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: <AlertCircle className="w-3 h-3" />,
  },
  Confirmed: {
    label: 'Confirmed',
    classes: 'bg-blue-50 text-blue-800 border-blue-200',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  Shipped: {
    label: 'Shipped',
    classes: 'bg-violet-50 text-violet-800 border-violet-200',
    icon: <Truck className="w-3 h-3" />,
  },
  Delivered: {
    label: 'Delivered',
    classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  Cancelled: {
    label: 'Cancelled',
    classes: 'bg-red-50 text-red-800 border-red-200',
    icon: <RotateCcw className="w-3 h-3" />,
  },
};

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cfg.classes}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

// ─── Filter Tabs ──────────────────────────────────────────────────────────────

const TABS: Array<OrderStatus | 'All'> = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered'];

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  iconBg: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, sub, icon, iconBg }) => (
  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex items-start gap-4">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-extrabold text-slate-900 leading-tight mt-0.5">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

// ─── Order Details Drawer ─────────────────────────────────────────────────────

interface DrawerProps {
  order: Order | null;
  onClose: () => void;
  onStatusChange: (id: string, status: OrderStatus) => void;
}

const OrderDrawer: React.FC<DrawerProps> = ({ order, onClose, onStatusChange }) => {
  if (!order) return null;

  const total = orderTotal(order);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <aside
        id={`order-drawer-${order.id}`}
        className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div>
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-widest">Order</p>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">{order.id}</h2>
          </div>
          <button
            id={`close-drawer-btn-${order.id}`}
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Customer */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Customer
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 text-sm">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800">{order.customer.name}</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-slate-700">{order.customer.phone}</span>
              </div>
            </div>
          </section>

          {/* Items */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Items Ordered
            </h3>
            <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-500">Qty: {item.qty}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {formatPKR(item.qty * item.unitPrice)}
                  </p>
                </div>
              ))}
              {/* Delivery */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50">
                <p className="text-sm font-semibold text-slate-600">Standard Delivery</p>
                <p className="text-sm font-bold text-slate-700">PKR 200</p>
              </div>
              {/* Total */}
              <div className="flex items-center justify-between px-4 py-3.5 bg-emerald-50">
                <p className="text-sm font-extrabold text-emerald-900">Total</p>
                <p className="text-base font-extrabold text-emerald-800">{formatPKR(total)}</p>
              </div>
            </div>
          </section>

          {/* Delivery Address */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Delivery Address
            </h3>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700 leading-relaxed">
                {order.deliveryAddress}, <span className="font-semibold">{order.city}</span>
              </p>
            </div>
          </section>

          {/* Payment & Date */}
          <section className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Payment
              </h3>
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-800">{order.paymentMethod}</span>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Ordered
              </h3>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-700">{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </section>

          {/* Notes */}
          {order.notes && (
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Customer Notes
              </h3>
              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                <StickyNote className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900 italic">"{order.notes}"</p>
              </div>
            </section>
          )}

          {/* Status Update */}
          <section>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Update Status
            </h3>
            <div className="relative">
              <select
                id={`status-select-${order.id}`}
                value={order.status}
                onChange={(e) => onStatusChange(order.id, e.target.value as OrderStatus)}
                className="w-full appearance-none bg-white border border-slate-300 rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 cursor-pointer"
              >
                {(['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map(
                  (s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  )
                )}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Changing status here updates it instantly for your reference.
            </p>
          </section>
        </div>
      </aside>
    </>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<OrderStatus | 'All'>('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const totalRevenue = 0;
  const totalOrders = 0;
  const pendingDispatch = 0;

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchTab = activeTab === 'All' || o.status === activeTab;
      const matchSearch =
        !q ||
        o.customer.name.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.customer.phone.replace(/\s/g, '').includes(q.replace(/\s/g, ''));
      return matchTab && matchSearch;
    });
  }, [orders, activeTab, search]);

  // ── Tab counts ────────────────────────────────────────────────────────────
  const tabCount = (tab: OrderStatus | 'All') =>
    tab === 'All' ? orders.length : orders.filter((o) => o.status === tab).length;

  // ── Status update handler ─────────────────────────────────────────────────
  const handleStatusChange = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setSelectedOrder((prev) => (prev?.id === id ? { ...prev, status } : prev));
  };

  const toggleRow = (id: string) =>
    setExpandedRow((prev) => (prev === id ? null : id));

  return (
    <div id="order-management" className="space-y-6">
      {/* ── KPI Cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <KpiCard
          label="Total Revenue"
          value={formatPKR(totalRevenue)}
          sub="Non-cancelled orders"
          icon={<TrendingUp className="w-5 h-5 text-emerald-700" />}
          iconBg="bg-emerald-100"
        />
        <KpiCard
          label="Total Orders"
          value={totalOrders}
          sub="Via WhatsApp AI"
          icon={<Package className="w-5 h-5 text-blue-700" />}
          iconBg="bg-blue-100"
        />
        <KpiCard
          label="Pending Dispatch"
          value={pendingDispatch}
          sub="Awaiting fulfillment"
          icon={<Clock className="w-5 h-5 text-amber-700" />}
          iconBg="bg-amber-100"
        />
      </div>

      {/* ── Filter & Search ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-5 pt-5 pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="orders-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, or phone..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            />
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 flex-wrap">
            {TABS.map((tab) => (
              <button
                key={tab}
                id={`orders-tab-${tab.toLowerCase()}`}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tabCount(tab)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Orders Table ────────────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-t border-slate-100 bg-slate-50/70">
                {['Order ID', 'Date & Time', 'Customer', 'Items', 'Total', 'Payment', 'Status', ''].map(
                  (col) => (
                    <th
                      key={col}
                      className="px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-slate-400 text-sm">
                    No orders found. Orders placed via WhatsApp will appear here.
                  </td>
                </tr>
              )}

              {filtered.map((order) => {
                const total = orderTotal(order);
                const isExpanded = expandedRow === order.id;

                return (
                  <React.Fragment key={order.id}>
                    <tr
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                      onClick={() => toggleRow(order.id)}
                    >
                      {/* Order ID */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-bold text-slate-800 text-xs tracking-wide">
                          {order.id}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="text-xs font-semibold text-slate-700">
                          {formatDate(order.createdAt)}
                        </div>
                        <div className="text-[11px] text-slate-400">{formatTime(order.createdAt)}</div>
                      </td>

                      {/* Customer */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center shrink-0">
                            {order.customer.name[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-800 text-sm">
                              {order.customer.name}
                            </div>
                            <div className="text-[11px] text-slate-400">{order.customer.phone}</div>
                          </div>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="px-5 py-4 max-w-[220px]">
                        <div className="space-y-0.5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-xs text-slate-700 truncate">
                              <span className="font-semibold text-slate-500 mr-1">
                                {item.qty}x
                              </span>
                              {item.name}
                            </div>
                          ))}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900">{formatPKR(total)}</span>
                      </td>

                      {/* Payment */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {order.paymentMethod}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button
                            id={`view-order-btn-${order.id}`}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                            }}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 hover:underline cursor-pointer"
                          >
                            Details
                          </button>
                          <span className="text-slate-200">|</span>
                          <button
                            id={`expand-row-btn-${order.id}`}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(order.id);
                            }}
                            className="text-slate-400 hover:text-slate-700 cursor-pointer"
                            aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* ── Expandable row ─────────────────────────────────── */}
                    {isExpanded && (
                      <tr className="bg-slate-50/80">
                        <td colSpan={8} className="px-6 py-5">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* Delivery */}
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                Delivery Address
                              </p>
                              <div className="flex items-start gap-2">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                                <p className="text-sm text-slate-700">
                                  {order.deliveryAddress},{' '}
                                  <span className="font-semibold">{order.city}</span>
                                </p>
                              </div>
                            </div>

                            {/* Notes */}
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                Notes
                              </p>
                              {order.notes ? (
                                <p className="text-sm text-slate-700 italic">"{order.notes}"</p>
                              ) : (
                                <p className="text-sm text-slate-400">No notes</p>
                              )}
                            </div>

                            {/* Quick Status Update */}
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                                Update Status
                              </p>
                              <div className="relative">
                                <select
                                  id={`inline-status-select-${order.id}`}
                                  value={order.status}
                                  onChange={(e) =>
                                    handleStatusChange(order.id, e.target.value as OrderStatus)
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full appearance-none bg-white border border-slate-300 rounded-xl px-3 py-2 pr-8 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 cursor-pointer"
                                >
                                  {(
                                    [
                                      'Pending',
                                      'Confirmed',
                                      'Shipped',
                                      'Delivered',
                                      'Cancelled',
                                    ] as OrderStatus[]
                                  ).map((s) => (
                                    <option key={s} value={s}>
                                      {s}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-400">
            Showing {filtered.length} of {orders.length} orders
          </div>
        )}
      </div>

      {/* ── Order Details Drawer ─────────────────────────────────────────── */}
      <OrderDrawer
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};
