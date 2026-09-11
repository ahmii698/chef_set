// src/admin/pages/Home.jsx
import React, { useState, useEffect } from "react";
import {
  Save, Upload, Plus, Trash2, Image as ImageIcon,
  Home as HomeIcon, Sparkles, BarChart3, ChevronDown, ChevronUp
} from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { API_URL, STORAGE_URL } from "../../../config";
import "./Home.css";

// ===== Reusable: Image Upload Field =====
const ImageUploadField = ({ label, value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  const getUrl = (img) => {
    if (!img) return "https://placehold.co/200x150/2a2a2a/f5a623?text=?";
    if (img.startsWith("http")) return img;
    return `${STORAGE_URL}/${img}`;
  };

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Sirf image files allowed hain");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image 5MB se choti honi chahiye");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await fetch(`${API_URL}/upload/image`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      onChange(data.filename);
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="hm-form-group">
      <label>{label}</label>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        style={{ display: "none" }}
      />
      {!value ? (
        <button
          type="button"
          className="hm-upload-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload size={16} />
          {uploading ? "Uploading..." : "Choose Image"}
        </button>
      ) : (
        <div className="hm-upload-preview">
          <img src={getUrl(value)} alt="Preview" />
          <div className="hm-upload-actions">
            <button
              type="button"
              className="hm-change-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <ImageIcon size={14} /> {uploading ? "..." : "Change"}
            </button>
            <button
              type="button"
              className="hm-remove-btn"
              onClick={() => onChange("")}
            >
              <Trash2 size={14} /> Remove
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ===== Collapsible Section =====
const Section = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="hm-section">
      <button className="hm-section-header" onClick={() => setOpen(!open)}>
        <div className="hm-section-title">
          <Icon size={18} />
          <span>{title}</span>
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="hm-section-body">{children}</div>}
    </div>
  );
};

const Home = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  const [hero, setHero] = useState(null);
  const [craft, setCraft] = useState(null);
  const [stats, setStats] = useState(null);

  // ===== FETCH ALL HOME DATA =====
  const fetchAll = async () => {
    try {
      setLoading(true);
      const [h, c, s] = await Promise.all([
        fetch(`${API_URL}/home-hero`).then((r) => r.json()),
        fetch(`${API_URL}/home-craft`).then((r) => r.json()),
        fetch(`${API_URL}/home-stats`).then((r) => r.json()),
      ]);
      setHero(h);
      setCraft(c);
      setStats(s);
    } catch (error) {
      toast.error("Failed to load home data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ===== SAVE FUNCTION =====
  const saveSection = async (key, endpoint, data) => {
    if (!data || !data._id) {
      toast.error("❌ Data not loaded properly");
      return;
    }

    setSaving((prev) => ({ ...prev, [key]: true }));
    console.log(`💾 Saving ${key}...`, data);

    try {
      const res = await fetch(`${API_URL}/${endpoint}/${data._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let responseData = null;
      try {
        responseData = await res.json();
      } catch (e) {
        responseData = null;
      }

      if (!res.ok) {
        const errMsg =
          responseData?.message ||
          responseData?.error ||
          `Save failed (Status: ${res.status})`;
        throw new Error(errMsg);
      }

      const saved = responseData || data;
      if (key === "hero") setHero(saved);
      if (key === "craft") setCraft(saved);
      if (key === "stats") setStats(saved);

      toast.success("✅ Saved successfully!", {
        duration: 3000,
        style: {
          background: "#14321e",
          color: "#4ade80",
          border: "1px solid #4ade80",
          fontWeight: "600",
        },
        icon: "🎉",
      });
    } catch (error) {
      console.error(`❌ Save error for ${key}:`, error);
      toast.error(`❌ ${error.message || "Failed to save"}`, {
        duration: 4000,
        style: {
          background: "#3a1a1a",
          color: "#ff6b6b",
          border: "1px solid #ff6b6b",
          fontWeight: "600",
        },
      });
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }));
    }
  };

  // ===== HELPERS =====
  const updateField = (setter, field, value) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (setter, parentKey, field, value) => {
    setter((prev) => ({
      ...prev,
      [parentKey]: { ...(prev[parentKey] || {}), [field]: value },
    }));
  };

  const updateArrayItem = (setter, arrayKey, index, field, value) => {
    setter((prev) => {
      const arr = [...(prev[arrayKey] || [])];
      arr[index] = { ...arr[index], [field]: value };
      return { ...prev, [arrayKey]: arr };
    });
  };

  const addArrayItem = (setter, arrayKey, newItem) => {
    setter((prev) => ({
      ...prev,
      [arrayKey]: [...(prev[arrayKey] || []), newItem],
    }));
  };

  const removeArrayItem = (setter, arrayKey, index) => {
    setter((prev) => ({
      ...prev,
      [arrayKey]: prev[arrayKey].filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="home-layout">
        <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
          <Sidebar />
        </div>
        <div className="home-main">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <div className="home-content">
            <div className="hm-loading">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-layout">
      <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
        <Sidebar />
      </div>

      <div className="home-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="home-content">
          <div className="hm-page-header">
            <div>
              <h1 className="hm-page-title">Home Management</h1>
              <div className="hm-page-breadcrumb">
                <span>Dashboard</span>
                <span className="hm-breadcrumb-sep">›</span>
                <span className="hm-breadcrumb-current">Home</span>
              </div>
            </div>
          </div>

          {/* ==================== 1. HERO SECTION ==================== */}
          {hero && (
            <Section title="Hero Section" icon={HomeIcon} defaultOpen>
              <div className="hm-form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={hero.title || ""}
                  onChange={(e) => updateField(setHero, "title", e.target.value)}
                  placeholder="e.g. BUILT FOR THE SERIOUS"
                />
              </div>

              <div className="hm-form-group">
                <label>Subtitle (Golden Text)</label>
                <input
                  type="text"
                  value={hero.subtitle || ""}
                  onChange={(e) => updateField(setHero, "subtitle", e.target.value)}
                  placeholder="e.g. CHEF."
                />
              </div>

              <div className="hm-form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={hero.description || ""}
                  onChange={(e) => updateField(setHero, "description", e.target.value)}
                  placeholder="Hero description..."
                />
              </div>

              <ImageUploadField
                label="Background Image"
                value={hero.image}
                onChange={(val) => updateField(setHero, "image", val)}
              />

              <h4 className="hm-subheading">Primary Button</h4>
              <div className="hm-form-row">
                <div className="hm-form-group">
                  <label>Button Text</label>
                  <input
                    type="text"
                    value={hero.primaryButton?.text || ""}
                    onChange={(e) =>
                      updateNestedField(setHero, "primaryButton", "text", e.target.value)
                    }
                    placeholder="EXPLORE PRODUCTS"
                  />
                </div>
                <div className="hm-form-group">
                  <label>Button Link</label>
                  <input
                    type="text"
                    value={hero.primaryButton?.link || ""}
                    onChange={(e) =>
                      updateNestedField(setHero, "primaryButton", "link", e.target.value)
                    }
                    placeholder="/products"
                  />
                </div>
              </div>

              <h4 className="hm-subheading">Secondary Button</h4>
              <div className="hm-form-row">
                <div className="hm-form-group">
                  <label>Button Text</label>
                  <input
                    type="text"
                    value={hero.secondaryButton?.text || ""}
                    onChange={(e) =>
                      updateNestedField(setHero, "secondaryButton", "text", e.target.value)
                    }
                    placeholder="DISCOVER CRAFT"
                  />
                </div>
                <div className="hm-form-group">
                  <label>Button Link</label>
                  <input
                    type="text"
                    value={hero.secondaryButton?.link || ""}
                    onChange={(e) =>
                      updateNestedField(setHero, "secondaryButton", "link", e.target.value)
                    }
                    placeholder="/about"
                  />
                </div>
              </div>

              <div className="hm-save-row">
                <button
                  className="hm-save-btn"
                  onClick={() => saveSection("hero", "home-hero", hero)}
                  disabled={saving.hero}
                >
                  <Save size={16} /> {saving.hero ? "Saving..." : "Save Hero Section"}
                </button>
              </div>
            </Section>
          )}

          {/* ==================== 2. CRAFT / TOOLS SECTION ==================== */}
          {craft && (
            <Section title="Craft / Tools Section" icon={Sparkles}>
              <div className="hm-form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={craft.title || ""}
                  onChange={(e) => updateField(setCraft, "title", e.target.value)}
                  placeholder="e.g. TOOLS THAT ELEVATE YOUR CRAFT."
                />
              </div>

              <div className="hm-form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={craft.description || ""}
                  onChange={(e) => updateField(setCraft, "description", e.target.value)}
                />
              </div>

              <div className="hm-form-row">
                <div className="hm-form-group">
                  <label>Button Text</label>
                  <input
                    type="text"
                    value={craft.buttonText || ""}
                    onChange={(e) => updateField(setCraft, "buttonText", e.target.value)}
                    placeholder="Learn More"
                  />
                </div>
                <div className="hm-form-group">
                  <label>Button Link</label>
                  <input
                    type="text"
                    value={craft.buttonLink || ""}
                    onChange={(e) => updateField(setCraft, "buttonLink", e.target.value)}
                    placeholder="/about"
                  />
                </div>
              </div>

              <h4 className="hm-subheading">Features / Cards</h4>
              <div className="hm-array-list">
                {(craft.features || []).map((feature, idx) => (
                  <div className="hm-card-item" key={idx}>
                    <div className="hm-card-header">
                      <span className="hm-card-num">#{idx + 1}</span>
                      <button
                        className="hm-remove-item-btn"
                        onClick={() => removeArrayItem(setCraft, "features", idx)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="hm-form-row">
                      <div className="hm-form-group">
                        <label>Icon (quality/price/safety/industrial)</label>
                        <input
                          type="text"
                          value={feature.icon || ""}
                          onChange={(e) =>
                            updateArrayItem(setCraft, "features", idx, "icon", e.target.value)
                          }
                          placeholder="e.g. quality"
                        />
                      </div>
                      <div className="hm-form-group">
                        <label>Order</label>
                        <input
                          type="number"
                          value={feature.order || 0}
                          onChange={(e) =>
                            updateArrayItem(
                              setCraft,
                              "features",
                              idx,
                              "order",
                              Number(e.target.value)
                            )
                          }
                        />
                      </div>
                    </div>
                    <div className="hm-form-group">
                      <label>Title</label>
                      <input
                        type="text"
                        value={feature.title || ""}
                        onChange={(e) =>
                          updateArrayItem(setCraft, "features", idx, "title", e.target.value)
                        }
                        placeholder="e.g. PROFESSIONAL QUALITY"
                      />
                    </div>
                    <div className="hm-form-group">
                      <label>Description</label>
                      <textarea
                        rows={2}
                        value={feature.description || ""}
                        onChange={(e) =>
                          updateArrayItem(
                            setCraft,
                            "features",
                            idx,
                            "description",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
                <button
                  className="hm-add-item-btn"
                  onClick={() =>
                    addArrayItem(setCraft, "features", {
                      icon: "quality",
                      title: "",
                      description: "",
                      order: (craft.features?.length || 0) + 1,
                    })
                  }
                >
                  <Plus size={14} /> Add Feature
                </button>
              </div>

              <div className="hm-save-row">
                <button
                  className="hm-save-btn"
                  onClick={() => saveSection("craft", "home-craft", craft)}
                  disabled={saving.craft}
                >
                  <Save size={16} /> {saving.craft ? "Saving..." : "Save Craft Section"}
                </button>
              </div>
            </Section>
          )}

          {/* ==================== 3. STATS SECTION ==================== */}
          {stats && (
            <Section title="Stats Section" icon={BarChart3}>
              <h4 className="hm-subheading">Stats</h4>
              <div className="hm-array-list">
                {(stats.stats || []).map((stat, idx) => (
                  <div className="hm-card-item" key={idx}>
                    <div className="hm-card-header">
                      <span className="hm-card-num">#{idx + 1}</span>
                      <button
                        className="hm-remove-item-btn"
                        onClick={() => removeArrayItem(setStats, "stats", idx)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="hm-form-row">
                      <div className="hm-form-group">
                        <label>Number</label>
                        <input
                          type="text"
                          value={stat.number || ""}
                          onChange={(e) =>
                            updateArrayItem(setStats, "stats", idx, "number", e.target.value)
                          }
                          placeholder="e.g. 150+"
                        />
                      </div>
                      <div className="hm-form-group">
                        <label>Label</label>
                        <input
                          type="text"
                          value={stat.label || ""}
                          onChange={(e) =>
                            updateArrayItem(setStats, "stats", idx, "label", e.target.value)
                          }
                          placeholder="e.g. PREMIUM PRODUCTS"
                        />
                      </div>
                    </div>
                    <div className="hm-form-group">
                      <label>Order</label>
                      <input
                        type="number"
                        value={stat.order || 0}
                        onChange={(e) =>
                          updateArrayItem(
                            setStats,
                            "stats",
                            idx,
                            "order",
                            Number(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>
                ))}
                <button
                  className="hm-add-item-btn"
                  onClick={() =>
                    addArrayItem(setStats, "stats", {
                      number: "",
                      label: "",
                      order: (stats.stats?.length || 0) + 1,
                    })
                  }
                >
                  <Plus size={14} /> Add Stat
                </button>
              </div>

              <div className="hm-save-row">
                <button
                  className="hm-save-btn"
                  onClick={() => saveSection("stats", "home-stats", stats)}
                  disabled={saving.stats}
                >
                  <Save size={16} /> {saving.stats ? "Saving..." : "Save Stats Section"}
                </button>
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;