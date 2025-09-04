import React from "react";

type Category = {
  id: number;
  name: string;
};

export default function SideNavbar({ 
  categories,
  onSelectCategory 
}: { 
  categories: Category[];
  onSelectCategory?: (categoryId: number | null) => void;
}) {
  return (
    <aside className="w-64 bg-white bg-opacity-90 rounded shadow p-4 mr-6 mt-4 h-fit">
      <h2 className="text-lg font-bold mb-4">Categories</h2>
      <ul className="space-y-2">
        <li>
          <button
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-200 transition"
            onClick={() => onSelectCategory && onSelectCategory(null)}
          >
            All Categories
          </button>
        </li>
        {categories.map(cat => (
          <li key={cat.id}>
            <button
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-200 transition"
              onClick={() => onSelectCategory && onSelectCategory(cat.id)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
