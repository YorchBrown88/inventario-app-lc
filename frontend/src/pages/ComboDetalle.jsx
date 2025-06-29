import { useParams } from 'react-router-dom';

function ComboDetalle() {
  const { id } = useParams();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">👀 Detalle del Combo</h1>
      <p>ID del combo: {id}</p>
      {/* Aquí cargarás los datos del combo con fetch si lo deseas */}
    </div>
  );
}

export default ComboDetalle;
