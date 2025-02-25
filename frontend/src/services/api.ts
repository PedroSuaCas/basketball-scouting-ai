
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || ""; // Usa variable de entorno en producción

export const sendMessage = async (message: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include", // Permite enviar cookies si es necesario
            body: JSON.stringify({ message })
        });

        if (!response.ok) {
            throw new Error(`Error en la API: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Error en API:", error);
        return { error: "No se pudo conectar con el backend" };
    }
};
