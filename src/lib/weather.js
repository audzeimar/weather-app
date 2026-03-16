const WEATHER_CODES = {
  0: { label: 'Clear sky', dayIcon: '☀️', nightIcon: '🌙' },
  1: { label: 'Mainly clear', dayIcon: '🌤️', nightIcon: '🌙' },
  2: { label: 'Partly cloudy', dayIcon: '⛅', nightIcon: '☁️' },
  3: { label: 'Overcast', dayIcon: '☁️', nightIcon: '☁️' },
  45: { label: 'Fog', dayIcon: '🌫️', nightIcon: '🌫️' },
  48: { label: 'Depositing rime fog', dayIcon: '🌫️', nightIcon: '🌫️' },
  51: { label: 'Light drizzle', dayIcon: '🌦️', nightIcon: '🌧️' },
  53: { label: 'Drizzle', dayIcon: '🌦️', nightIcon: '🌧️' },
  55: { label: 'Dense drizzle', dayIcon: '🌧️', nightIcon: '🌧️' },
  56: { label: 'Light freezing drizzle', dayIcon: '🌧️', nightIcon: '🌧️' },
  57: { label: 'Freezing drizzle', dayIcon: '🌧️', nightIcon: '🌧️' },
  61: { label: 'Light rain', dayIcon: '🌦️', nightIcon: '🌧️' },
  63: { label: 'Rain', dayIcon: '🌧️', nightIcon: '🌧️' },
  65: { label: 'Heavy rain', dayIcon: '⛈️', nightIcon: '⛈️' },
  66: { label: 'Light freezing rain', dayIcon: '🌧️', nightIcon: '🌧️' },
  67: { label: 'Freezing rain', dayIcon: '🌧️', nightIcon: '🌧️' },
  71: { label: 'Light snow', dayIcon: '🌨️', nightIcon: '🌨️' },
  73: { label: 'Snow', dayIcon: '❄️', nightIcon: '❄️' },
  75: { label: 'Heavy snow', dayIcon: '❄️', nightIcon: '❄️' },
  77: { label: 'Snow grains', dayIcon: '🌨️', nightIcon: '🌨️' },
  80: { label: 'Rain showers', dayIcon: '🌦️', nightIcon: '🌧️' },
  81: { label: 'Rain showers', dayIcon: '🌧️', nightIcon: '🌧️' },
  82: { label: 'Violent rain showers', dayIcon: '⛈️', nightIcon: '⛈️' },
  85: { label: 'Snow showers', dayIcon: '🌨️', nightIcon: '🌨️' },
  86: { label: 'Heavy snow showers', dayIcon: '❄️', nightIcon: '❄️' },
  95: { label: 'Thunderstorm', dayIcon: '⛈️', nightIcon: '⛈️' },
  96: { label: 'Thunderstorm with hail', dayIcon: '⛈️', nightIcon: '⛈️' },
  99: { label: 'Thunderstorm with hail', dayIcon: '⛈️', nightIcon: '⛈️' },
}

export function getWeatherMeta(code, isDay = true) {
  const entry = WEATHER_CODES[code] ?? {
    label: 'Weather unavailable',
    dayIcon: '🌤️',
    nightIcon: '🌙',
  }

  return {
    ...entry,
    icon: isDay ? entry.dayIcon : entry.nightIcon,
  }
}

export function formatTemperature(value, unit = 'c') {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '--'
  }

  if (unit === 'f') {
    return `${Math.round((Number(value) * 9) / 5 + 32)}°F`
  }

  return `${Math.round(Number(value))}°C`
}

export function formatWind(value, unit = 'c') {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return '--'
  }

  if (unit === 'f') {
    return `${Math.round(Number(value) * 0.621371)} mph`
  }

  return `${Math.round(Number(value))} km/h`
}

export function formatTimeLabel(value) {
  const date = new Date(value)
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDayLabel(value) {
  const date = new Date(value)
  return date.toLocaleDateString([], {
    weekday: 'short',
  })
}

export function buildLocationLabel(location) {
  const parts = [location.name]

  if (location.admin1 && location.admin1 !== location.name) {
    parts.push(location.admin1)
  }

  if (location.country) {
    parts.push(location.country)
  }

  return parts.join(', ')
}

export function pickForecastSlices(forecast) {
  const hourlyTimes = forecast.hourly.time
  const currentTime = forecast.current.time

  let startIndex = hourlyTimes.indexOf(currentTime)
  if (startIndex === -1) {
    startIndex = 0
  }

  const hourly = hourlyTimes.slice(startIndex, startIndex + 6).map((time, index) => ({
    time,
    temperature: forecast.hourly.temperature_2m[startIndex + index],
    code: forecast.hourly.weather_code[startIndex + index],
  }))

  const daily = forecast.daily.time.slice(0, 5).map((time, index) => ({
    time,
    code: forecast.daily.weather_code[index],
    max: forecast.daily.temperature_2m_max[index],
    min: forecast.daily.temperature_2m_min[index],
    precipitationProbability: forecast.daily.precipitation_probability_max[index],
  }))

  return { hourly, daily }
}
