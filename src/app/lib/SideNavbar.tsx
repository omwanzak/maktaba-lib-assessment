import React from "react";

const categories = [
  "Psychology",
  "Science Fiction",
  "History",
  "Romance",
  "Technology",
  "Children",
  "Mystery",
  "Fantasy",
  "Biography",
];

export default function SideNavbar({ onSelectCategory }: { onSelectCategory?: (cat: string) => void }) {
  return (
    <aside className="w-64 bg-white bg-opacity-90 rounded shadow p-4 mr-6 mt-4 h-fit">
      <h2 className="text-lg font-bold mb-4">Categories</h2>
      <ul className="space-y-2">
        {categories.map(cat => (
          <li key={cat}>
            <button
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-200 transition"
              onClick={() => onSelectCategory && onSelectCategory(cat)}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
