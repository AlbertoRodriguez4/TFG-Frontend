import type { Item } from "../components/Models/Item"
import { defineStore } from "pinia"
import { ref } from "vue"
import { BASE_URL } from "../components/Models/BaseURL";


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

            console.log("Compra realizada:", result)
            return result

        } catch (error) {
            console.log(JSON.stringify(body))
            console.error("Error al agregar compra:", error)
            throw error
        }
    }

    return { purchase, fetchPurchase, addPurchase }
})
