import { defineStore } from "pinia";

export const useMapStore = defineStore('map', () => {
    async function getCooredadas(address: string) {
        const response = await fetch(`http://localhost:6873/api/geocodificacion/${encodeURIComponent(address)}`);
        const data = await response.json();
        if (data.length === 0) {
            throw new Error('Endereço não encontrado');
        }
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
    }
    async function getEstablecimientos(lat: number, lon: number, tipo: string) {
        const response = await fetch(`http://localhost:6873/api/establecimientos?lat=${lat}&lon=${lon}&tipo=${encodeURIComponent(tipo)}`);
        const data = await response.json();
        return data;
    }

        
    return { getCooredadas, getEstablecimientos };
})