const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
let currentDate = new Date()
currentDate.setHours(0, 0, 0, 0)

function formatDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function renderDays() {
  const container = document.getElementById('days')
  container.innerHTML = ''
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const isMobile = window.innerWidth <= 600
  const range = isMobile ? 1 : 3
  
  for (let i = -range; i <= range; i++) {
    const date = new Date(currentDate)
    date.setDate(date.getDate() + i)
    
    const day = document.createElement('div')
    day.className = 'day'
    if (i === 0) day.classList.add('active')
    if (date > today) day.classList.add('disabled')
    
    day.innerHTML = `
      <div class="date">${date.getDate()}</div>
      <div class="weekday">${weekdays[date.getDay()]}</div>
    `
    
    if (date <= today) {
      day.onclick = () => {
        currentDate = new Date(date)
        renderDays()
        loadData()
      }
    } else {
      day.onclick = () => window.open('https://calendar.google.com', '_blank')
    }
    
    container.appendChild(day)
  }
}

async function loadData() {
  const dateStr = formatDate(currentDate)
  const content = document.getElementById('content')
  
  try {
    const response = await fetch(`./data/${dateStr}.json`)
    if (!response.ok) throw new Error('Not found')
    
    const data = await response.json()
    document.getElementById('timestamp').textContent = new Date(data.timestamp || Date.now()).toLocaleString()
    
    if (data.projects && data.projects.length > 0) {
      content.innerHTML = data.projects.map(p => `
        <div class="project">
          <h2>${p.name}</h2>
          <p>${p.description || p.transcription || ''}</p>
        </div>
      `).join('')
    } else {
      content.innerHTML = '<div class="empty">Nothing recorded for this day</div>'
    }
  } catch {
    content.innerHTML = '<div class="empty">Nothing recorded for this day</div>'
    document.getElementById('timestamp').textContent = '—'
  }
}

renderDays()
loadData()
window.addEventListener('resize', renderDays)