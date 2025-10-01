import { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Plus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface CommonArea {
  id: string;
  nombre: string;
  descripcion: string | null;
  capacidad_maxima: number | null;
  costo_reserva: number;
  requiere_aprobacion: boolean;
  activa: boolean;
  horario_apertura: string | null;
  horario_cierre: string | null;
}

interface Reservation {
  id: string;
  area_id: string;
  fecha_reserva: string;
  hora_inicio: string;
  hora_fin: string;
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'cancelada' | 'completada';
  motivo: string | null;
  numero_personas: number | null;
  observaciones: string | null;
  areas_comunes: CommonArea;
}

export const Reservations = () => {
  const { residentData } = useAuth();
  const [areas, setAreas] = useState<CommonArea[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showNewReservation, setShowNewReservation] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newReservation, setNewReservation] = useState({
    area_id: '',
    fecha_reserva: '',
    hora_inicio: '',
    hora_fin: '',
    motivo: '',
    numero_personas: '',
    observaciones: '',
  });

  useEffect(() => {
    fetchAreas();
    if (residentData) {
      fetchReservations();
    }
  }, [residentData]);

  const fetchAreas = async () => {
    const { data, error } = await supabase
      .from('areas_comunes')
      .select('*')
      .eq('activa', true)
      .order('nombre');

    if (!error && data) {
      setAreas(data);
    }
  };

  const fetchReservations = async () => {
    if (!residentData) return;

    const { data, error } = await supabase
      .from('reservas_area')
      .select('*, areas_comunes(*)')
      .eq('residente_id', residentData.id)
      .order('fecha_reserva', { ascending: false })
      .order('hora_inicio', { ascending: false });

    if (!error && data) {
      setReservations(data as any);
    }
  };

  const handleCreateReservation = async () => {
    if (!residentData || !newReservation.area_id || !newReservation.fecha_reserva || !newReservation.hora_inicio || !newReservation.hora_fin) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const area = areas.find((a) => a.id === newReservation.area_id);
      const estado = area?.requiere_aprobacion ? 'pendiente' : 'aprobada';

      const { error } = await supabase.from('reservas_area').insert({
        residente_id: residentData.id,
        area_id: newReservation.area_id,
        fecha_reserva: newReservation.fecha_reserva,
        hora_inicio: newReservation.hora_inicio,
        hora_fin: newReservation.hora_fin,
        estado,
        motivo: newReservation.motivo || null,
        numero_personas: newReservation.numero_personas ? parseInt(newReservation.numero_personas) : null,
        observaciones: newReservation.observaciones || null,
      });

      if (error) throw error;

      setNewReservation({
        area_id: '',
        fecha_reserva: '',
        hora_inicio: '',
        hora_fin: '',
        motivo: '',
        numero_personas: '',
        observaciones: '',
      });
      setShowNewReservation(false);
      await fetchReservations();
    } catch (error: any) {
      console.error('Error creating reservation:', error);
      alert('Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    if (!confirm('¿Está seguro de cancelar esta reserva?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('reservas_area')
        .update({ estado: 'cancelada', updated_at: new Date().toISOString() })
        .eq('id', reservationId);

      if (error) throw error;

      await fetchReservations();
    } catch (error: any) {
      console.error('Error canceling reservation:', error);
      alert('Error al cancelar la reserva');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (estado: string) => {
    const colors: Record<string, string> = {
      'pendiente': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'aprobada': 'bg-green-100 text-green-700 border-green-200',
      'rechazada': 'bg-red-100 text-red-700 border-red-200',
      'cancelada': 'bg-gray-100 text-gray-700 border-gray-200',
      'completada': 'bg-blue-100 text-blue-700 border-blue-200',
    };
    return colors[estado] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const selectedArea = areas.find((a) => a.id === newReservation.area_id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900">Reservas de Áreas Comunes</h1>
        <button
          onClick={() => setShowNewReservation(!showNewReservation)}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition flex items-center gap-2"
        >
          {showNewReservation ? (
            <>
              <X className="w-5 h-5" />
              Cancelar
            </>
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Nueva Reserva
            </>
          )}
        </button>
      </div>

      {showNewReservation && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Crear Nueva Reserva</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Área Común *
              </label>
              <select
                value={newReservation.area_id}
                onChange={(e) => setNewReservation({ ...newReservation, area_id: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              >
                <option value="">Seleccione un área</option>
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nombre}
                    {area.costo_reserva > 0 && ` - $${area.costo_reserva}`}
                  </option>
                ))}
              </select>
            </div>

            {selectedArea && (
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-700">
                  <span className="font-medium">Descripción:</span>{' '}
                  {selectedArea.descripcion || 'No disponible'}
                </p>
                {selectedArea.capacidad_maxima && (
                  <p className="text-sm text-slate-700 mt-1">
                    <span className="font-medium">Capacidad máxima:</span>{' '}
                    {selectedArea.capacidad_maxima} personas
                  </p>
                )}
                {selectedArea.horario_apertura && selectedArea.horario_cierre && (
                  <p className="text-sm text-slate-700 mt-1">
                    <span className="font-medium">Horario:</span>{' '}
                    {selectedArea.horario_apertura} - {selectedArea.horario_cierre}
                  </p>
                )}
                {selectedArea.requiere_aprobacion && (
                  <p className="text-sm text-yellow-700 mt-2 font-medium">
                    Esta área requiere aprobación del administrador
                  </p>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={newReservation.fecha_reserva}
                  onChange={(e) => setNewReservation({ ...newReservation, fecha_reserva: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hora Inicio *
                </label>
                <input
                  type="time"
                  value={newReservation.hora_inicio}
                  onChange={(e) => setNewReservation({ ...newReservation, hora_inicio: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Hora Fin *
                </label>
                <input
                  type="time"
                  value={newReservation.hora_fin}
                  onChange={(e) => setNewReservation({ ...newReservation, hora_fin: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Motivo
                </label>
                <input
                  type="text"
                  value={newReservation.motivo}
                  onChange={(e) => setNewReservation({ ...newReservation, motivo: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="Reunión familiar, celebración, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Número de Personas
                </label>
                <input
                  type="number"
                  value={newReservation.numero_personas}
                  onChange={(e) => setNewReservation({ ...newReservation, numero_personas: e.target.value })}
                  min="1"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  placeholder="Ej: 10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Observaciones
              </label>
              <textarea
                value={newReservation.observaciones}
                onChange={(e) => setNewReservation({ ...newReservation, observaciones: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Información adicional..."
              />
            </div>

            <button
              onClick={handleCreateReservation}
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 font-medium"
            >
              {loading ? 'Creando reserva...' : 'Crear Reserva'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Mis Reservas</h2>

        {reservations.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No hay reservas registradas</p>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="p-4 border border-slate-200 rounded-lg hover:shadow-md transition"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {reservation.areas_comunes.nombre}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {reservation.areas_comunes.descripcion}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(reservation.estado)}`}>
                    {reservation.estado.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    {new Date(reservation.fecha_reserva).toLocaleDateString('es-ES', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>

                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    {reservation.hora_inicio} - {reservation.hora_fin}
                  </div>

                  {reservation.numero_personas && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="w-4 h-4" />
                      {reservation.numero_personas} personas
                    </div>
                  )}

                  {reservation.motivo && (
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4" />
                      {reservation.motivo}
                    </div>
                  )}
                </div>

                {reservation.observaciones && (
                  <p className="text-sm text-slate-600 mt-3 p-2 bg-slate-50 rounded">
                    {reservation.observaciones}
                  </p>
                )}

                {(reservation.estado === 'pendiente' || reservation.estado === 'aprobada') && (
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                      disabled={loading}
                      className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                    >
                      Cancelar Reserva
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Áreas Disponibles</h2>

        {areas.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No hay áreas comunes disponibles</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {areas.map((area) => (
              <div key={area.id} className="p-4 border border-slate-200 rounded-lg">
                <h3 className="font-bold text-slate-900 mb-2">{area.nombre}</h3>
                <p className="text-sm text-slate-600 mb-3">{area.descripcion}</p>

                <div className="space-y-1 text-sm text-slate-600">
                  {area.capacidad_maxima && (
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Capacidad: {area.capacidad_maxima} personas
                    </p>
                  )}

                  {area.horario_apertura && area.horario_cierre && (
                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {area.horario_apertura} - {area.horario_cierre}
                    </p>
                  )}

                  {area.costo_reserva > 0 && (
                    <p className="flex items-center gap-2 text-green-600 font-medium">
                      Costo: ${area.costo_reserva}
                    </p>
                  )}

                  {area.requiere_aprobacion && (
                    <p className="text-yellow-600 text-xs mt-2">Requiere aprobación</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
