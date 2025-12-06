// pages/About.jsx
function About() {
  return (
    <div style={styles.container}>
      <h1>ℹ️ О проекте</h1>
      <div style={styles.content}>
        <p style={styles.description}>
          Этот трекер технологических целей создан для отслеживания прогресса в изучении современных веб-технологий.
        </p>
        
        <div style={styles.section}>
          <h2>🎯 Цели проекта</h2>
          <ul>
            <li>Помочь разработчикам визуализировать свой прогресс</li>
            <li>Создать удобный инструмент для отслеживания целей</li>
            <li>Показать возможности React и Vite в действии</li>
            <li>Внедрить современные практики разработки</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  },
  content: {
    marginTop: '30px',
  },
  description: {
    fontSize: '18px',
    lineHeight: '1.6',
    color: '#333',
    marginBottom: '30px',
  },
  section: {
    marginBottom: '40px',
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
}

export default About