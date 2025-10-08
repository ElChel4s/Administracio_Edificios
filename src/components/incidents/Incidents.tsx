import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Incidents = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Incidentes y Reportes
        </h1>
        <p className="text-slate-600">
          Hola {user?.nombre}, aquí podrás reportar y hacer seguimiento de incidentes.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800">
              🚧 En Desarrollo
            </h3>
            <p className="text-yellow-700 mt-1">
              El sistema de incidentes se integrará con la API de Laravel próximamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/*
// TODO: Código original comentado temporalmente

interface Incident {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: 'mantenimiento' | 'seguridad' | 'limpieza' | 'ruido' | 'otro';
  prioridad: 'baja' | 'media' | 'alta' | 'urgente';
  estado: 'abierto' | 'en_proceso' | 'resuelto' | 'cerrado';
  ubicacion: string | null;
  fecha_reporte: string;
  fecha_resolucion: string | null;
  respuesta_admin: string | null;
}

export const Incidents = () => {
  const { residentData } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [showNewIncident, setShowNewIncident] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'abierto' | 'en_proceso' | 'resuelto'>('todos');

  const [newIncident, setNewIncident] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'mantenimiento' as 'mantenimiento' | 'seguridad' | 'limpieza' | 'ruido' | 'otro',
    prioridad: 'media' as 'baja' | 'media' | 'alta' | 'urgente',
    ubicacion: '',
  });

  useEffect(() => {
    if (residentData) {
      fetchIncidents();
    }
  }, [residentData]);

  const fetchIncidents = async () => {
    if (!residentData) return;

    const { data, error } = await supabase
      .from('incidentes')
      .select('*')
      .eq('residente_id', residentData.id)
      .order('fecha_reporte', { ascending: false });

    if (!error && data) {
      setIncidents(data);
    }
  };

  const handleCreateIncident = async () => {
    if (!residentData || !newIncident.titulo || !newIncident.descripcion) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('incidentes').insert({
        residente_id: residentData.id,
        titulo: newIncident.titulo,
        descripcion: newIncident.descripcion,
        categoria: newIncident.categoria,
        prioridad: newIncident.prioridad,
        ubicacion: newIncident.ubicacion || null,
      });

      if (error) throw error;

      setNewIncident({
        titulo: '',
        descripcion: '',
        categoria: 'mantenimiento',
        prioridad: 'media',
        ubicacion: '',
      });
      setShowNewIncident(false);
      await fetchIncidents();
    } catch (error: any) {
      console.error('Error creating incident:', error);
      alert('Error al crear el incidente');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (estado: string) => {
    const colors: Record<string, string> = {
      'abierto': 'bg-red-100 text-red-700 border-red-200',
      'en_proceso': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'resuelto': 'bg-green-100 text-green-700 border-green-200',
      'cerrado': 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[estado] || 'bg-gray-100 text-gray-700 border-gray-200';
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

  const getCategoryIcon = (categoria: string) => {
    return <AlertTriangle className="w-5 h-5" />;
  };

  const filteredIncidents = filter === 'todos'
    ? incidents
    : incidents.filter(inc => inc.estado === filter);

  const countByStatus = (estado: string) => {
    return incidents.filter(inc => inc.estado === estado).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Reporte de Incidentes</h1>
        <button
          onClick={() => setShowNewIncident(!showNewIncident)}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition flex items-center gap-2"
        >
          {showNewIncident ? (
            <>
              <X className="w-5 h-5" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Nuevo Incidente
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Abiertos</p>
          <p className="text-2xl font-bold text-red-600">{countByStatus('abierto')}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-600">En Proceso</p>
          <p className="text-2xl font-bold text-yellow-600">{countByStatus('en_proceso')}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Resueltos</p>
          <p className="text-2xl font-bold text-green-600">{countByStatus('resuelto')}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <p className="text-sm text-slate-600">Cerrados</p>
          <p className="text-2xl font-bold text-gray-600">{countByStatus('cerrado')}</p>
        </div>
      </div>

      {showNewIncident && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Reportar Nuevo Incidente</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={newIncident.titulo}
                onChange={(e) => setNewIncident({ ...newIncident, titulo: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Ej: Fuga de agua en el pasillo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Descripción *
              </label>
              <textarea
                value={newIncident.descripcion}
                onChange={(e) => setNewIncident({ ...newIncident, descripcion: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Describa el incidente con el mayor detalle posible..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Categoría *
                </label>
                <select
                  value={newIncident.categoria}
                  onChange={(e) => setNewIncident({ ...newIncident, categoria: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="seguridad">Seguridad</option>
                  <option value="limpieza">Limpieza</option>
                  <option value="ruido">Ruido</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Prioridad *
                </label>
                <select
                  value={newIncident.prioridad}
                  onChange={(e) => setNewIncident({ ...newIncident, prioridad: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={newIncident.ubicacion}
                  onChange={(e) => setNewIncident({ ...newIncident, ubicacion: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="Ej: Piso 3, Pasillo A"
                />
              </div>
            </div>

            <button
              onClick={handleCreateIncident}
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 font-medium"
            >
              {loading ? 'Reportando incidente...' : 'Reportar Incidente'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Mis Incidentes</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('todos')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'todos'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('abierto')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'abierto'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Abiertos
            </button>
            <button
              onClick={() => setFilter('en_proceso')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'en_proceso'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              En Proceso
            </button>
            <button
              onClick={() => setFilter('resuelto')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'resuelto'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Resueltos
            </button>
          </div>
        </div>

        {filteredIncidents.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No hay incidentes para mostrar</p>
        ) : (
          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <div key={incident.id} className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${
                      incident.estado === 'abierto' ? 'bg-red-100' :
                      incident.estado === 'en_proceso' ? 'bg-yellow-100' :
                      incident.estado === 'resuelto' ? 'bg-green-100' :
                      'bg-gray-100'
                    }`}>
                      {getCategoryIcon(incident.categoria)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-900">{incident.titulo}</h3>
                        <span className={`text-xs font-bold uppercase ${getPriorityColor(incident.prioridad)}`}>
                          {incident.prioridad}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 capitalize mb-2">
                        {incident.categoria}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(incident.estado)}`}>
                    {incident.estado.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <p className="text-sm text-slate-700 mb-3 bg-slate-50 p-3 rounded-lg">
                  {incident.descripcion}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mb-3">
                  {incident.ubicacion && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {incident.ubicacion}
                    </div>
                  )}
                  <div>
                    Reportado: {new Date(incident.fecha_reporte).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  {incident.fecha_resolucion && (
                    <div>
                      Resuelto: {new Date(incident.fecha_resolucion).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                  )}
                </div>

                {incident.respuesta_admin && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-blue-900 mb-1">
                          Respuesta del Administrador:
                        </p>
                        <p className="text-sm text-blue-800">{incident.respuesta_admin}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
*/
