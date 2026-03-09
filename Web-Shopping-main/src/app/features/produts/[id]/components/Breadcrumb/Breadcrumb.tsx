import React from "react";
import "./Breadcrumb.css";

// Type for Breadcrumb Item
interface BreadcrumbItem {
  label: string;
  link: string;
}

// Props interface for the Breadcrumb component
interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <ul className="wfg">
      {items.map((item, index) => (
        <li
          key={index}
          className={index === items.length - 1 ? "sug" : "sug lpwq"}
        >
          {index === items.length - 1 ? (
            <span className="sug-a">{item.label}</span>
          ) : (
            <a href={item.link} className="sug-a lpwq">
              <span>{item.label}</span>
            </a>
          )}
        </li>
      ))}
    </ul>
  );
};

export default Breadcrumb;
