import { Link, useLocation } from "react-router-dom";
import {
  FaBoxOpen,
  FaUsers,
  FaExchangeAlt,
  FaChartBar,
  FaClipboardList,
  FaPlusSquare,
  FaReceipt,
  FaLayerGroup
} from "react-icons/fa";

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {
  const location = useLocation();

  const links = [
    { to: "/", icon: <FaBoxOpen />, label: "Insumos" },
    { to: "/clientes", icon: <FaUsers />, label: "Clientes" },
    { to: "/productos", icon: <FaPlusSquare />, label: "Productos" },
    { to: "/combos", icon: <FaLayerGroup />, label: "Combos" },
    { to: "/movimientos", icon: <FaExchangeAlt />, label: "Movimientos" },
    { to: "/ventas", icon: <FaReceipt />, label: "Ventas" },
    { to: "/pedidos-en-curso", icon: <FaClipboardList />, label: "Pedidos en Curso" },
    { to: "/pedidos-completados", icon: <FaClipboardList />, label: "Pedidos Completados" },
    { to: "/reportes", icon: <FaChartBar />, label: "Reportes" },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeSidebar}
      />

      <aside
        className={`fixed z-50 top-0 left-0 h-full w-64 bg-yellow-500 shadow-lg transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:shadow-none`}
      >
        <div className="p-4 font-bold text-white text-xl border-b border-yellow-400">📦 Inventario</div>

        <nav className="mt-4">
          {links.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center px-4 py-2 text-white hover:bg-yellow-600 transition-colors ${
                location.pathname === to ? "bg-yellow-600 font-bold" : ""
              }`}
              onClick={closeSidebar}
            >
              <span className="mr-2">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
