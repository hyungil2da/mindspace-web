import React from 'react';
import '../styles/TeamSection.css';
import { teamMembers } from '../data/team';
import '../styles/color.css';
function TeamSection() {
  // 역할별로 그룹화
  const grouped = teamMembers.reduce((acc, { name, role }) => {
    acc[role] = acc[role] ? [...acc[role], name] : [name];
    return acc;
  }, {});

  const roleEntries = Object.entries(grouped);

  // 교차 줄 분할
  const firstLine = roleEntries.filter((_, i) => i % 2 === 0);
  const secondLine = roleEntries.filter((_, i) => i % 2 === 1);

  return (
    <section className="team-section" id="team">
      <h2 className="team-title">개발자 소개</h2>
      <div className="team-rows">
        {[firstLine, secondLine].map((line, i) => (
          <div className="team-row" key={i}>
            {line.map(([role, names]) => (
              <div className="team-role" key={role}>
                <p className="team-role-title">{role}</p>
                <p className="team-names">{names.join(', ')}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export default TeamSection;
