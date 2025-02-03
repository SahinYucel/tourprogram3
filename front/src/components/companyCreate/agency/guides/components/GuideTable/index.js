import React from 'react';
import GuideTableHeader from './GuideTableHeader';
import GuideTableRow from './GuideTableRow';

const GuideTable = ({ guides, onEdit, onDelete }) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="table-responsive">
          <table className="table">
            <GuideTableHeader />
            <tbody>
              {guides.map((guide) => (
                <GuideTableRow 
                  key={guide.id}
                  guide={guide}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GuideTable; 