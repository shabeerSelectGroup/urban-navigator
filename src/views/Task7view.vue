<template>
  <div class="task-container">
    <div class="header-section">
      <h1>Fujairah – Al Bidyah Mosque</h1>
      <h2>Chronicles of Time</h2>
      <p class="challenge-instruction">Arrange the historical events in correct chronological order by dragging and dropping.</p>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
    
    <div class="timeline-container">
      <div 
        v-for="(event, index) in events" 
        :key="event.id"
        class="timeline-event"
        :class="{ 'correct': event.correctPosition }"
        draggable="true"
        @dragstart="onDragStart($event, index)"
        @dragover.prevent
        @drop="onDrop($event, index)"
        @dragend="onDragEnd"
      >
        <div class="event-content">
          <div class="event-emoji">{{ event.emoji }}</div>
          <div class="event-details">
            <h3>{{ event.title }}</h3>
            <p class="event-year">{{ event.year }}</p>
            <p class="event-description">{{ event.description }}</p>
          </div>
          <div v-if="event.correctPosition" class="correct-badge">✓</div>
        </div>
      </div>
    </div>
    
    <div v-if="allCorrect" class="success-message">
      <h3>🎉 Correct Order! 🎉</h3>
      <p>You've successfully arranged the events in chronological order!</p>
      <div class="correct-order">
        <div v-for="event in correctOrder" :key="event.id" class="correct-event">
          <span class="event-number">{{ event.position }}</span>
          <span class="event-title">{{ event.title }} ({{ event.year }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'Task7View',
  setup() {
    const events = ref([
      {
        id: 1,
        title: 'Construction of Al Bidyah Mosque',
        year: '1446 CE',
        description: 'Earliest known mosque in the UAE, representing faith and heritage.',
        emoji: '🕌',
        correctPosition: false,
        position: 1
      },
      {
        id: 2,
        title: 'Discovery of Oil',
        year: '1958',
        description: 'Marked the beginning of modern economic transformation and rapid development. (Commercial production from Abu Dhabi in 1962)',
        emoji: '🛢️',
        correctPosition: false,
        position: 2
      },
      {
        id: 3,
        title: 'Formation of the UAE Federation',
        year: '1971',
        description: 'The union of seven emirates into one nation of shared vision and identity.',
        emoji: '🇦🇪',
        correctPosition: false,
        position: 3
      }
    ]);

    const draggedItem = ref(null);

    const correctOrder = computed(() => {
      return [...events.value]
        .sort((a, b) => a.position - b.position)
        .map((event, index) => ({
          ...event,
          position: index + 1
        }));
    });

    const allCorrect = computed(() => {
      return events.value.every((event, index) => event.position === index + 1);
    });

    const progress = computed(() => {
      const correctCount = events.value.filter((event, index) => 
        event.position === index + 1
      ).length;
      return (correctCount / events.value.length) * 100;
    });

    const onDragStart = (event, index) => {
      draggedItem.value = index;
      event.target.classList.add('dragging');
    };

    const onDragEnd = (event) => {
      event.target.classList.remove('dragging');
      draggedItem.value = null;
      checkPositions();
    };

    const onDrop = (event, dropIndex) => {
      event.preventDefault();
      if (draggedItem.value === null || draggedItem.value === dropIndex) return;
      
      const newEvents = [...events.value];
      const [movedItem] = newEvents.splice(draggedItem.value, 1);
      newEvents.splice(dropIndex, 0, movedItem);
      
      // Update positions based on new order
      newEvents.forEach((event, index) => {
        event.position = index + 1;
      });
      
      events.value = newEvents;
    };

    const checkPositions = () => {
      events.value = events.value.map(event => ({
        ...event,
        correctPosition: event.position === event.id
      }));
    };

    return {
      events,
      draggedItem,
      correctOrder,
      allCorrect,
      progress,
      onDragStart,
      onDragEnd,
      onDrop,
      checkPositions
    };
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

.task-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.header-section {
  background: white;
  padding: 25px;
  border-radius: 10px;
  margin-bottom: 30px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin: 0 0 10px 0;
  font-size: 2.2em;
  font-weight: 700;
  background: linear-gradient(90deg, #3498db, #9b59b6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

h2 {
  color: #7f8c8d;
  text-align: center;
  margin: 0 0 20px 0;
  font-weight: 500;
  font-size: 1.5em;
}

.challenge-instruction {
  text-align: center;
  color: #555;
  margin: 0 0 20px 0;
  font-size: 1.1em;
  line-height: 1.6;
}

.progress-bar {
  width: 100%;
  height: 10px;
  background: #ecf0f1;
  border-radius: 5px;
  margin-top: 20px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #2ecc71, #3498db);
  width: 0%;
  transition: width 0.5s ease;
  border-radius: 5px;
}

.timeline-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 30px 0;
}

.timeline-event {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: move;
  position: relative;
  border: 2px solid #e0e6ed;
}

.timeline-event:hover {
  transform: translateX(5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.timeline-event.dragging {
  opacity: 0.5;
  transform: scale(0.98);
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.timeline-event.correct {
  border-color: #2ecc71;
  background-color: #e8f7e8;
  padding-right: 50px;
}

.timeline-event.correct::after {
  content: '✓';
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  background: #2ecc71;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1em;
}

.event-content {
  display: flex;
  align-items: flex-start;
  gap: 15px;
}

.event-emoji {
  font-size: 2em;
  line-height: 1;
  margin-top: 5px;
}

.event-details {
  flex: 1;
}

h3 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 1.2em;
}

.event-year {
  margin: 0 0 8px 0;
  color: #3498db;
  font-weight: 600;
  font-size: 1.1em;
}

.event-description {
  margin: 0;
  color: #555;
  line-height: 1.5;
  font-size: 0.95em;
}

.success-message {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-top: 30px;
  text-align: center;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  animation: fadeIn 0.6s ease-out;
}

.success-message h3 {
  font-size: 1.8em;
  margin-bottom: 15px;
  color: #2c3e50;
}

.success-message p {
  color: #555;
  font-size: 1.1em;
  margin-bottom: 25px;
}

.correct-order {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  text-align: left;
}

.correct-event {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  margin: 10px 0;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.event-number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: #3498db;
  color: white;
  border-radius: 50%;
  margin-right: 15px;
  font-weight: 600;
}

.event-title {
  color: #2c3e50;
  font-weight: 500;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .task-container {
    padding: 15px;
  }
  
  h1 {
    font-size: 1.8em;
  }
  
  h2 {
    font-size: 1.3em;
  }
  
  .timeline-event {
    padding: 15px;
  }
  
  .event-emoji {
    font-size: 1.5em;
  }
  
  .success-message {
    padding: 20px 15px;
  }
  
  .success-message h3 {
    font-size: 1.5em;
  }
}
</style>