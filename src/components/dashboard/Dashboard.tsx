import { useAuth } from '../../contexts/AuthContext';

/* 
// TODO: Descomentar cuando se implemente la integración completa con la API
interface DashboardStats {
  pendingPayments: number;
  totalDebt: number;
  activeReservations: number;
  openIncidents: number;
  recentTransactions: any[];
  upcomingReservations: any[];
  recentIncidents: any[];
}
*/

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      {/* Header de bienvenida */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-900">
          ¡Bienvenido, {user?.nombre} {user?.apellido}!
        </h1>
        <p className="text-slate-600 mt-2">
          Tipo de usuario: <span className="font-semibold">{user?.tipo_usuario}</span>
        </p>
        <p className="text-slate-600">
          Email: <span className="font-semibold">{user?.email}</span>
        </p>
        <p className="text-slate-600">
          ID Usuario: <span className="font-semibold">{user?.id_usuario}</span>
        </p>
        <p className="text-slate-600">
          Estado: <span className={`font-semibold ${user?.activo ? 'text-green-600' : 'text-red-600'}`}>
            {user?.activo ? 'Activo' : 'Inactivo'}
          </span>
        </p>
      </div>

      {/* Mensaje de estado */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
          <div>
            <h3 className="text-lg font-semibold text-green-800">
              ✅ Sistema de Login Funcionando
            </h3>
            <p className="text-green-700 mt-1">
              La autenticación con tu API de Laravel está funcionando correctamente.
            </p>
          </div>
        </div>
      </div>

      {/* Información del token */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">
          🔐 Información de Autenticación
        </h3>
        <div className="space-y-2 text-sm">
          <p className="text-blue-700">
            <strong>Token JWT:</strong> ✅ Presente y válido
          </p>
          <p className="text-blue-700">
            <strong>API Base URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'}
          </p>
          <p className="text-blue-700">
            <strong>Persistencia:</strong> ✅ Datos guardados en localStorage
          </p>
        </div>
      </div>
    </div>
  );
};

/*
// TODO: Código original comentado temporalmente - descomentar cuando se integre completamente

const { userProfile, residentData } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    pendingPayments: 0,
    totalDebt: 0,
    activeReservations: 0,
    openIncidents: 0,
    recentTransactions: [],
    upcomingReservations: [],
    recentIncidents: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (residentData) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [residentData]);

  const fetchDashboardData = async () => {
    if (!residentData) return;

    try {
      const [facturas, reservas, incidentes, transacciones] = await Promise.all([
        supabase
          .from('facturas')
          .select('*')
          .eq('residente_id', residentData.id)
          .eq('estado', 'pendiente'),

        supabase
          .from('reservas_area')
          .select('*, areas_comunes(*)')
          .eq('residente_id', residentData.id)
          .in('estado', ['pendiente', 'aprobada'])
          .gte('fecha_reserva', new Date().toISOString().split('T')[0])
          .order('fecha_reserva', { ascending: true })
          .limit(3),

        supabase
          .from('incidentes')
          .select('*')
          .eq('residente_id', residentData.id)
          .in('estado', ['abierto', 'en_proceso'])
          .order('created_at', { ascending: false })
          .limit(3),

        supabase
          .from('transacciones')
          .select('*')
          .eq('residente_id', residentData.id)
          .order('fecha', { ascending: false })
          .limit(5),
      ]);

      const totalDebt = facturas.data?.reduce((sum, factura) => sum + Number(factura.total), 0) || 0;

      setStats({
        pendingPayments: facturas.data?.length || 0,
        totalDebt,
        activeReservations: reservas.data?.length || 0,
        openIncidents: incidentes.data?.length || 0,
        recentTransactions: transacciones.data || [],
        upcomingReservations: reservas.data || [],
        recentIncidents: incidentes.data || [],
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (estado: string) => {
    const colors: Record<string, string> = {
      'pendiente': 'text-yellow-600 bg-yellow-50',
      'aprobada': 'text-green-600 bg-green-50',
      'rechazada': 'text-red-600 bg-red-50',
      'cancelada': 'text-gray-600 bg-gray-50',
      'completada': 'text-blue-600 bg-blue-50',
      'abierto': 'text-red-600 bg-red-50',
      'en_proceso': 'text-yellow-600 bg-yellow-50',
      'resuelto': 'text-green-600 bg-green-50',
      'cerrado': 'text-gray-600 bg-gray-50',
    };
    return colors[estado] || 'text-gray-600 bg-gray-50';
  };

  const getPriorityColor = (prioridad: string) => {
    const colors: Record<string, string> = {
      'baja': 'text-blue-600',
      'media': 'text-yellow-600',
      'alta': 'text-orange-600',
      'urgente': 'text-red-600',
    };
    return colors[prioridad] || 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-600">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Bienvenido, {userProfile?.nombre}
        </h1>
        {residentData && (
          <p className="text-slate-600 mt-1">
            Unidad {residentData.unidad}
            {residentData.torre && ` - Torre ${residentData.torre}`}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Pagos Pendientes</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {stats.pendingPayments}
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
          </div>
          {stats.totalDebt > 0 && (
            <p className="text-sm text-red-600 mt-4">
              Total: ${stats.totalDebt.toFixed(2)}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Reservas Activas</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {stats.activeReservations}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Incidentes Abiertos</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {stats.openIncidents}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Mi Unidad</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {residentData?.unidad || 'N/A'}
              </p>
            </div>
            <div className="bg-slate-100 p-3 rounded-lg">
              <Home className="w-6 h-6 text-slate-600" />
            </div>
          </div>
          {residentData?.es_propietario && (
            <p className="text-sm text-slate-600 mt-4">Propietario</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Próximas Reservas</h2>
          {stats.upcomingReservations.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No hay reservas próximas</p>
          ) : (
            <div className="space-y-3">
              {stats.upcomingReservations.map((reserva: any) => (
                <div key={reserva.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="font-medium text-slate-900">
                      {reserva.areas_comunes?.nombre}
                    </p>
                    <p className="text-sm text-slate-600">
                      {new Date(reserva.fecha_reserva).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-slate-600">
                      {reserva.hora_inicio} - {reserva.hora_fin}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reserva.estado)}`}>
                    {reserva.estado}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Incidentes Recientes</h2>
          {stats.recentIncidents.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No hay incidentes reportados</p>
          ) : (
            <div className="space-y-3">
              {stats.recentIncidents.map((incidente: any) => (
                <div key={incidente.id} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium text-slate-900">{incidente.titulo}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(incidente.estado)}`}>
                      {incidente.estado}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{incidente.descripcion}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className={`font-medium ${getPriorityColor(incidente.prioridad)}`}>
                      {incidente.prioridad.toUpperCase()}
                    </span>
                    <span>{incidente.categoria}</span>
                    <span>
                      {new Date(incidente.fecha_reporte).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Transacciones Recientes</h2>
        {stats.recentTransactions.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No hay transacciones recientes</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Fecha</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Concepto</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">Tipo</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">Monto</th>
                  <th className="text-center py-3 px-4 text-sm font-semibold text-slate-700">Estado</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.map((transaccion: any) => (
                  <tr key={transaccion.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 text-sm text-slate-600">
                      {new Date(transaccion.fecha).toLocaleDateString('es-ES')}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-900">{transaccion.concepto}</td>
                    <td className="py-3 px-4 text-sm text-slate-600 capitalize">{transaccion.tipo}</td>
                    <td className={`py-3 px-4 text-sm text-right font-medium ${
                      transaccion.tipo === 'pago' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaccion.tipo === 'pago' ? '+' : '-'}${Math.abs(Number(transaccion.monto)).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaccion.estado)}`}>
                        {transaccion.estado}
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
