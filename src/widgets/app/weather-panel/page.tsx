'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';
import { useState } from 'react';

export const dynamic = 'force-dynamic';

interface WeatherCurrent {
  tempC: number;
  tempF: number;
  feelsLikeC: number;
  condition: string;
  conditionEmoji: string;
  humidity: number;
  windKph: number;
  uvIndex: number;
}

interface WeatherDay {
  date: string;
  dayName: string;
  maxTempC: number;
  minTempC: number;
  maxTempF: number;
  minTempF: number;
  condition: string;
  conditionEmoji: string;
  precipitationMm: number;
}

interface WeatherData {
  found: boolean;
  message?: string;
  city?: string;
  country?: string;
  timezone?: string;
  current?: WeatherCurrent;
  forecast?: WeatherDay[];
}

export default function WeatherPanel() {
  const theme = useTheme();
  const { isReady, getToolOutput, sendFollowUpMessage } = useWidgetSDK();
  const data = getToolOutput<WeatherData>();
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  const isDark = theme === 'dark';

  // Design tokens
  const bg = isDark ? '#0d1117' : '#ffffff';
  const surface = isDark ? '#161b22' : '#f6f8fa';
  const cardBg = isDark ? '#1c2128' : '#ffffff';
  const text = isDark ? '#e6edf3' : '#1a1a2e';
  const muted = isDark ? '#8b949e' : '#6e7681';
  const border = isDark ? 'rgba(240,246,252,0.1)' : 'rgba(31,35,40,0.12)';
  const accent = '#3b82f6';
  
  if (!isReady) {
    return (
      <div style={{ padding: 32, color: muted, fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🌤️</div>
        Connecting to weather service…
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: 32, color: muted, fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🌦️</div>
        Loading weather panel…
      </div>
    );
  }

  if (data.found === false || !data.current) {
    return (
      <div
        style={{
          padding: 32,
          color: text,
          fontFamily: 'system-ui, sans-serif',
          background: bg,
          borderRadius: 20,
          border: `1px solid ${border}`,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>🌪️</div>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>Location not found</div>
        <div style={{ fontSize: 13, color: muted }}>{data.message ?? 'No weather data available.'}</div>
      </div>
    );
  }

  const { city, country, current, forecast = [] } = data;

  const getUvLevel = (uv: number) => {
    if (uv <= 2) return { text: 'Low', color: '#10b981' };
    if (uv <= 5) return { text: 'Moderate', color: '#f59e0b' };
    if (uv <= 7) return { text: 'High', color: '#f97316' };
    return { text: 'Very High', color: '#ef4444' };
  };

  const uvInfo = getUvLevel(current.uvIndex);

  // Weather condition-specific theme colors
  const conditionLower = current.condition.toLowerCase();
  let gradientBg = `linear-gradient(135deg, ${accent}dd 0%, #1e40af 100%)`;
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle') || conditionLower.includes('shower')) {
    gradientBg = 'linear-gradient(135deg, #475569dd 0%, #1e293b 100%)';
  } else if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
    gradientBg = 'linear-gradient(135deg, #f59e0bdd 0%, #d97706 100%)';
  } else if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
    gradientBg = 'linear-gradient(135deg, #64748bdd 0%, #334155 100%)';
  } else if (conditionLower.includes('snow') || conditionLower.includes('ice') || conditionLower.includes('freeze')) {
    gradientBg = 'linear-gradient(135deg, #0ea5e9dd 0%, #0369a1 100%)';
  }

  return (
    <div
      style={{
        maxWidth: 580,
        width: '100%',
        background: bg,
        color: text,
        borderRadius: 20,
        border: `1px solid ${border}`,
        overflow: 'hidden',
        boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.6)' : '0 20px 60px rgba(0,0,0,0.1)',
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      }}
    >
      {/* ── CURRENT WEATHER HEADER CARD ─────────────────────── */}
      <div
        style={{
          padding: '24px 20px',
          background: gradientBg,
          color: '#ffffff',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          minHeight: 180,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', opacity: 0.85, letterSpacing: 0.5 }}>
              Live Weather
            </div>
            <h2 style={{ margin: '4px 0 2px', fontSize: 24, fontWeight: 800 }}>
              {city}
            </h2>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              {country}
            </div>
          </div>

          {/* Unit selector switch */}
          <button
            onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 8,
              color: '#ffffff',
              padding: '4px 10px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)')}
          >
            °{unit}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 64, fontWeight: 800, lineHeight: 0.9, letterSpacing: -2 }}>
              {unit === 'C' ? current.tempC : current.tempF}°
            </span>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 18, fontWeight: 700, textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                {current.conditionEmoji} {current.condition}
              </span>
              <span style={{ fontSize: 12, opacity: 0.85 }}>
                Feels like {unit === 'C' ? current.feelsLikeC : Math.round((current.feelsLikeC * 9)/5 + 32)}°
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── DETAILED METRICS ───────────────────────────────── */}
      <div style={{ padding: '16px 20px', borderBottom: `1px solid ${border}`, background: surface }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { label: 'Humidity', value: `${current.humidity}%`, icon: '💧' },
            { label: 'Wind Speed', value: `${current.windKph} km/h`, icon: '💨' },
            { label: 'UV Index', value: `${current.uvIndex} (${uvInfo.text})`, color: uvInfo.color, icon: '☀️' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                flex: 1,
                padding: '10px 12px',
                background: cardBg,
                borderRadius: 12,
                border: `1px solid ${border}`,
              }}
            >
              <div style={{ fontSize: 11, color: muted, marginBottom: 4 }}>
                {item.icon} {item.label}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: item.color || text }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FORECAST ───────────────────────────────────────── */}
      {forecast.length > 0 && (
        <div style={{ padding: '18px 20px' }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: muted,
              letterSpacing: 0.6,
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            {forecast.length}-Day Forecast
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {forecast.map((day, idx) => {
              const maxTemp = unit === 'C' ? day.maxTempC : day.maxTempF;
              const minTemp = unit === 'C' ? day.minTempC : day.minTempF;
              const isToday = idx === 0;

              return (
                <div
                  key={day.date}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: 12,
                    background: isToday ? (isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.05)') : 'transparent',
                    border: `1px solid ${isToday ? 'rgba(59,130,246,0.2)' : 'transparent'}`,
                  }}
                >
                  {/* Day Name */}
                  <span style={{ fontSize: 14, fontWeight: isToday ? 700 : 500, width: 70 }}>
                    {isToday ? 'Today' : day.dayName}
                  </span>

                  {/* Condition badge */}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, flex: 1, paddingLeft: 12 }}>
                    <span>{day.conditionEmoji}</span>
                    <span style={{ color: text, opacity: 0.85, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>
                      {day.condition}
                    </span>
                  </span>

                  {/* Precipitation */}
                  {day.precipitationMm > 0 ? (
                    <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 600, marginRight: 16 }}>
                      💧 {day.precipitationMm}mm
                    </span>
                  ) : (
                    <span style={{ width: 40 }} />
                  )}

                  {/* Temp Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'flex-end', width: 80 }}>
                    <span style={{ fontSize: 13, color: muted }}>{minTemp}°</span>
                    <div style={{ width: 28, height: 4, background: 'rgba(128,128,128,0.2)', borderRadius: 999 }}>
                      <div
                        style={{
                          height: '100%',
                          background: `linear-gradient(90deg, ${accent}, #ef4444)`,
                          borderRadius: 999,
                          width: '100%',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{maxTemp}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── FOLLOW UP CTA ──────────────────────────────────── */}
      <div style={{ padding: '0 20px 20px' }}>
        <button
          onClick={() =>
            sendFollowUpMessage(
              `How should we pack for a trip to ${city} given this weather forecast?`
            )
          }
          style={{
            width: '100%',
            padding: '11px',
            borderRadius: 12,
            border: `1px solid ${border}`,
            background: surface,
            color: text,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = isDark ? '#1c2128' : '#eaeef2')}
          onMouseLeave={(e) => (e.currentTarget.style.background = surface)}
        >
          🧳 Ask Agent: What to pack?
        </button>
      </div>
    </div>
  );
}
