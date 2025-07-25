import type { Item } from "../components/Models/Item";
import { defineStore } from "pinia";
import { ref } from "vue";

const BASE_URL = "http://a7f6f3513ee60417e8e3e0ed50c28649-94590623.us-east-1.elb.amazonaws.com:6873";

export const useItemStore = defineStore('item', () => {
    const items = ref<Item[]>([]);
    const strengthItems = ref<Item[]>([]);
    const enduranceItems = ref<Item[]>([]);
    const generalItems = ref<Item[]>([]);

    const getAuthHeaders = () => ({
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
    });

    async function fetchItems() {
        try {
            const response = await fetch(`${BASE_URL}/api/Item`, {
                method: "GET",
                mode: "cors",
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            items.value = data.map((d: any) => ({ id: d.id, name: d.name, type: d.type, bonus: d.bonus, price: d.price }));
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }

    async function fetchDailyStrengthItems() {
        try {
            const response = await fetch(`${BASE_URL}/api/Item/random-strength`, {
                method: "GET",
                mode: "cors",
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            strengthItems.value = data.map((d: any) => ({ id: d.id, name: d.name, type: d.type, bonus: d.bonus, price: d.price }));
        } catch (error) {
            console.error("Error fetching daily strength items:", error);
        }
    }

    async function fetchDailyEnduranceItems() {
        try {
            const response = await fetch(`${BASE_URL}/api/Item/random-endurance`, {
                method: "GET",
                mode: "cors",
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            enduranceItems.value = data.map((d: any) => ({ id: d.id, name: d.name, type: d.type, bonus: d.bonus, price: d.price }));
        } catch (error) {
            console.error("Error fetching daily endurance items:", error);
        }
    }

    async function fetchDailyGeneralItems() {
        try {
            const response = await fetch(`${BASE_URL}/api/Item/random-items`, {
                method: "GET",
                mode: "cors",
                headers: getAuthHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const data = await response.json();
            generalItems.value = data.map((d: any) => ({ id: d.id, name: d.name, type: d.type, bonus: d.bonus, price: d.price }));
        } catch (error) {
            console.error("Error fetching daily general items:", error);
        }
    }

    async function editItem(itemid: number, item: Item): Promise<void> {
        try {
            const response = await fetch(`${BASE_URL}/api/Item/${itemid}`, {
                method: 'PUT',
                mode: 'cors',
                headers: getAuthHeaders(),
                body: JSON.stringify(item)
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            await fetchItems();
        } catch (error) {
            console.log(JSON.stringify(item));
            console.error('Error editing item:', error);
        }
    }

    async function deleteItem(itemid: number): Promise<void> {
        try {
            const response = await fetch(`${BASE_URL}/api/Item/${itemid}`, {
                method: 'DELETE',
                mode: 'cors',
                headers: getAuthHeaders(),
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            await fetchItems();
            const text = await response.text();
            if (text) return JSON.parse(text);
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    }

    return {
        items,
        strengthItems,
        enduranceItems,
        generalItems,
        fetchItems,
        fetchDailyStrengthItems,
        fetchDailyEnduranceItems,
        fetchDailyGeneralItems,
        editItem,
        deleteItem
    };
});
