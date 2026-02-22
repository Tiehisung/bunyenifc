import { RouterProvider } from "react-router-dom";
import applicationRouter from "./router";
import { Toaster } from "sonner";

function App() {
  return (
    <div>
      <RouterProvider router={applicationRouter} />
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={true}
        duration={3000}
        theme="light"
      />
    </div>
  );
}

export default App;
