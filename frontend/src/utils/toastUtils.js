import { toast } from 'react-toastify';

export const mostrarToast = (tipo, mensaje) => {
  const config = {
    position: 'top-right',
    autoClose: 2500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true
  };

  switch (tipo) {
    case 'success':
    case 'exito':
      toast.success(`✅ ${mensaje}`, config);
      break;
    case 'error':
      toast.error(`❌ ${mensaje}`, config);
      break;
    case 'warning':
      toast.warning(`⚠️ ${mensaje}`, config);
      break;
    case 'info':
      toast.info(`ℹ️ ${mensaje}`, config);
      break;
    default:
      toast(mensaje, config);
  }
};
