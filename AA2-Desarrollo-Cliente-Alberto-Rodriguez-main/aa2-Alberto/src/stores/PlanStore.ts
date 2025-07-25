import type { Plan } from "../components/Models/Plan"
import { defineStore } from "pinia"
import { ref } from "vue"

const BASE_URL = "http://a7f6f3513ee60417e8e3e0ed50c28649-94590623.us-east-1.elb.amazonaws.com:6873";

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
