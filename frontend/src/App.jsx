import ClienteDetalle from "./pages/ClienteDetalle"; // al inicio
import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Insumos from "./pages/Insumos";
import Clientes from "./pages/Clientes";
import CrearProducto from "./pages/CrearProducto";
import Productos from "./pages/Productos";
import Movimientos from "./pages/Movimientos";
import Ventas from "./pages/Ventas";
import PedidosEnCurso from "./pages/PedidosEnCurso";
import PedidosCompletados from "./pages/PedidosCompletados";
import Reportes from "./pages/Reportes";
import PedidoDetalle from "./pages/PedidoDetalle";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Combos from './pages/Combos';



function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen">
      <Sidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} />
      <div className="flex-1 flex flex-col">
        <Topbar toggleSidebar={toggleSidebar} />
        <main className="p-4 overflow-y-auto flex-1 bg-gray-50">
          <Routes>
            <Route path="/" element={<Insumos />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/clientes/:id" element={<ClienteDetalle />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/combos" element={<Combos />} />
            <Route path="/crear-producto" element={<CrearProducto />} />
            <Route path="/movimientos" element={<Movimientos />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/pedidos-en-curso" element={<PedidosEnCurso />} />
            <Route path="/pedidos-completados" element={<PedidosCompletados />} />
            <Route path="/pedidos-en-curso/:id" element={<PedidoDetalle />} />
            <Route path="/reportes" element={<Reportes />} />
          </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
        </main>
      </div>
    </div>
  );
}

export default App;
