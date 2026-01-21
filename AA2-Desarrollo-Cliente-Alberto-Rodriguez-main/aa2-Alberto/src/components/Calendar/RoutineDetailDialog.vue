<template>
    <v-dialog 
        :model-value="modelValue" 
        @update:model-value="$emit('update:modelValue', $event)" 
        max-width="600" 
        persistent
    >
        <v-card v-if="routine" class="routine-detail-card">
            <div class="routine-header" :class="routine.iscompleted ? 'completed' : 'pending'">
                <div class="header-content">
                    <v-icon large class="header-icon">
                        {{ routine.iscompleted ? 'mdi-check-circle' : 'mdi-dumbbell' }}
                    </v-icon>
                    <div class="header-text">
                        <h2 class="routine-title">{{ routine.name }}</h2>
                        <v-chip small :color="routine.iscompleted ? 'success' : 'warning'" dark class="status-chip">
                            <v-icon small left>
                                {{ routine.iscompleted ? 'mdi-check' : 'mdi-clock-outline' }}
                            </v-icon>
                            {{ routine.iscompleted ? 'Completada' : 'Pendiente' }}
                        </v-chip>
                    </div>
                </div>
                <v-btn icon dark @click="$emit('update:modelValue', false)">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </div>

            <v-card-text class="routine-content">
                <div class="section">
                    <div class="section-label">
                        <v-icon color="purple" class="mr-2">mdi-text</v-icon>
                        Descripción
                    </div>
                    <p class="section-text">{{ routine.description }}</p>
                </div>

                <v-row class="info-cards">
                    <v-col cols="12" sm="4">
                        <div class="info-card">
                            <v-icon :color="getDifficultyColor(routine.difficulty)" large>
                                mdi-gauge
                            </v-icon>
                            <div class="info-label">Dificultad</div>
                            <div class="info-value" :style="{ color: getDifficultyColor(routine.difficulty) }">
                                {{ getDifficultyText(routine.difficulty) }}
                            </div>
                        </div>
                    </v-col>

                    <v-col cols="12" sm="4">
                        <div class="info-card">
                            <v-icon color="amber" large>mdi-star</v-icon>
                            <div class="info-label">Experiencia</div>
                            <div class="info-value" style="color: #FFA726">+{{ routine.reward }} XP</div>
                        </div>
                    </v-col>

                    <v-col cols="12" sm="4">
                        <div class="info-card">
                            <v-icon color="yellow darken-2" large>mdi-coin</v-icon>
                            <div class="info-label">Monedas</div>
                            <div class="info-value" style="color: #F9A825">+50</div>
                        </div>
                    </v-col>
                </v-row>

                <div class="section">
                    <div class="section-label">
                        <v-icon color="purple" class="mr-2">mdi-calendar</v-icon>
                        Fecha programada
                    </div>
                    <p class="section-text">{{ routine.createdat ? formatDate(routine.createdat.toString()) : '-' }}</p>
                </div>

                <v-alert v-if="routine.iscompleted" type="success" colored-border elevation="2" class="mt-4">
                    <div class="completed-message">
                        <v-icon large color="success" class="mr-3">mdi-trophy</v-icon>
                        <div>
                            <div class="font-weight-bold">¡Excelente trabajo! 🎉</div>
                            <div class="text-caption">Has completado esta rutina con éxito</div>
                        </div>
                    </div>
                </v-alert>
            </v-card-text>

            <v-card-actions class="routine-actions">
                <v-spacer></v-spacer>
                <v-btn text large @click="$emit('update:modelValue', false)">
                    Cerrar
                </v-btn>
                <v-btn 
                    v-if="!routine.iscompleted" 
                    color="success" 
                    large 
                    elevation="2" 
                    class="complete-btn"
                    @click="showConfirmDialog = true"
                >
                    <v-icon left>mdi-check-circle</v-icon>
                    Marcar como completada
                </v-btn>
            </v-card-actions>
        </v-card>

        <!-- Diálogo de confirmación -->
        <v-dialog v-model="showConfirmDialog" max-width="400" persistent>
            <v-card>
                <v-card-title class="text-h5 confirm-title">
                    <v-icon large color="warning" class="mr-2">mdi-alert-circle</v-icon>
                    ¿Estás seguro?
                </v-card-title>
                <v-card-text class="confirm-text">
                    <p>Estás a punto de marcar esta rutina como completada.</p>
                    <v-alert type="warning" dense outlined class="mt-3">
                        <strong>⚠️ Esta acción no se puede deshacer</strong>
                    </v-alert>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="showConfirmDialog = false">
                        Cancelar
                    </v-btn>
                    <v-btn color="success" @click="confirmComplete">
                        <v-icon left>mdi-check</v-icon>
                        Sí, completar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-dialog>
