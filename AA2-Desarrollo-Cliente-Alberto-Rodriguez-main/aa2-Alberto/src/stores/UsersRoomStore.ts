import { defineStore } from "pinia"
import { ref, computed } from "vue"

// --- Interfaces ---
export interface UserRoom {
    userid: number;
    roomid: number;
    // Definimos 'user' con 'any' o con una interfaz User completa para acceder a user.name, user.items, etc.
    user?: any; 
    room?: any;
}

// YA NO NECESITAS UserRoomResponseDTO porque ahora todo es UserRoom
// export interface UserRoomResponseDTO { ... } 

const BASE_URL = "http://localhost:6873";

export const useUserRoomStore = defineStore('userRoom', () => {
    // --- State ---
    const allUserRooms = ref<UserRoom[]>([]);
    const currentUserRooms = ref<UserRoom[]>([]);
    
    // CAMBIO 1: Ahora los miembros son del tipo UserRoom[] (igual que los otros estados)
    const currentRoomMembers = ref<UserRoom[]>([]); 
    
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

    // 3. Obtener miembros de una sala
    async function fetchMembersByRoomId(roomId: number) {
        loading.value = true;
        currentRoomMembers.value = []; 
        try {
            const response = await fetch(`${BASE_URL}/api/UserRoom/room/${roomId}`, {
                method: "GET",
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            // Ahora data es un array de objetos UserRoom [{userid:..., user:{...}, room:{...}}]
            const data = await response.json();
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
                headers: getAuthHeaders(),
                body: JSON.stringify({ userid: userId, roomid: roomId })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! Status: ${response.status}`);
            }

            await fetchRoomsByUserId(userId);
            return true;
        } catch (err: any) {
            console.error("Error joining room:", err);
            error.value = err.message;
            throw err; 
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
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

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

    // --- Getters ---
    const memberCount = computed(() => currentRoomMembers.value.length);
    
    // CAMBIO 2: Accedemos a m.user.name porque la estructura ahora es anidada
    const isMemberInRoom = computed(() => (userName: string) => {
        return currentRoomMembers.value.some(m => m.user?.name === userName);
    });

    return {
        allUserRooms,
        currentUserRooms,
        currentRoomMembers,
        loading,
        error,
        fetchAllUserRooms,
        fetchRoomsByUserId,
        fetchMembersByRoomId,
        joinRoom,
        leaveRoom,
        updateUserRoom,
        memberCount,
        isMemberInRoom
    }
});