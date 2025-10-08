import { DollarSign } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Billing = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Facturación y Pagos
        </h1>
        <p className="text-slate-600">
          Hola {user?.nombre}, aquí podrás ver tus facturas y realizar pagos.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center">
          <DollarSign className="w-6 h-6 text-yellow-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800">
              🚧 En Desarrollo
            </h3>
            <p className="text-yellow-700 mt-1">
              El sistema de facturación se integrará con la API de Laravel próximamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/*
// TODO: Código original comentado temporalmente

interface Invoice {
  id: string;
  numero_factura: string;
  fecha_emision: string;
  fecha_vencimiento: string;
  subtotal: number;
  impuestos: number;
  total: number;
  estado: 'pendiente' | 'pagada' | 'vencida' | 'cancelada';
}

interface InvoiceDetail {
  id: string;
  concepto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface Transaction {
  id: string;
  tipo: 'pago' | 'cargo' | 'multa' | 'ajuste';
  concepto: string;
  monto: number;
  fecha: string;
  estado: 'pendiente' | 'completada' | 'cancelada';
  metodo_pago: string | null;
  referencia: string | null;
}

export const Billing = () => {
  const { residentData } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'todas' | 'pendiente' | 'pagada' | 'vencida'>('todas');

  useEffect(() => {
    if (residentData) {
      fetchInvoices();
      fetchTransactions();
    }
  }, [residentData]);

  const fetchInvoices = async () => {
    if (!residentData) return;

    const { data, error } = await supabase
      .from('facturas')
      .select('*')
      .eq('residente_id', residentData.id)
      .order('fecha_emision', { ascending: false });

    if (!error && data) {
      setInvoices(data);
    }
  };

  const fetchTransactions = async () => {
    if (!residentData) return;

    const { data, error } = await supabase
      .from('transacciones')
      .select('*')
      .eq('residente_id', residentData.id)
      .order('fecha', { ascending: false });

    if (!error && data) {
      setTransactions(data);
    }
  };

  const fetchInvoiceDetails = async (invoiceId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('detalle_factura')
      .select('*')
      .eq('factura_id', invoiceId);

    if (!error && data) {
      setInvoiceDetails(data);
    }
    setLoading(false);
  };

  const handleViewInvoice = (invoiceId: string) => {
    if (selectedInvoice === invoiceId) {
      setSelectedInvoice(null);
      setInvoiceDetails([]);
    } else {
      setSelectedInvoice(invoiceId);
      fetchInvoiceDetails(invoiceId);
    }
  };

  const getStatusColor = (estado: string) => {
    const colors: Record<string, string> = {
      'pendiente': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'pagada': 'bg-green-100 text-green-700 border-green-200',
      'vencida': 'bg-red-100 text-red-700 border-red-200',
      'cancelada': 'bg-gray-100 text-gray-700 border-gray-200',
      'completada': 'bg-green-100 text-green-700 border-green-200',
    };
    return colors[estado] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const filteredInvoices = filter === 'todas'
    ? invoices
    : invoices.filter(inv => inv.estado === filter);

  const totalPendiente = invoices
    .filter(inv => inv.estado === 'pendiente' || inv.estado === 'vencida')
    .reduce((sum, inv) => sum + Number(inv.total), 0);

  const totalPagado = invoices
    .filter(inv => inv.estado === 'pagada')
    .reduce((sum, inv) => sum + Number(inv.total), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Pagos y Facturación</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Saldo Pendiente</p>
              <p className="text-3xl font-bold text-red-600 mt-2">
                ${totalPendiente.toFixed(2)}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Pagado</p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ${totalPagado.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Facturas</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {invoices.length}
              </p>
            </div>
            <div className="bg-slate-100 p-3 rounded-lg">
              <FileText className="w-6 h-6 text-slate-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Facturas</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('todas')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'todas'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('pendiente')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'pendiente'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFilter('pagada')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'pagada'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Pagadas
            </button>
            <button
              onClick={() => setFilter('vencida')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'vencida'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Vencidas
            </button>
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No hay facturas para mostrar</p>
        ) : (
          <div className="space-y-3">
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="border border-slate-200 rounded-lg">
                <div
                  className="p-4 cursor-pointer hover:bg-slate-50 transition"
                  onClick={() => handleViewInvoice(invoice.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-slate-900">
                          Factura #{invoice.numero_factura}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(invoice.estado)}`}>
                          {invoice.estado.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Emisión: {new Date(invoice.fecha_emision).toLocaleDateString('es-ES')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Vencimiento: {new Date(invoice.fecha_vencimiento).toLocaleDateString('es-ES')}
                        </div>
                        <div className="flex items-center gap-2 font-medium text-slate-900">
                          <DollarSign className="w-4 h-4" />
                          Total: ${Number(invoice.total).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <button className="ml-4 p-2 hover:bg-slate-100 rounded-lg transition">
                      <Download className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                </div>

                {selectedInvoice === invoice.id && (
                  <div className="border-t border-slate-200 p-4 bg-slate-50">
                    {loading ? (
                      <p className="text-center text-slate-600">Cargando detalles...</p>
                    ) : (
                      <>
                        <h4 className="font-bold text-slate-900 mb-3">Detalle de Factura</h4>
                        <div className="bg-white rounded-lg overflow-hidden">
                          <table className="w-full">
                            <thead className="bg-slate-100">
                              <tr>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                                  Concepto
                                </th>
                                <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">
                                  Cantidad
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                                  Precio Unit.
                                </th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                                  Subtotal
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {invoiceDetails.map((detail) => (
                                <tr key={detail.id} className="border-b border-slate-100">
                                  <td className="py-3 px-4 text-sm text-slate-900">
                                    {detail.concepto}
                                  </td>
                                  <td className="py-3 px-4 text-sm text-slate-600 text-center">
                                    {detail.cantidad}
                                  </td>
                                  <td className="py-3 px-4 text-sm text-slate-600 text-right">
                                    ${Number(detail.precio_unitario).toFixed(2)}
                                  </td>
                                  <td className="py-3 px-4 text-sm font-medium text-slate-900 text-right">
                                    ${Number(detail.subtotal).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-slate-50">
                              <tr>
                                <td colSpan={3} className="py-3 px-4 text-sm font-medium text-right">
                                  Subtotal:
                                </td>
                                <td className="py-3 px-4 text-sm font-medium text-right">
                                  ${Number(invoice.subtotal).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={3} className="py-3 px-4 text-sm font-medium text-right">
                                  Impuestos:
                                </td>
                                <td className="py-3 px-4 text-sm font-medium text-right">
                                  ${Number(invoice.impuestos).toFixed(2)}
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={3} className="py-3 px-4 text-sm font-bold text-right">
                                  Total:
                                </td>
                                <td className="py-3 px-4 text-sm font-bold text-right">
                                  ${Number(invoice.total).toFixed(2)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Historial de Transacciones</h2>

        {transactions.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No hay transacciones registradas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Fecha
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Concepto
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Tipo
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">
                    Método
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">
                    Monto
                  </th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {new Date(transaction.fecha).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-900">
                      {transaction.concepto}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 capitalize">
                      {transaction.tipo}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 capitalize">
                      {transaction.metodo_pago || 'N/A'}
                    </td>
                    <td className={`py-3 px-4 text-sm text-right font-medium ${
                      transaction.tipo === 'pago' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.tipo === 'pago' ? '+' : '-'}$
                      {Math.abs(Number(transaction.monto)).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.estado)}`}>
                        {transaction.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
*/
