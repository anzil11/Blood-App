import React from 'react';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

const DataTable = ({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No records found',
  pagination = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  if (isLoading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading records...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{
        padding: '3.5rem 2rem',
        textAlign: 'center',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-light)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
      }}>
        <Inbox size={40} color="var(--text-light)" />
        <h4 style={{ color: 'var(--secondary)', fontWeight: 600 }}>No Data Available</h4>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{ width: col.width || 'auto', textAlign: col.align || 'left' }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={row.id || rowIdx}>
                {columns.map((col, colIdx) => (
                  <td key={colIdx} style={{ textAlign: col.align || 'left' }}>
                    {col.render ? col.render(row, rowIdx) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1.25rem',
          padding: '0.5rem 0',
        }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Page {currentPage} of {totalPages}
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              className="btn btn-sm btn-secondary"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
            >
              <ChevronLeft size={16} /> Previous
            </button>
            <button
              className="btn btn-sm btn-secondary"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Next <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
