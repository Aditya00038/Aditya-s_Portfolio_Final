import { useEffect, useState } from 'react';
import './GooeyNav.css';

const GooeyNav = ({
  items,
  initialActiveIndex = 0,
  onItemClick
}) => {
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [burstIndex, setBurstIndex] = useState(null);

  const handleClick = (e, index, item) => {
    e.preventDefault();
    if (activeIndex === index) return;

    // Trigger burst animation
    setBurstIndex(index);
    setTimeout(() => setBurstIndex(null), 600);

    setActiveIndex(index);

    // Call the external click handler
    if (onItemClick) {
      onItemClick(item, index);
    }
  };

  // Update active index when initialActiveIndex changes from parent
  useEffect(() => {
    setActiveIndex(initialActiveIndex);
  }, [initialActiveIndex]);

  return (
    <div className="gooey-nav-container">
      <nav className="gooey-nav">
        <ul>
          {items.map((item, index) => (
            <li 
              key={index} 
              className={`${activeIndex === index ? 'active' : ''} ${burstIndex === index ? 'burst' : ''}`}
              onClick={e => handleClick(e, index, item)}
            >
              <a href={item.href}>
                {item.label}
              </a>
              {/* Burst particles */}
              <span className="particles">
                {[...Array(12)].map((_, i) => (
                  <span 
                    key={i} 
                    className="particle"
                    style={{ '--i': i }}
                  />
                ))}
              </span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default GooeyNav;
