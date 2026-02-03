import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  Menu as MenuIcon,
  X
} from "lucide-react";

// Format labels for display (converts snake_case to Title Case)
const formatLabel = (str) => {
  if (!str) return '';
  return str
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export default function MenuBuilder({ sections, onChange }) {
  const [editingSection, setEditingSection] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [newSectionName, setNewSectionName] = useState("");
  const [itemForm, setItemForm] = useState({
    name: "",
    description: "",
    price: "",
    dietary_flags: []
  });

  const dietaryOptions = [
    { value: "vegetarian", label: "Vegetarian" },
    { value: "vegan", label: "Vegan" },
    { value: "gluten_free", label: "Gluten-Free" },
    { value: "dairy_free", label: "Dairy-Free" },
    { value: "nut_free", label: "Nut-Free" }
  ];

  // Section Management
  const addSection = () => {
    if (!newSectionName.trim()) return;

    const newSection = {
      id: `section-${Date.now()}`,
      name: newSectionName,
      description: "",
      items: []
    };

    onChange([...sections, newSection]);
    setNewSectionName("");
  };

  const updateSection = (sectionId, field, value) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return { ...section, [field]: value };
      }
      return section;
    });
    onChange(updatedSections);
  };

  const deleteSection = (sectionId) => {
    if (!confirm("Delete this section and all its items?")) return;
    onChange(sections.filter(s => s.id !== sectionId));
  };

  const moveSectionUp = (index) => {
    if (index === 0) return;
    const newSections = [...sections];
    [newSections[index - 1], newSections[index]] = [newSections[index], newSections[index - 1]];
    onChange(newSections);
  };

  const moveSectionDown = (index) => {
    if (index === sections.length - 1) return;
    const newSections = [...sections];
    [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
    onChange(newSections);
  };

  // Item Management
  const addItem = (sectionId) => {
    if (!itemForm.name.trim()) return;

    const newItem = {
      id: `item-${Date.now()}`,
      name: itemForm.name,
      description: itemForm.description,
      price: parseFloat(itemForm.price) || 0,
      dietary_flags: itemForm.dietary_flags
    };

    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return { ...section, items: [...section.items, newItem] };
      }
      return section;
    });

    onChange(updatedSections);
    setItemForm({ name: "", description: "", price: "", dietary_flags: [] });
    setEditingItem(null);
  };

  const updateItem = (sectionId, itemId, updatedItem) => {
    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.map(item =>
            item.id === itemId ? { ...item, ...updatedItem } : item
          )
        };
      }
      return section;
    });

    onChange(updatedSections);
  };

  const deleteItem = (sectionId, itemId) => {
    if (!confirm("Delete this menu item?")) return;

    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          items: section.items.filter(item => item.id !== itemId)
        };
      }
      return section;
    });

    onChange(updatedSections);
  };

  const moveItemUp = (sectionId, itemIndex) => {
    if (itemIndex === 0) return;

    const updatedSections = sections.map(section => {
      if (section.id === sectionId) {
        const newItems = [...section.items];
        [newItems[itemIndex - 1], newItems[itemIndex]] = [newItems[itemIndex], newItems[itemIndex - 1]];
        return { ...section, items: newItems };
      }
      return section;
    });

    onChange(updatedSections);
  };

  const moveItemDown = (sectionId, itemIndex) => {
    const section = sections.find(s => s.id === sectionId);
    if (itemIndex === section.items.length - 1) return;

    const updatedSections = sections.map(s => {
      if (s.id === sectionId) {
        const newItems = [...s.items];
        [newItems[itemIndex], newItems[itemIndex + 1]] = [newItems[itemIndex + 1], newItems[itemIndex]];
        return { ...s, items: newItems };
      }
      return s;
    });

    onChange(updatedSections);
  };

  const toggleDietary = (flag) => {
    setItemForm(prev => ({
      ...prev,
      dietary_flags: prev.dietary_flags.includes(flag)
        ? prev.dietary_flags.filter(f => f !== flag)
        : [...prev.dietary_flags, flag]
    }));
  };

  return (
    <Card className="border-2 border-orange-100">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MenuIcon className="w-5 h-5 text-orange-600" />
          Menu Builder
        </h2>

        {/* Add New Section */}
        <div className="mb-6">
          <Label>Add Menu Section</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={newSectionName}
              onChange={(e) => setNewSectionName(e.target.value)}
              placeholder="e.g., Appetizers, Main Courses, Desserts"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSection();
                }
              }}
            />
            <Button type="button" onClick={addSection} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Section
            </Button>
          </div>
        </div>

        {/* Sections List */}
        <div className="space-y-6">
          {sections.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MenuIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No menu sections yet. Add your first section above.</p>
            </div>
          ) : (
            sections.map((section, sectionIndex) => (
              <div key={section.id} className="border-2 border-gray-200 rounded-lg p-4">
                {/* Section Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {editingSection === section.id ? (
                      <div className="space-y-2">
                        <Input
                          value={section.name}
                          onChange={(e) => updateSection(section.id, "name", e.target.value)}
                          placeholder="Section name"
                          className="font-bold"
                        />
                        <Textarea
                          value={section.description}
                          onChange={(e) => updateSection(section.id, "description", e.target.value)}
                          placeholder="Optional section description"
                          rows={2}
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => setEditingSection(null)}
                        >
                          Done
                        </Button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-bold">{section.name}</h3>
                        {section.description && (
                          <p className="text-sm text-gray-600">{section.description}</p>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSectionUp(sectionIndex)}
                      disabled={sectionIndex === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSectionDown(sectionIndex)}
                      disabled={sectionIndex === sections.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingSection(section.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSection(section.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-2 ml-4">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className="flex items-start justify-between p-3 bg-orange-50 rounded"
                    >
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            {item.description && (
                              <p className="text-sm text-gray-600">{item.description}</p>
                            )}
                          </div>
                          <span className="font-semibold text-orange-600">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                        {item.dietary_flags && item.dietary_flags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.dietary_flags.map(flag => (
                              <Badge key={flag} variant="outline" className="text-xs">
                                {formatLabel(flag)}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1 ml-4">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveItemUp(section.id, itemIndex)}
                          disabled={itemIndex === 0}
                        >
                          <ChevronUp className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => moveItemDown(section.id, itemIndex)}
                          disabled={itemIndex === section.items.length - 1}
                        >
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem(section.id, item.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Add Item Form */}
                  {editingItem === section.id ? (
                    <div className="p-4 bg-gray-50 rounded space-y-3">
                      <div>
                        <Label>Item Name *</Label>
                        <Input
                          value={itemForm.name}
                          onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                          placeholder="e.g., Cheeseburger"
                        />
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={itemForm.description}
                          onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                          placeholder="Optional description"
                          rows={2}
                        />
                      </div>

                      <div>
                        <Label>Price *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={itemForm.price}
                          onChange={(e) => setItemForm({ ...itemForm, price: e.target.value })}
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <Label>Dietary Flags</Label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {dietaryOptions.map(option => (
                            <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                              <Checkbox
                                checked={itemForm.dietary_flags.includes(option.value)}
                                onCheckedChange={() => toggleDietary(option.value)}
                              />
                              <span className="text-sm">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={() => addItem(section.id)}
                          size="sm"
                        >
                          Add Item
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingItem(null);
                            setItemForm({ name: "", description: "", price: "", dietary_flags: [] });
                          }}
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingItem(section.id)}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Menu Item
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <p className="text-sm text-gray-600 mt-4">
          Use the arrow buttons to reorder sections and items. Menu will be saved when you submit the form.
        </p>
      </CardContent>
    </Card>
  );
}
