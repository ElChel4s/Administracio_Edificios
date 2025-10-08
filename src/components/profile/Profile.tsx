import { User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Mi Perfil
        </h1>
        <div className="flex items-center space-x-4">
          <div className="bg-slate-100 p-4 rounded-full">
            <User className="w-8 h-8 text-slate-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {user?.nombre} {user?.apellido}
            </h2>
            <p className="text-slate-600">{user?.email}</p>
            <p className="text-slate-600">Tipo: {user?.tipo_usuario}</p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center">
          <User className="w-6 h-6 text-yellow-600 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800">
              🚧 En Desarrollo
            </h3>
            <p className="text-yellow-700 mt-1">
              La gestión completa del perfil se integrará con la API de Laravel próximamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/*
// TODO: Código original comentado temporalmente

interface Vehicle {
  id: string;
  placa: string;
  tipo: 'auto' | 'moto' | 'bicicleta' | 'otro';
  marca: string | null;
  modelo: string | null;
  color: string | null;
  activo: boolean;
}

export const Profile = () => {
  const { userProfile, residentData, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showAddVehicle, setShowAddVehicle] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
  });

  const [newVehicle, setNewVehicle] = useState({
    placa: '',
    tipo: 'auto' as 'auto' | 'moto' | 'bicicleta' | 'otro',
    marca: '',
    modelo: '',
    color: '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        nombre: userProfile.nombre,
        telefono: userProfile.telefono || '',
      });
    }
  }, [userProfile]);

  useEffect(() => {
    if (residentData) {
      fetchVehicles();
    }
  }, [residentData]);

  const fetchVehicles = async () => {
    if (!residentData) return;

    const { data, error } = await supabase
      .from('vehiculos')
      .select('*')
      .eq('residente_id', residentData.id)
      .eq('activo', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setVehicles(data);
    }
  };

  const handleUpdateProfile = async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          nombre: formData.nombre,
          telefono: formData.telefono || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userProfile.id);

      if (error) throw error;

      await refreshProfile();
      setEditing(false);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert('Error al actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVehicle = async () => {
    if (!residentData || !newVehicle.placa) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('vehiculos').insert({
        residente_id: residentData.id,
        placa: newVehicle.placa.toUpperCase(),
        tipo: newVehicle.tipo,
        marca: newVehicle.marca || null,
        modelo: newVehicle.modelo || null,
        color: newVehicle.color || null,
      });

      if (error) throw error;

      setNewVehicle({
        placa: '',
        tipo: 'auto',
        marca: '',
        modelo: '',
        color: '',
      });
      setShowAddVehicle(false);
      await fetchVehicles();
    } catch (error: any) {
      console.error('Error adding vehicle:', error);
      alert('Error al agregar vehículo');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    if (!confirm('¿Está seguro de eliminar este vehículo?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('vehiculos')
        .update({ activo: false })
        .eq('id', vehicleId);

      if (error) throw error;

      await fetchVehicles();
    } catch (error: any) {
      console.error('Error deleting vehicle:', error);
      alert('Error al eliminar vehículo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Mi Perfil</h1>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900">Información Personal</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition"
            >
              Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditing(false);
                  if (userProfile) {
                    setFormData({
                      nombre: userProfile.nombre,
                      telefono: userProfile.telefono || '',
                    });
                  }
                }}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Nombre Completo
              </div>
            </label>
            {editing ? (
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
              />
            ) : (
              <p className="text-slate-900 py-2">{userProfile?.nombre}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Correo Electrónico
              </div>
            </label>
            <p className="text-slate-900 py-2">{userProfile?.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Teléfono
              </div>
            </label>
            {editing ? (
              <input
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                placeholder="Ej: +52 1 234 567 8900"
              />
            ) : (
              <p className="text-slate-900 py-2">{userProfile?.telefono || 'No registrado'}</p>
            )}
          </div>

          {residentData && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Unidad
                </div>
              </label>
              <p className="text-slate-900 py-2">
                {residentData.unidad}
                {residentData.torre && ` - Torre ${residentData.torre}`}
                {residentData.piso && ` - Piso ${residentData.piso}`}
              </p>
            </div>
          )}
        </div>

        {residentData && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Tipo de residencia:{' '}
              <span className="font-medium text-slate-900">
                {residentData.es_propietario ? 'Propietario' : 'Inquilino'}
              </span>
            </p>
            {residentData.fecha_ingreso && (
              <p className="text-sm text-slate-600 mt-1">
                Fecha de ingreso:{' '}
                <span className="font-medium text-slate-900">
                  {new Date(residentData.fecha_ingreso).toLocaleDateString('es-ES')}
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      {residentData && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Car className="w-6 h-6" />
              Mis Vehículos
            </h2>
            <button
              onClick={() => setShowAddVehicle(!showAddVehicle)}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Vehículo
            </button>
          </div>

          {showAddVehicle && (
            <div className="mb-6 p-4 bg-slate-50 rounded-lg">
              <h3 className="font-medium text-slate-900 mb-4">Nuevo Vehículo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Placa *
                  </label>
                  <input
                    type="text"
                    value={newVehicle.placa}
                    onChange={(e) => setNewVehicle({ ...newVehicle, placa: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="ABC-1234"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo *
                  </label>
                  <select
                    value={newVehicle.tipo}
                    onChange={(e) => setNewVehicle({ ...newVehicle, tipo: e.target.value as any })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                  >
                    <option value="auto">Auto</option>
                    <option value="moto">Moto</option>
                    <option value="bicicleta">Bicicleta</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={newVehicle.marca}
                    onChange={(e) => setNewVehicle({ ...newVehicle, marca: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="Toyota"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Modelo
                  </label>
                  <input
                    type="text"
                    value={newVehicle.modelo}
                    onChange={(e) => setNewVehicle({ ...newVehicle, modelo: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="Corolla"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Color
                  </label>
                  <input
                    type="text"
                    value={newVehicle.color}
                    onChange={(e) => setNewVehicle({ ...newVehicle, color: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    placeholder="Blanco"
                  />
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleAddVehicle}
                    disabled={loading || !newVehicle.placa}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          )}

          {vehicles.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No hay vehículos registrados</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="bg-slate-100 p-2 rounded-lg">
                      <Car className="w-5 h-5 text-slate-600" />
                    </div>
                    <button
                      onClick={() => handleDeleteVehicle(vehicle.id)}
                      className="text-red-600 hover:text-red-700 transition"
                      title="Eliminar vehículo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="font-bold text-lg text-slate-900 mb-1">{vehicle.placa}</p>
                  <p className="text-sm text-slate-600 capitalize">{vehicle.tipo}</p>
                  {(vehicle.marca || vehicle.modelo) && (
                    <p className="text-sm text-slate-600">
                      {vehicle.marca} {vehicle.modelo}
                    </p>
                  )}
                  {vehicle.color && (
                    <p className="text-sm text-slate-600">{vehicle.color}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
*/
