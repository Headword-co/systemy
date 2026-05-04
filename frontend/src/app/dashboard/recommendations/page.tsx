'use client';

import { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { ManagerAndAbove } from '@/components/RoleGuard';
import { useUser } from '@/contexts/UserContext';

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

type RecommendationPotential = 'high' | 'medium' | 'low';

interface RecommendationCardData {
  id: string;
  clientId?: string;
  projectId?: string;
  contactName?: string;
  type: string;
  score: number;
  summary: string;
  reasons: string[];
  suggestedAction?: string;
  potential: RecommendationPotential;
  rankingPosition: number;
  createdAt: string;
}

interface LeadRecommendationResponse {
  clientId: string;
  clientName?: string;
  score: number | null;
  recommendation: string | null;
  details?: {
    label?: 'LOW' | 'MEDIUM' | 'HIGH';
    breakdown?: Record<string, number>;
    inputs?: Record<string, unknown>;
    scoringModel?: string;
  } | null;
  updatedAt: string | null;
}

const getPotentialFromScore = (score: number): RecommendationPotential => {
  if (score >= 75) return 'high';
  if (score >= 40) return 'medium';
  return 'low';
};

const formatBreakdownLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replaceAll('_', ' ')
    .replace(/^./, (char) => char.toUpperCase());
};

const mapLeadRecommendationToCard = (
  item: LeadRecommendationResponse,
  index: number,
): RecommendationCardData => {
  const score = item.score ?? 0;
  const potential = getPotentialFromScore(score);
  const breakdown = item.details?.breakdown ?? {};

  const reasons = Object.entries(breakdown)
    .filter(([, points]) => Number(points) > 0)
    .map(([key, points]) => `${formatBreakdownLabel(key)}: +${points}`);

  return {
    id: item.clientId,
    clientId: item.clientId,
    contactName: item.clientName ?? 'Contact',
    type: 'lead_score',
    score,
    summary: item.recommendation ?? 'Lead score available',
    reasons:
      reasons.length > 0
        ? reasons
        : ['No positive scoring signals available yet.'],
    suggestedAction:
      potential === 'high'
        ? 'Prioritize follow-up with this contact.'
        : potential === 'medium'
        ? 'Continue nurturing this contact.'
        : 'Monitor this contact for future activity.',
    potential,
    rankingPosition: index + 1,
    createdAt: item.updatedAt ?? new Date().toISOString(),
  };
};