</template>

<script lang="ts">
import { defineComponent, type PropType, ref } from 'vue';
import type { Routines } from '@/components/Models/Routines';

export default defineComponent({
    name: 'RoutineDetailDialog',
    props: {
        modelValue: {
            type: Boolean as PropType<boolean>,
            required: true
        },
        routine: {
            type: Object as PropType<Routines | null>,
            default: null
        }
    },
    emits: ['update:modelValue', 'complete'],
    setup(props, { emit }) {
        const showConfirmDialog = ref(false);

        const confirmComplete = () => {
            if (props.routine) {
                emit('complete', props.routine.id);
                showConfirmDialog.value = false;
            }
        };

        const getDifficultyText = (difficulty: number): string => {
            const difficulties: Record<number, string> = {
                1: 'Fácil',
                2: 'Moderada',
                3: 'Difícil',
                4: 'Extrema'
            };
            return difficulties[difficulty] || 'Desconocida';
        };

        const getDifficultyColor = (difficulty: number): string => {
            const colors: Record<number, string> = {
                1: '#4CAF50',
                2: '#FFA726',
                3: '#EF5350',
                4: '#7E57C2'
            };
            return colors[difficulty] || '#757575';
        };

        const formatDate = (dateString: string): string => {
            if (!dateString) return '';
            const date = new Date(dateString);
            const options: Intl.DateTimeFormatOptions = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            return date.toLocaleDateString('es-ES', options);
        };

        return {
            showConfirmDialog,
            confirmComplete,
            getDifficultyText,
            getDifficultyColor,
            formatDate
        };
    }
});
</script>

<style scoped>
.routine-detail-card {
    overflow: hidden;
    border-radius: 16px;
}

.routine-header {
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    color: white;
    position: relative;
    overflow: hidden;
}

.routine-header::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.1)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,122.7C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>');
    background-size: cover;
    background-position: bottom;
    opacity: 0.3;
}

.routine-header.completed {
    background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
}

.routine-header.pending {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header-content {
    display: flex;
    gap: 16px;
    align-items: center;
    position: relative;
    z-index: 1;
}

.header-icon {
    background: rgba(255, 255, 255, 0.2);
    padding: 12px;
    border-radius: 12px;
    backdrop-filter: blur(10px);
}

.header-text {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.routine-title {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.status-chip {
    width: fit-content;
    font-weight: 600;
}

.routine-content {
    padding: 24px !important;
}

.section {
    margin-bottom: 24px;
}

.section-label {
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 0.95rem;
    color: #424242;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.section-text {
    font-size: 1.1rem;
    color: #616161;
    line-height: 1.6;
    margin: 0;
}

.info-cards {
    margin: 24px 0;
}

.info-card {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.info-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.info-label {
    font-size: 0.85rem;
    color: #616161;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.info-value {
    font-size: 1.5rem;
    font-weight: 700;
}

.completed-message {
    display: flex;
    align-items: center;
}

.routine-actions {
    padding: 16px 24px;
    background: #fafafa;
    border-top: 1px solid #e0e0e0;
}

.complete-btn {
    font-weight: 700;
    text-transform: none;
    letter-spacing: 0.5px;
    padding: 0 32px !important;
}

.confirm-title {
    background: linear-gradient(135deg, #FFA726 0%, #FB8C00 100%);
    color: white;
    padding: 20px 24px;
}

.confirm-text {
    padding: 24px;
    font-size: 1.1rem;
}

@media (max-width: 600px) {
    .routine-header {
        padding: 20px;
    }

    .header-content {
        flex-direction: column;
        align-items: flex-start;
    }

    .routine-title {
        font-size: 1.5rem;
    }

    .info-value {
        font-size: 1.25rem;
    }
}
</style>