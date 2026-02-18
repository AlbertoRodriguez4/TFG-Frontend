import type { Item } from "../components/Models/Item"
import { defineStore } from "pinia"
import { ref } from "vue"
import { useUserStore } from "./userStore"; // Importar el store de usuario

const BASE_URL = "http://localhost:6873";

export const usePurchaseStore = defineStore('purchase', () => {
    const purchase = ref<Item[]>([]) 

    const getAuthHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
    });

    async function fetchPurchase() {
        try {
            const response = await fetch(`${BASE_URL}/api/Item`, {
                method: "GET",
                mode: "cors",
                headers: getAuthHeaders()
            })

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
            const data = await response.json()
            purchase.value = data.map((d: any) => ({
                id: d.id,
                name: d.name,
                type: d.type,
                bonus: d.bonus,
                price: d.price
            }))
        } catch (error) {
            console.error("Error fetching plans:", error)
        }
    }

    // FUNCIÓN CORREGIDA: Ahora actualiza los datos del usuario después de la compra
    async function addPurchase(userid: number, itemid: number, itemPrice: number) {
        const body = {
            userid,
            itemid,
            goldToSubtract: itemPrice
        }

        try {
            const response = await fetch(`${BASE_URL}/api/Purchase`, {
                method: "POST",
                mode: "cors",
                headers: getAuthHeaders(),
                body: JSON.stringify(body)
            })

            const result = await response.json()
            if (!response.ok) {
                throw { status: response.status, data: result }
            }

            
            // ACTUALIZAR LOS DATOS DEL USUARIO después de la compra
            const userStore = useUserStore();
            await userStore.refreshLoggedUser();
            
            
            return result

        } catch (error) {
            console.error("Error al agregar compra:", error)
            throw error
        }
    }

    return { purchase, fetchPurchase, addPurchase }
})