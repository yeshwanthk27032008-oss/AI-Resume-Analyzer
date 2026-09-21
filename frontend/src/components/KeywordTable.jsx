import React, { useState } from 'react';
import { Search, CheckCircle2, XCircle, Filter } from 'lucide-react';

export default function KeywordTable({ keywords = [] }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'matched' | 'missing'
  const [searchTerm, setSearchTerm] = useState('');

  const filteredKeywords = keywords.filter((item) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'matched' && item.status === 'Matched') ||
      (filter === 'missing' && item.status === 'Missing');

    const matchesSearch = item.keyword
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const matchedCount = keywords.filter((k) => k.status === 'Matched').length;
  const missingCount = keywords.filter((k) => k.status === 'Missing').length;

  return (
    <div className="keyword-card">
      <div className="card-title-row">
        <div>
          <h3>Job Keyword Analysis</h3>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.88rem', marginTop: '4px' }}>
            Comparison of high-frequency keywords extracted from the job posting
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Search box */}
          <div style={{ position: 'relative' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--gray-400)' }}
            />
            <input
              type="text"
              placeholder="Search keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px', paddingRight: '12px', paddingTop: '6px', paddingBottom: '6px', fontSize: '0.88rem', width: '180px' }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setFilter('all')}
              className="sample-loader-btn"
              style={{
                background: filter === 'all' ? 'var(--primary-700)' : 'var(--gray-100)',
                color: filter === 'all' ? 'var(--white)' : 'var(--gray-700)',
              }}
            >
              All ({keywords.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter('matched')}
              className="sample-loader-btn"
              style={{
                background: filter === 'matched' ? '#166534' : '#dcfce7',
                color: filter === 'matched' ? 'var(--white)' : '#166534',
              }}
            >
              Found ({matchedCount})
            </button>
            <button
              type="button"
              onClick={() => setFilter('missing')}
              className="sample-loader-btn"
              style={{
                background: filter === 'missing' ? '#991b1b' : '#fee2e2',
                color: filter === 'missing' ? 'var(--white)' : '#991b1b',
              }}
            >
              Missing ({missingCount})
            </button>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <table className="keyword-table">
          <thead>
            <tr>
              <th>Keyword / Term</th>
              <th>Required in Job</th>
              <th>Found in Resume</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredKeywords.length > 0 ? (
              filteredKeywords.map((item, index) => (
                <tr key={index}>
                  <td style={{ fontWeight: '700', textTransform: 'capitalize' }}>
                    {item.keyword}
                  </td>
                  <td>
                    <span style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>Yes</span>
                  </td>
                  <td>
                    <span style={{ color: item.found ? '#166534' : '#991b1b', fontWeight: '600' }}>
                      {item.found ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${item.status === 'Matched' ? 'matched' : 'missing'}`}>
                      {item.status === 'Matched' ? (
                        <>
                          <CheckCircle2 size={13} />
                          <span>Matched</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={13} />
                          <span>Missing</span>
                        </>
                      )}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '28px', color: 'var(--gray-400)' }}>
                  No keywords match the current filter or search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