export default function RecommendationsPage() {
  const { user } = useUser();
  const [recommendations, setRecommendations] = useState<RecommendationCardData[]>([]);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadRecommendations() {
      setLoading(true);
      setErrorMessage(null);

      try {
        const isLeadScoreFilter =
          selectedType === 'all' || selectedType === 'lead_score';

        const endpoint = isLeadScoreFilter
          ? `${API_BASE}/leads/recommendations`
          : `${API_BASE}/recommendations?type=${encodeURIComponent(selectedType)}`;

        const res = await fetch(endpoint, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          setErrorMessage(
            errorData?.message || 'Failed to load recommendations.',
          );
          setLoading(false);
          return;
        }

        const data = await res.json();

        if (isLeadScoreFilter) {
          const leadRecommendations = Array.isArray(data.recommendations)
            ? data.recommendations
            : [];

          setRecommendations(
            leadRecommendations.map(mapLeadRecommendationToCard),
          );
        } else {
          setRecommendations(data.recommendations ?? []);
        }
      } catch (error) {
        console.error('Error loading recommendations:', error);
        setErrorMessage('Could not reach the server.');
      } finally {
        setLoading(false);
      }
    }

    loadRecommendations();
  }, [selectedType]);

  const stats = useMemo(() => {
    const total = recommendations.length;
    const high = recommendations.filter((r) => r.potential === 'high').length;
    const medium = recommendations.filter((r) => r.potential === 'medium').length;
    const avgScore =
      total > 0
        ? Math.round(
            recommendations.reduce((sum, item) => sum + item.score, 0) / total,
          )
        : 0;

    return { total, high, medium, avgScore };
  }, [recommendations]);

  const formatTypeLabel = (type: string) => {
    switch (type) {
      case 'lead_score':
        return 'Lead Score';
      case 'upsell_opportunity':
        return 'Upsell Opportunity';
      case 'reactivation_candidate':
        return 'Reactivation Candidate';
      default:
        return type.replaceAll('_', ' ');
    }
  };

  const getPotentialColor = (potential: RecommendationPotential) => {
    switch (potential) {
      case 'low':
        return { bg: '#FFE7E7', text: '#CC0000' };
      case 'medium':
        return { bg: '#FFF5E5', text: '#CC7A00' };
      case 'high':
        return { bg: '#E7F7E7', text: '#008A00' };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    });
  };

  const StatCard = ({
    title,
    value,
    subtitle,
  }: {
    title: string;
    value: string;
    subtitle?: string;
  }) => (
    <div
      style={{
        background: 'white',
        borderRadius: 15,
        padding: '22px',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '14px',
          color: 'rgba(0, 0, 0, 0.6)',
          marginBottom: '8px',
          fontFamily: 'Poppins',
          fontWeight: '600',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: '30px',
          fontWeight: '600',
          color: '#FF5900',
          marginBottom: '4px',
          fontFamily: 'Poppins',
        }}
      >
        {value}
      </div>
      {subtitle && (
        <div
          style={{
            fontSize: '12px',
            color: 'rgba(0, 0, 0, 0.5)',
            fontFamily: 'Poppins',
          }}
        >
          {subtitle}
        </div>
      )}
    </div>
  );

  return (
    <ManagerAndAbove>
      <div style={{ width: '100%', minHeight: '100vh', display: 'flex', background: 'white' }}>
        <Sidebar activePage="recommendations" />

        <div
          style={{
            flex: 1,
            minWidth: 0,
            marginLeft: 320,
            display: 'flex',
            flexDirection: 'column',
            background: 'rgba(217, 217, 217, 0.15)',
            padding: '20px 20px 20px 30px',
            gap: '20px',
            overflowX: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '10px',
            }}
          >
            <div>
              <div
                style={{
                  color: 'black',
                  fontSize: 32,
                  fontFamily: 'Poppins',
                  fontWeight: '600',
                }}
              >
                Recommendations
              </div>
              <div
                style={{
                  color: 'rgba(0, 0, 0, 0.6)',
                  fontSize: 14,
                  fontFamily: 'Poppins',
                  marginTop: 4,
                }}
              >
                AI-ranked opportunities from highest to lowest potential
              </div>
            </div>

            <div
              style={{
                fontSize: '14px',
                color: 'rgba(0, 0, 0, 0.7)',
                fontFamily: 'Poppins',
              }}
            >
              Welcome, {user?.firstName} {user?.lastName}
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '20px',
            }}
          >
            <StatCard title="Total Recommendations" value={stats.total.toString()} />
            <StatCard title="High potential" value={stats.high.toString()} />
            <StatCard title="Medium potential" value={stats.medium.toString()} />
            <StatCard title="Average Score" value={stats.avgScore.toString()} />
          </div>

          {/* Filters */}
          <div
            style={{
              background: 'white',
              borderRadius: 16,
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                fontSize: '18px',
                fontFamily: 'Poppins',
                color: 'rgba(0, 0, 0, 0.7)',
                fontWeight: '600',
              }}
            >
              Ranked Recommendations
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label
                style={{
                  fontFamily: 'Poppins',
                  fontSize: '14px',
                  color: 'rgba(0, 0, 0, 0.7)',
                }}
              >
                Filter by type:
              </label>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid rgba(0,0,0,0.15)',
                  fontFamily: 'Poppins',
                  background: 'white',
                }}
              >
                <option value="all">All</option>
                <option value="lead_score">Lead Scores</option>
                <option value="upsell_opportunity">Upsell Opportunities</option>
                <option value="reactivation_candidate">Reactivation Candidates</option>
              </select>
            </div>
          </div>

          {/* Content */}
          <div
            style={{
              background: 'white',
              borderRadius: 20,
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.15)',
              padding: '24px',
              flex: 1,
            }}
          >
            {loading ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  fontFamily: 'Poppins',
                  color: 'rgba(0, 0, 0, 0.6)',
                }}
              >
                Loading recommendations...
              </div>
            ) : errorMessage ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  fontFamily: 'Poppins',
                  color: '#CC0000',
                }}
              >
                {errorMessage}
              </div>
            ) : recommendations.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  fontFamily: 'Poppins',
                  color: 'rgba(0, 0, 0, 0.6)',
                }}
              >
                No recommendations available.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '16px' }}>
                {recommendations.map((rec) => {
                  const potentialColors = getPotentialColor(rec.potential);

                  return (
                    <div
                      key={rec.id}
                      style={{
                        border: '1px solid rgba(0,0,0,0.08)',
                        borderRadius: 16,
                        padding: '20px',
                        background: 'rgba(255,255,255,1)',
                        boxShadow: '0px 2px 6px rgba(0,0,0,0.05)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '16px',
                          marginBottom: '14px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div>
                          <div
                            style={{
                              fontFamily: 'Poppins',
                              color: '#FF5900',
                              fontWeight: '600',
                              fontSize: '18px',
                              marginBottom: '6px',
                            }}
                          >
                            #{rec.rankingPosition} • {rec.contactName ?? formatTypeLabel(rec.type)}
                          </div>

                          <div
                            style={{
                              fontFamily: 'Poppins',
                              color: 'rgba(0,0,0,0.65)',
                              fontSize: '13px',
                            }}
                          >
                            Generated on {formatDate(rec.createdAt)}
                          </div>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            flexWrap: 'wrap',
                          }}
                        >
                          <span
                            style={{
                              padding: '6px 12px',
                              borderRadius: 999,
                              background: 'rgba(255, 89, 0, 0.12)',
                              color: '#FF5900',
                              fontWeight: 600,
                              fontFamily: 'Poppins',
                              fontSize: '13px',
                            }}
                          >
                            Score: {rec.score}
                          </span>

                          <span
                            style={{
                              padding: '6px 12px',
                              borderRadius: 999,
                              background: potentialColors.bg,
                              color: potentialColors.text,
                              fontWeight: 600,
                              fontFamily: 'Poppins',
                              fontSize: '13px',
                              textTransform: 'capitalize',
                            }}
                          >
                            {rec.potential} potential
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          fontFamily: 'Poppins',
                          fontSize: '15px',
                          color: '#222',
                          marginBottom: '12px',
                          lineHeight: 1.5,
                        }}
                      >
                        {rec.summary}
                      </div>

                      {rec.reasons.length > 0 && (
                        <div style={{ marginBottom: '14px' }}>
                          <div
                            style={{
                              color: 'rgba(0,0,0,0.75)',
                              fontFamily: 'Poppins',
                              fontWeight: '600',
                              fontSize: '14px',
                              marginBottom: '8px',
                            }}
                          >
                            Why this is recommended:
                          </div>

                          <ul
                            style={{
                              margin: 0,
                              paddingLeft: '20px',
                              color: 'rgba(0,0,0,0.75)',
                              fontFamily: 'Poppins',
                              fontSize: '14px',
                              lineHeight: 1.6,
                            }}
                          >
                            {rec.reasons.map((reason, index) => (
                              <li key={index}>{reason}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {rec.suggestedAction && (
                        <div
                          style={{
                            padding: '12px 14px',
                            background: 'rgba(255, 89, 0, 0.06)',
                            borderRadius: 10,
                            fontFamily: 'Poppins',
                            fontSize: '14px',
                            color: '#333',
                          }}
                        >
                          <strong>Suggested action:</strong> {rec.suggestedAction}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </ManagerAndAbove>
  );
}