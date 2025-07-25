import type { Plan } from "../components/Models/Plan"
import { defineStore } from "pinia"
import { ref } from "vue"
import { BASE_URL } from "../components/Models/BaseURL";


export const usePlanStore = defineStore('plan', () => {
    const plan = ref<Plan[]>([])

    const getAuthHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
    });

    async function fetchPlan() {
        try {
            const response = await fetch(`${BASE_URL}/api/Plan`, {
                method: "GET",
                mode: "cors",
                headers: getAuthHeaders()
            })

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
            const data = await response.json()
            plan.value = data.map((d: any) => ({
                id: d.id,
                userId: d.userId,
                description: d.description
            }))
        } catch (error) {
            console.error("Error fetching plans:", error)
        }
    }

    return { plan, fetchPlan }
})
