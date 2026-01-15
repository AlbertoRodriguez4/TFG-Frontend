import { defineStore } from "pinia"
import { ref, computed } from "vue"

// --- Interfaces ---
export interface UserRoom {
    userid: number;
    roomid: number;
    // Opcionales dependiendo de si el backend manda el objeto completo
    user?: any;
    room?: any;
}

export interface UserRoomResponseDTO {
    name: string;
    level: number;
    experience: number;
    strength: number;
    endurance: number;
    consistencyStreak: number;
}

const BASE_URL = "http://localhost:6873";

export const useUserRoomStore = defineStore('userRoom', () => {
    // --- State ---
    const allUserRooms = ref<UserRoom[]>([]);
    const currentUserRooms = ref<UserRoom[]>([]);
    const currentRoomMembers = ref<UserRoomResponseDTO[]>([]);
    
    // Estados de carga y error (útiles para la UI)
    const loading = ref(false);
    const error = ref<string | null>(null);

    // --- Helpers ---
    const getAuthHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
    });

    // --- Actions ---

    // 1. Obtener todas las relaciones
    async function fetchAllUserRooms() {
        loading.value = true;
        try {
            const response = await fetch(`${BASE_URL}/api/UserRoom`, {
                method: "GET",
                mode: "cors",
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            allUserRooms.value = data;
        } catch (err: any) {
            console.error("Error fetching all user rooms:", err);
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    // 2. Obtener salas de un usuario específico
    async function fetchRoomsByUserId(userId: number) {
        loading.value = true;
        try {
            const response = await fetch(`${BASE_URL}/api/UserRoom/user/${userId}`, {
                method: "GET",
                mode: "cors",
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            currentUserRooms.value = data;
        } catch (err: any) {
            console.error("Error fetching rooms by user id:", err);
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    // 3. Obtener miembros de una sala (DTO)
    async function fetchMembersByRoomId(roomId: number) {
        loading.value = true;
        currentRoomMembers.value = []; // Limpiar para evitar parpadeos
        try {
            const response = await fetch(`${BASE_URL}/api/UserRoom/room/${roomId}`, {
                method: "GET",
                mode: "cors",
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();
            // Mapeo directo asumiendo que el backend devuelve camelCase por defecto
            currentRoomMembers.value = data;
        } catch (err: any) {
            console.error("Error fetching room members:", err);
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    // 4. Unirse a una sala (Add)
    async function joinRoom(userId: number, roomId: number) {
        loading.value = true;
        try {
            const response = await fetch(`${BASE_URL}/api/UserRoom`, {
                method: "POST",
                mode: "cors",
                headers: getAuthHeaders(),
                body: JSON.stringify({ userid: userId, roomid: roomId })
            });

            if (!response.ok) {
                // Intentar leer el mensaje de error del backend
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! Status: ${response.status}`);
            }

            // Actualizar listas locales si es necesario
            await fetchRoomsByUserId(userId);
            
            return true;
        } catch (err: any) {
            console.error("Error joining room:", err);
            error.value = err.message;
            throw err; // Re-lanzar para manejar en el componente (ej: Toast de error)
        } finally {
            loading.value = false;
        }
    }

    // 5. Salir de una sala (Delete)
    async function leaveRoom(userId: number, roomId: number) {
        loading.value = true;
        try {
            const response = await fetch(`${BASE_URL}/api/UserRoom/${userId}/${roomId}`, {
                method: "DELETE",
                mode: "cors",
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            // Actualizar estado local eliminando el item sin hacer otra petición
            currentUserRooms.value = currentUserRooms.value.filter(
                ur => !(ur.userid === userId && ur.roomid === roomId)
            );
            
            return true;
        } catch (err: any) {
            console.error("Error leaving room:", err);
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    // 6. Actualizar relación (Update)
    async function updateUserRoom(userId: number, roomId: number, data: UserRoom) {
        loading.value = true;
        try {
            const response = await fetch(`${BASE_URL}/api/UserRoom/${userId}/${roomId}`, {
                method: "PUT",
                mode: "cors",
                headers: getAuthHeaders(),
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            
            return true;
        } catch (err: any) {
            console.error("Error updating user room:", err);
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    // Getters útiles
    const memberCount = computed(() => currentRoomMembers.value.length);
    const isMemberInRoom = computed(() => (userName: string) => {
        return currentRoomMembers.value.some(m => m.name === userName);
    });

    return {
        // State
        allUserRooms,
        currentUserRooms,
        currentRoomMembers,
        loading,
        error,
        // Actions
        fetchAllUserRooms,
        fetchRoomsByUserId,
        fetchMembersByRoomId,
        joinRoom,
        leaveRoom,
        updateUserRoom,
        // Getters
        memberCount,
        isMemberInRoom
    }
});