import type { Routines } from "@/components/Models/Routines";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useRoutineStore = defineStore('routine', () => {
    // --- State ---
    const selectedRoutineId = ref<number | null>(null);
    const routines = ref<Routines[]>([]);
    async function getRoutines() {
        try {
            const response = await fetch('http://localhost:6873/api/Task', {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            routines.value = data;
        } catch (error) {
            console.error('Error fetching routines:', error);
        }
    }
    async function createRoutine(routineData: Routines) {
        try {
            const response = await fetch('http://localhost:6873/api/Task', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(routineData)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const newRoutine = await response.json();
            routines.value.push(newRoutine);
        } catch (error) {
            console.error('Error creating routine:', error);
        }
    }
    async function getRoutineByUserId(userId: number) {
        try {
            const response = await fetch(`http://localhost:6873/api/Task/user/${userId}`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            routines.value = data;
        }
        catch (error) {
            console.error('Error fetching routines by user ID:', error);
        }
    }


    // --- Actions ---
    function setSelectedRoutineId(routineId: number | null) {
        selectedRoutineId.value = routineId;
    }
    return {
        selectedRoutineId,
        routines,
        setSelectedRoutineId,
        getRoutines,
        createRoutine,
        getRoutineByUserId
    };
});