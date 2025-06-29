import { useLocation } from "react-router-dom";
import { FaBars, FaClipboardList } from "react-icons/fa";

const pageTitles = {
  "/": "Insumos",
  "/clientes": "Clientes",
  "/productos": "Productos",
  "/movimientos": "Inventario",
  "/ventas": "Ventas",
  "/pedidos-en-curso": "Pedidos en Curso",
  "/pedidos-completados": "Pedidos Completados",
  "/reportes": "Reportes"
};

function Topbar({ toggleSidebar }) {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "";

  return (
    <header className="flex items-center justify-between bg-white border-b px-4 py-2 shadow-md md:ml-0">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="lg:hidden p-2">
           <FaBars className="text-xl" />
        </button>

        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      </div>

      <div className="relative">
        <FaClipboardList className="text-xl text-black" />
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          4
        </span>
      </div>
    </header>
  );
}

export default Topbar;
