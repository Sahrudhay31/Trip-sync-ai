'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';
import { useState } from 'react';

export const dynamic = 'force-dynamic';

interface Alternative {
  id: string;
  name: string;
  imageUrl: string;
  type: string;
}

interface DestinationData {
  id: string;
  name: string;
  type: string;
  imageUrl: string;
  tags: string[];
  dailyBudget: number;
  estimatedTripBudget: number;
  whyItFits: string;
  matchScore: number;
  matchedInterests: string[];
  sampleActivities: string[];
  sampleFood: string[];
  days: number;
  alternatives: Alternative[];
}

const TYPE_EMOJI: Record<string, string> = {
  beach: '🏖️',
  mountain: '🏔️',
  city: '🌆',
  cultural: '🏛️',
  adventure: '🧗',
};

export default function DestinationCard() {
  const theme = useTheme();
  const { isReady, getToolOutput, sendFollowUpMessage, requestFullscreen, requestInline, displayMode } =
    useWidgetSDK();
  const data = getToolOutput<DestinationData>();
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'food'>('overview');
  const [imgError, setImgError] = useState(false);

  const isDark = theme === 'dark';

  // Design tokens
  const bg = isDark ? '#0d1117' : '#ffffff';
  const surface = isDark ? '#161b22' : '#f6f8fa';
  const surfaceHover = isDark ? '#1c2128' : '#eaeef2';
  const text = isDark ? '#e6edf3' : '#1a1a2e';
  const muted = isDark ? '#8b949e' : '#6e7681';
  const border = isDark ? 'rgba(240,246,252,0.1)' : 'rgba(31,35,40,0.12)';
  const accent = '#3b82f6';
  const accentDim = isDark ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)';
  const green = '#10b981';
  const amber = '#f59e0b';

  if (!isReady) {
    return (
      <div style={{ padding: 32, color: muted, fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>✈️</div>
        Connecting to TripSync…
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: 32, color: muted, fontFamily: 'system-ui, sans-serif', textAlign: 'center' }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🌍</div>
        Loading destination…
      </div>
    );
  }

  const name = data.name ?? 'Destination';
  const imageUrl = imgError ? '' : (data.imageUrl ?? '');
  const tags = data.tags ?? [];
  const activities = data.sampleActivities ?? [];
  const food = data.sampleFood ?? [];
  const alternatives = data.alternatives ?? [];
  const dailyBudget = data.dailyBudget ?? 0;
  const tripBudget = data.estimatedTripBudget ?? 0;
  const days = data.days ?? 0;
  const matchScore = Math.min(100, Math.max(0, Math.round(data.matchScore ?? 0)));
  const typeEmoji = TYPE_EMOJI[data.type] ?? '🌍';
  const isFs = displayMode === 'fullscreen';

  const scoreColor =
    matchScore >= 80 ? green : matchScore >= 50 ? accent : amber;

  const tabs = [
    { id: 'overview' as const, label: 'Overview' },
    { id: 'activities' as const, label: '🎯 Activities' },
    { id: 'food' as const, label: '🍜 Food' },
  ];

  return (
    <div
      style={{
        maxWidth: isFs ? '100%' : 580,
        width: '100%',
        background: bg,
        color: text,
        borderRadius: isFs ? 0 : 20,
        overflow: 'hidden',
        border: `1px solid ${border}`,
        boxShadow: isDark
          ? '0 20px 60px rgba(0,0,0,0.6)'
          : '0 20px 60px rgba(0,0,0,0.12)',
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
        transition: 'all 0.3s ease',
      }}
    >
      {/* ── HERO IMAGE ─────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16 / 7',
          background: `linear-gradient(135deg, ${accentDim} 0%, ${isDark ? '#1a1a2e' : '#e8f4fd'} 100%)`,
          overflow: 'hidden',
        }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={name}
            onError={() => setImgError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'transform 0.4s ease',
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)',
          }}
        />

        {/* Top-right controls */}
        <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 8 }}>
          <button
            onClick={() => (isFs ? requestInline() : requestFullscreen())}
            style={{
              background: 'rgba(0,0,0,0.45)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff',
              borderRadius: 8,
              padding: '5px 10px',
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            {isFs ? '⊡ Collapse' : '⛶ Expand'}
          </button>
        </div>

        {/* Top-left badge */}
        <div
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: accent,
            color: '#fff',
            fontSize: 11,
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: 999,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          {typeEmoji} Top Pick · {data.type ?? 'trip'}
        </div>

        {/* Bottom name + match score */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '40px 18px 16px',
          }}
        >
          <h2
            style={{
              margin: '0 0 8px',
              color: '#fff',
              fontSize: 28,
              fontWeight: 800,
              lineHeight: 1.1,
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            {name}
          </h2>

          {/* Match score bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                flex: 1,
                height: 6,
                background: 'rgba(255,255,255,0.25)',
                borderRadius: 999,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${matchScore}%`,
                  background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}cc)`,
                  borderRadius: 999,
                  transition: 'width 0.8s cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            </div>
            <span
              style={{
                color: scoreColor,
                fontSize: 13,
                fontWeight: 700,
                minWidth: 46,
                background: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(6px)',
                padding: '2px 8px',
                borderRadius: 999,
              }}
            >
              {matchScore}% match
            </span>
          </div>
        </div>
      </div>

      {/* ── BODY ───────────────────────────────────────────── */}
      <div style={{ padding: '16px 18px 0' }}>

        {/* Budget pills */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Per day', value: `$${dailyBudget.toLocaleString()}`, icon: '📅' },
            { label: `${days}-day est.`, value: `$${tripBudget.toLocaleString()}`, icon: '💰' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                flex: 1,
                padding: '10px 14px',
                background: surface,
                borderRadius: 12,
                border: `1px solid ${border}`,
              }}
            >
              <div style={{ fontSize: 11, color: muted, marginBottom: 2 }}>
                {item.icon} {item.label}
              </div>
              <div style={{ fontSize: 19, fontWeight: 700, color: text }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {tags.slice(0, 7).map((t) => (
            <span
              key={t}
              style={{
                fontSize: 11,
                padding: '4px 10px',
                borderRadius: 999,
                background: accentDim,
                color: accent,
                fontWeight: 600,
                textTransform: 'capitalize',
                border: `1px solid ${isDark ? 'rgba(59,130,246,0.25)' : 'rgba(59,130,246,0.2)'}`,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 2,
            marginBottom: 14,
            background: surface,
            borderRadius: 10,
            padding: 3,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '7px 4px',
                borderRadius: 8,
                border: 'none',
                background: activeTab === tab.id ? (isDark ? '#30363d' : '#ffffff') : 'transparent',
                color: activeTab === tab.id ? text : muted,
                fontSize: 12,
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: activeTab === tab.id
                  ? isDark ? '0 1px 4px rgba(0,0,0,0.4)' : '0 1px 4px rgba(0,0,0,0.08)'
                  : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div style={{ minHeight: 80, marginBottom: 16 }}>
          {activeTab === 'overview' && (
            <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: text, opacity: 0.9 }}>
              {data.whyItFits ?? ''}
            </p>
          )}

          {activeTab === 'activities' && (
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.75, color: text }}>
              {activities.slice(0, 6).map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          )}

          {activeTab === 'food' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {food.slice(0, 5).map((f, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 12px',
                    background: surface,
                    borderRadius: 10,
                    border: `1px solid ${border}`,
                    fontSize: 13,
                    color: text,
                  }}
                >
                  🍽️ {f}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── ALTERNATIVES ───────────────────────────────────── */}
      {alternatives.length > 0 && (
        <div style={{ padding: '0 18px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: muted, marginBottom: 10, letterSpacing: 0.6, textTransform: 'uppercase' }}>
            Also Consider
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
            {alternatives.map((alt) => (
              <div
                key={alt.id}
                style={{
                  flexShrink: 0,
                  width: 110,
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: `1px solid ${border}`,
                  background: surface,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = isDark
                    ? '0 8px 24px rgba(0,0,0,0.4)'
                    : '0 8px 24px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                <div style={{ width: '100%', aspectRatio: '4/3', background: accentDim, overflow: 'hidden' }}>
                  {alt.imageUrl ? (
                    <img
                      src={alt.imageUrl}
                      alt={alt.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                      {TYPE_EMOJI[alt.type] ?? '🌍'}
                    </div>
                  )}
                </div>
                <div style={{ padding: '6px 8px' }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {alt.name}
                  </div>
                  <div style={{ fontSize: 10, color: muted, textTransform: 'capitalize' }}>{alt.type}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CTA BUTTON ─────────────────────────────────────── */}
      <div style={{ padding: '0 18px 18px', display: 'flex', gap: 10 }}>
        <button
          onClick={() =>
            sendFollowUpMessage(
              `Generate a ${days}-day itinerary for ${name}`
            )
          }
          style={{
            flex: 1,
            padding: '12px 18px',
            borderRadius: 12,
            border: 'none',
            background: `linear-gradient(135deg, ${accent} 0%, #6366f1 100%)`,
            color: '#fff',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: 0.2,
            boxShadow: `0 4px 16px rgba(59,130,246,0.4)`,
            transition: 'opacity 0.15s ease, transform 0.15s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = '0.9';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = '1';
            (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
          }}
        >
          📋 Plan {days}-Day Itinerary
        </button>
        <button
          onClick={() =>
            sendFollowUpMessage(
              `What's the weather like in ${name} right now?`
            )
          }
          style={{
            padding: '12px 14px',
            borderRadius: 12,
            border: `1px solid ${border}`,
            background: surface,
            color: text,
            fontSize: 14,
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'background 0.15s ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = surfaceHover;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = surface;
          }}
        >
          🌤️ Weather
        </button>
      </div>
    </div>
  );
}
