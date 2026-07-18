'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';
import { useState } from 'react';

export const dynamic = 'force-dynamic';

interface DayPlan {
  dayId: string;
  day: number;
  title: string;
  imageUrl: string;
  places: string[];
  activities: string[];
  food: string[];
  estimatedBudget: number;
}

interface ItineraryData {
  found: boolean;
  message?: string;
  destinationId: string;
  destinationName: string;
  type: string;
  imageUrl: string;
  days: number;
  totalEstimatedBudget: number;
  currency: string;
  dayPlans: DayPlan[];
}

const DAY_COLORS = [
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f59e0b',
  '#10b981',
  '#06b6d4',
  '#f97316',
  '#6366f1',
];

export default function ItineraryDays() {
  const theme = useTheme();
  const { isReady, getToolOutput, sendFollowUpMessage } = useWidgetSDK();
  const data = getToolOutput<ItineraryData>();
  const [openDay, setOpenDay] = useState<string | null>(null);

  const isDark = theme === 'dark';

  // Design tokens
  const bg = isDark ? '#0d1117' : '#ffffff';
  const surface = isDark ? '#161b22' : '#f6f8fa';
  const cardBg = isDark ? '#161b22' : '#ffffff';
  const text = isDark ? '#e6edf3' : '#1a1a2e';
  const muted = isDark ? '#8b949e' : '#6e7681';
  const border = isDark ? 'rgba(240,246,252,0.1)' : 'rgba(31,35,40,0.12)';
  const green = '#10b981';

  if (!isReady) {
    return (
      <div style={{ padding: 32, color: muted, fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
        Connecting to TripSync…
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: 32, color: muted, fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🗺️</div>
        Loading itinerary…
      </div>
    );
  }

  if (data.found === false) {
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
        <div style={{ fontSize: 40, marginBottom: 12 }}>🤔</div>
        <div style={{ fontWeight: 600, marginBottom: 6 }}>No itinerary found</div>
        <div style={{ fontSize: 13, color: muted }}>{data.message}</div>
      </div>
    );
  }

  const destinationName = data.destinationName ?? 'Your trip';
  const currency = data.currency ?? 'USD';
  const totalBudget = data.totalEstimatedBudget ?? 0;
  const days = data.days ?? 0;
  const dayPlans = data.dayPlans ?? [];
  const cur = currency === 'USD' ? '$' : `${currency} `;

  // Calculate cumulative spend for progress bar
  const spentSoFar = dayPlans.reduce((sum, d) => sum + (d.estimatedBudget ?? 0), 0);

  return (
    <div
      style={{
        maxWidth: 680,
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
      {/* ── HEADER ────────────────────────────────────────── */}
      <div
        style={{
          padding: '18px 20px 16px',
          borderBottom: `1px solid ${border}`,
          background: surface,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <div
              style={{
                fontSize: 11,
                color: green,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              🗺️ {days}-Day Itinerary
            </div>
            <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>
              {destinationName}
            </h2>
            <div style={{ fontSize: 12, color: muted }}>
              Estimated budget:{' '}
              <span style={{ color: text, fontWeight: 700 }}>
                {cur}{totalBudget.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Day count badges */}
          <div
            style={{
              background: isDark ? 'rgba(16,185,129,0.15)' : 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 12,
              padding: '10px 16px',
              textAlign: 'center',
              flexShrink: 0,
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 800, color: green, lineHeight: 1 }}>{days}</div>
            <div style={{ fontSize: 10, color: green, fontWeight: 600, marginTop: 2 }}>DAYS</div>
          </div>
        </div>

        {/* Budget progress bar */}
        <div style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: muted, marginBottom: 5 }}>
            <span>Budget allocation</span>
            <span>{cur}{spentSoFar.toLocaleString()} / {cur}{totalBudget.toLocaleString()}</span>
          </div>
          <div
            style={{
              height: 6,
              background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              borderRadius: 999,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${totalBudget > 0 ? Math.min(100, (spentSoFar / totalBudget) * 100) : 0}%`,
                background: `linear-gradient(90deg, ${green} 0%, #06b6d4 100%)`,
                borderRadius: 999,
                transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── TIMELINE ──────────────────────────────────────── */}
      <div style={{ padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 0 }}>
        {dayPlans.map((day, idx) => {
          const isOpen = openDay === day.dayId;
          const color = DAY_COLORS[idx % DAY_COLORS.length];
          const places = day.places ?? [];
          const activities = day.activities ?? [];
          const food = day.food ?? [];
          const isLast = idx === dayPlans.length - 1;

          return (
            <div key={day.dayId} style={{ display: 'flex', gap: 14 }}>
              {/* ── Stepper spine ── */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: isOpen ? color : (isDark ? '#21262d' : '#eaeef2'),
                    border: `2px solid ${isOpen ? color : border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: 800,
                    color: isOpen ? '#fff' : muted,
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    cursor: 'pointer',
                    zIndex: 1,
                  }}
                  onClick={() => setOpenDay(isOpen ? null : day.dayId)}
                >
                  {day.day}
                </div>
                {!isLast && (
                  <div
                    style={{
                      width: 2,
                      flex: 1,
                      minHeight: 24,
                      background: isOpen
                        ? `linear-gradient(to bottom, ${color}, transparent)`
                        : (isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'),
                      marginTop: 4,
                      transition: 'background 0.2s ease',
                    }}
                  />
                )}
              </div>

              {/* ── Day card ── */}
              <div
                style={{
                  flex: 1,
                  marginBottom: isLast ? 0 : 12,
                  borderRadius: 14,
                  border: `1px solid ${isOpen ? color + '55' : border}`,
                  background: cardBg,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: isOpen
                    ? isDark
                      ? `0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 ${color}22`
                      : `0 4px 20px rgba(0,0,0,0.08), inset 0 1px 0 ${color}22`
                    : 'none',
                }}
              >
                {/* Card header — always visible */}
                <div
                  onClick={() => setOpenDay(isOpen ? null : day.dayId)}
                  style={{
                    padding: '12px 14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  {day.imageUrl && (
                    <div
                      style={{
                        width: 52,
                        height: 40,
                        borderRadius: 8,
                        overflow: 'hidden',
                        flexShrink: 0,
                        background: isDark ? '#21262d' : '#eaeef2',
                      }}
                    >
                      <img
                        src={day.imageUrl}
                        alt={day.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: text, marginBottom: 2 }}>
                      {day.title}
                    </div>
                    <div style={{ fontSize: 12, color: muted }}>
                      {!isOpen && places.length > 0
                        ? places.slice(0, 2).join(' · ')
                        : `${cur}${(day.estimatedBudget ?? 0).toLocaleString()} / day`}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      color: muted,
                      transition: 'transform 0.2s ease',
                      transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                      flexShrink: 0,
                    }}
                  >
                    ›
                  </div>
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div
                    style={{
                      padding: '0 14px 14px',
                      borderTop: `1px solid ${border}`,
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: activities.length > 0 && food.length > 0 ? '1fr 1fr' : '1fr',
                        gap: 10,
                        marginTop: 12,
                      }}
                    >
                      {activities.length > 0 && (
                        <div>
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color,
                              textTransform: 'uppercase',
                              letterSpacing: 0.8,
                              marginBottom: 6,
                            }}
                          >
                            🎯 Activities
                          </div>
                          <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12.5, lineHeight: 1.7, color: text }}>
                            {activities.map((a, i) => (
                              <li key={i}>{a}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {food.length > 0 && (
                        <div>
                          <div
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color,
                              textTransform: 'uppercase',
                              letterSpacing: 0.8,
                              marginBottom: 6,
                            }}
                          >
                            🍜 Food
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            {food.map((f, i) => (
                              <div
                                key={i}
                                style={{
                                  fontSize: 12.5,
                                  color: text,
                                  padding: '5px 8px',
                                  background: isDark ? '#0d1117' : '#f6f8fa',
                                  borderRadius: 8,
                                  border: `1px solid ${border}`,
                                }}
                              >
                                {f}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Budget row */}
                    <div
                      style={{
                        marginTop: 12,
                        padding: '8px 12px',
                        background: isDark ? `${color}15` : `${color}10`,
                        borderRadius: 10,
                        border: `1px solid ${color}30`,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span style={{ fontSize: 12, color: muted }}>Day {day.day} budget</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color }}>
                        {cur}{(day.estimatedBudget ?? 0).toLocaleString()}
                      </span>
                    </div>

                    {/* Day CTA */}
                    <button
                      onClick={() =>
                        sendFollowUpMessage(
                          `Tell me more about Day ${day.day} in ${destinationName}: ${day.title}`
                        )
                      }
                      style={{
                        marginTop: 10,
                        width: '100%',
                        padding: '9px',
                        borderRadius: 10,
                        border: `1px solid ${color}40`,
                        background: `${color}18`,
                        color,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'opacity 0.15s ease',
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0.8')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
                    >
                      ✨ Explore Day {day.day} in detail
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
