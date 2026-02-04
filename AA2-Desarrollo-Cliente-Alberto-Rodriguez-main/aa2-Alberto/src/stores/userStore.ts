import { defineStore } from "pinia";
import { ref } from "vue";
import { decodeToken } from "../JWT/JWTDecode";
import type { User } from "@/components/Models/User";
import type { PurchasedItem } from "@/components/Models/PurchasedItem";

export const purchasedItems = ref<PurchasedItem[]>([]);
const BASE_URL = "http://localhost:6873";

export const useUserStore = defineStore('user', () => {
  const user = ref<User[]>([]);
  const loggedUser = ref<User | null>(null);

  async function fetchUser() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/api/User`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      user.value = data.map((d: any) => ({
        id: d.id,
        name: d.name,
        email: d.email,
        passwordhash: d.passwordhash,
        level: d.level,
        strength: d.strength,
        endurance: d.endurance,
        gold: d.gold,
        experience: d.experience // --- NUEVO CAMPO ---
      }));
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  
  async function registerUser(newUser: User): Promise<boolean> { 
    try {
      const response = await fetch(`${BASE_URL}/api/auth/register`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      
      return true;
    } catch (error) {
      console.error("Error registering user:", error);
      return false;
    }
  }

  function initializeSession() {
    const token = localStorage.getItem('token');
    console.log('Token recuperado:', token);

    if (!token) {
      console.warn('No se encontró ningún token en localStorage');
      return;
    }

    try {
      const decoded = decodeToken(token);
      loggedUser.value = {
        id: Number(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]),
        name: decoded.name,
        email: decoded.email,
        passwordhash: decoded.passwordhash,
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        level: Number(decoded.level),
        strength: Number(decoded.strength),
        endurance: Number(decoded.endurance),
        consistencystreak: Number(decoded.consistencystreak),
        consistencyStreak: Number(decoded.consistencystreak),
        gold: Number(decoded.gold),
        // --- NUEVOS CAMPOS DE XP ---
        experience: Number(decoded.experience),
        xpRequired: Number(decoded.xpRequired),
        xpRemaining: Number(decoded.xpRemaining),
        equippedStrengthItemId: decoded.equippedStrengthItemId !== null ? Number(decoded.equippedStrengthItemId) : null,
        equippedEnduranceItemId: decoded.equippedEnduranceItemId !== null ? Number(decoded.equippedEnduranceItemId) : null
      };
    } catch (error) {
      console.error('Error al decodificar el token JWT:', error);
      localStorage.removeItem('token');
    }
  }

  initializeSession();

  async function loginUser(email: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const token = data.token;
      const decoded = decodeToken(token);

      localStorage.setItem('token', token);

      loggedUser.value = {
        id: Number(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]),
        name: decoded.name,
        email: decoded.email,
        passwordhash: decoded.passwordhash,
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        level: decoded.level,
        strength: decoded.strength,
        endurance: decoded.endurance,
        consistencystreak: Number(decoded.consistencystreak),
        consistencyStreak: Number(decoded.consistencystreak),
        gold: decoded.gold,
        // --- NUEVOS CAMPOS DE XP ---
        experience: Number(decoded.experience),
        xpRequired: Number(decoded.xpRequired),
        xpRemaining: Number(decoded.xpRemaining),
        equippedStrengthItemId: decoded.equippedStrengthItemId !== null ? Number(decoded.equippedStrengthItemId) : null,
        equippedEnduranceItemId: decoded.equippedEnduranceItemId !== null ? Number(decoded.equippedEnduranceItemId) : null
      };

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }

  async function refreshTokenByLogin() {
    const email = loggedUser.value?.email;
    const password = loggedUser.value?.passwordhash;

    if (!email || !password) {
      console.error('No se encontraron credenciales para hacer el login.');
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.json();
      const token = data.token;
      const decoded = decodeToken(token);

      localStorage.setItem('token', token);

      loggedUser.value = {
        id: Number(decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]),
        name: decoded.name,
        email: decoded.email,
        passwordhash: decoded.passwordhash,
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
        level: decoded.level,
        strength: decoded.strength,
        endurance: decoded.endurance,
        consistencystreak: Number(decoded.consistencystreak),
        consistencyStreak: Number(decoded.consistencystreak),
        gold: decoded.gold,
        // --- NUEVOS CAMPOS DE XP ---
        experience: Number(decoded.experience),
        xpRequired: Number(decoded.xpRequired),
        xpRemaining: Number(decoded.xpRemaining),
        equippedStrengthItemId: decoded.equippedStrengthItemId !== null ? Number(decoded.equippedStrengthItemId) : null,
        equippedEnduranceItemId: decoded.equippedEnduranceItemId !== null ? Number(decoded.equippedEnduranceItemId) : null
      };
    } catch (error) {
      console.error('Error al hacer login para renovar el token:', error);
    }
  }

  async function refreshLoggedUser() {
    if (!loggedUser.value) return;
    
    try {
      const response = await fetch(`${BASE_URL}/api/User/${loggedUser.value.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error("No se pudo refrescar el usuario");

      const updatedUser = await response.json();

      loggedUser.value = {
        ...loggedUser.value,
        ...updatedUser
      };

      console.log('Usuario actualizado:', loggedUser.value);
    } catch (error) {
      console.error("Error actualizando el usuario:", error);
    }
  }

  async function searchByName(name: string): Promise<User[]> {
    try {
      const response = await fetch(`${BASE_URL}/api/User/search/${name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Error buscando usuarios');

      const data = await response.json();
      return data as User[];
    } catch (error) {
      console.error('Error en searchByName:', error);
      return [];
    }
  }

  async function getTopThreeUsers() {
    try {
      const response = await fetch(`${BASE_URL}/api/User/getTopThreeUsers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Error buscando usuarios');

      const data = await response.json();
      return data.map((d: any) => ({
        name: d.name,
        level: d.level,
        strength: d.strength,
        endurance: d.endurance
      }));
    } catch (error) {
      console.error('Error en getTopThreeUsers:', error);
      return [];
    }
  }

  // --- FUNCIÓN ACTUALIZADA ---
  // Ya no requiere email/password, usa el token y el endpoint seguro
  async function getItems() {
    try {
      const response = await fetch(`${BASE_URL}/api/Purchase/my-purchases`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data: PurchasedItem[] = await response.json();
      purchasedItems.value = data;
    } catch (error) {
      console.error("Error al obtener los items comprados:", error);
    }
  }

  async function editUser(id: number, user: User): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/api/User/${id}`, {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(user)
      });

      if (user.id === loggedUser.value?.id) {
        loggedUser.value = {
          ...loggedUser.value,
          ...user
        };
      }

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      await fetchUser();
    } catch (error) {
      console.error('Error editing user:', error);
    }
  }

  async function createUser(user: User): Promise<boolean> {
    try {
      const response = await fetch(`${BASE_URL}/api/User`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(user)
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
        return false;
      }

      await fetchUser();
      return true;
    } catch (error) {
      console.error('Error creating user:', error);
      return false;
    }
  }

  function logoutUser() {
    localStorage.removeItem('token');
    loggedUser.value = null;
  }

  async function DeleteUser(userId: number): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/api/User/${userId}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      await fetchUser();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
  // --- NUEVAS FUNCIONES DE EQUIPAMIENTO ---

  // --- NUEVAS FUNCIONES DE EQUIPAMIENTO (MODIFICADAS) ---

  async function equipItem(itemId: number) {
    if (!loggedUser.value) return;

    try {
      // 1. Guardamos el tipo de item antes de enviar (necesitamos saber si es Fuerza o Resistencia)
      // Buscamos el item en la lista de comprados para saber su tipo
      const itemToEquip = purchasedItems.value.find(i => i.itemId === itemId);
      
      if (!itemToEquip) {
        console.error("Item no encontrado en inventario");
        return;
      }

      const response = await fetch(`${BASE_URL}/api/User/equip/${loggedUser.value.id}/${itemId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Error al equipar objeto");
      }

      // 2. ACTUALIZACIÓN INMEDIATA (Optimistic Update)
      // Actualizamos el estado local sin esperar a recargar todo el usuario
      const typeLower = itemToEquip.itemType.toLowerCase();

      if (typeLower === 'strength' || typeLower === 'fuerza') {
        loggedUser.value.equippedStrengthItemId = itemId;
      } else if (typeLower === 'endurance' || typeLower === 'resistencia') {
        loggedUser.value.equippedEnduranceItemId = itemId;
      }

      // Opcional: Si quieres asegurar consistencia total, puedes llamar a refreshLoggedUser()
      // pero con la asignación de arriba la UI cambiará al instante.
      await refreshLoggedUser(); 
      
      console.log("Objeto equipado con éxito");
    } catch (error) {
      console.error("Error equipando objeto:", error);
      alert("No se pudo equipar el objeto.");
    }
  }

  async function unequipItem(type: string) {
    if (!loggedUser.value) return;

    try {
      const response = await fetch(`${BASE_URL}/api/User/unequip/${loggedUser.value.id}/${type}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error("Error al desequipar");

      // 2. ACTUALIZACIÓN INMEDIATA
      const typeLower = type.toLowerCase();
      
      if (typeLower === 'strength' || typeLower === 'fuerza') {
        loggedUser.value.equippedStrengthItemId = null; // Ponemos null
      } else if (typeLower === 'endurance' || typeLower === 'resistencia') {
        loggedUser.value.equippedEnduranceItemId = null; // Ponemos null
      }

      await refreshLoggedUser();
    } catch (error) {
      console.error("Error desequipando:", error);
    }
  }

  const userById = (id: number) => user.value.find(user => user.id === id);

  return {
    user,
    fetchUser,
    userById,
    loginUser,
    loggedUser,
    searchByName,
    getTopThreeUsers,
    getItems,
    purchasedItems,
    refreshLoggedUser,
    refreshTokenByLogin,
    editUser,
    logoutUser,
    createUser,
    DeleteUser,
    registerUser,
    equipItem,
    unequipItem
  };
});