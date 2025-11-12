<template>
  <div class="home-container">
    <h1>🏙️ Urban Navigator</h1>
    <p class="subtitle">Explore UAE's cultural landmarks through interactive activities</p>
    
    <div class="tasks-grid">
      <router-link to="/task3" class="task-card">
        <div class="card-icon">🕌</div>
        <h2>Task 3: Sharjah Art Museum</h2>
        <p>Match cultural icons with their meanings in this interactive game</p>
        <div class="card-badge">Matching Game</div>
      </router-link>
      
      <router-link to="/task7" class="task-card">
        <div class="card-icon">⏳</div>
        <h2>Task 7: Al Bidyah Mosque</h2>
        <p>Arrange historical events in chronological order</p>
        <div class="card-badge">Timeline Activity</div>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.2rem;
  margin-bottom: 3rem;
}

.tasks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.task-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  text-decoration: none;
  color: #2c3e50;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.task-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.task-card:hover .card-icon {
  transform: scale(1.1);
}

h2 {
  color: #2c3e50;
  margin: 1rem 0;
  font-size: 1.5rem;
}

p {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.card-badge {
  display: inline-block;
  background: #3498db;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .tasks-grid {
    grid-template-columns: 1fr;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}
</style>
