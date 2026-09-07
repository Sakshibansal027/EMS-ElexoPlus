import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import AppRoutes from "./routes/AppRoutes";
import AppInitLoader from "./components/common/AppInitLoader";

function App() {
  return (
    <AppInitLoader>
      <ThemeProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </ThemeProvider>
    </AppInitLoader>
  );
}

export default App;
