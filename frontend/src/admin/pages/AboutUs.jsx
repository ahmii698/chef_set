// src/admin/pages/AboutUs.jsx
import React, { useState, useEffect } from "react";
import {
  Save, Upload, X, Plus, Trash2, Image as ImageIcon,
  Info, BookOpen, Gem, Star, Trophy, ChevronDown, ChevronUp
} from "lucide-react";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { API_URL, STORAGE_URL } from "../../../config";
import "./AboutUs.css";

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
    <div className="ab-form-group">
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
          className="ab-upload-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <Upload size={16} />
          {uploading ? "Uploading..." : "Choose Image"}
        </button>
      ) : (
        <div className="ab-upload-preview">
          <img src={getUrl(value)} alt="Preview" />
          <div className="ab-upload-actions">
            <button
              type="button"
              className="ab-change-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <ImageIcon size={14} /> {uploading ? "..." : "Change"}
            </button>
            <button
              type="button"
              className="ab-remove-btn"
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

// ===== Collapsible Section Component =====
const Section = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="ab-section">
      <button className="ab-section-header" onClick={() => setOpen(!open)}>
        <div className="ab-section-title">
          <Icon size={18} />
          <span>{title}</span>
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {open && <div className="ab-section-body">{children}</div>}
    </div>
  );
};

const AboutUs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  // Data states
  const [header, setHeader] = useState(null);
  const [story, setStory] = useState(null);
  const [values, setValues] = useState(null);
  const [whyChooseUs, setWhyChooseUs] = useState(null);
  const [achievement, setAchievement] = useState(null);

  // ===== FETCH ALL ABOUT DATA =====
  const fetchAll = async () => {
    try {
      setLoading(true);
      const [h, s, v, w, a] = await Promise.all([
        fetch(`${API_URL}/about-header`).then((r) => r.json()),
        fetch(`${API_URL}/about-story`).then((r) => r.json()),
        fetch(`${API_URL}/about-values`).then((r) => r.json()),
        fetch(`${API_URL}/about-why-choose-us`).then((r) => r.json()),
        fetch(`${API_URL}/about-achievement`).then((r) => r.json()),
      ]);
      setHeader(h);
      setStory(s);
      setValues(v);
      setWhyChooseUs(w);
      setAchievement(a);
    } catch (error) {
      toast.error("Failed to load about data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ===== SAVE FUNCTION (IMPROVED) =====
  const saveSection = async (key, endpoint, data) => {
    // Validate data
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

      // Safely parse JSON (even if error)
      let responseData = null;
      try {
        responseData = await res.json();
      } catch (e) {
        responseData = null;
      }

      console.log(`📥 Response status: ${res.status}`, responseData);

      if (!res.ok) {
        // Backend error message extract karo
        const errMsg =
          responseData?.message ||
          responseData?.error ||
          `Save failed (Status: ${res.status})`;
        throw new Error(errMsg);
      }

      // Update state
      const saved = responseData || data;
      if (key === "header") setHeader(saved);
      if (key === "story") setStory(saved);
      if (key === "values") setValues(saved);
      if (key === "whyChooseUs") setWhyChooseUs(saved);
      if (key === "achievement") setAchievement(saved);

      // ✅ SUCCESS TOAST
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

      // ❌ ERROR TOAST
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

  // ===== HANDLE CHANGE HELPERS =====
  const updateField = (setter, field, value) => {
    setter((prev) => ({ ...prev, [field]: value }));
  };

  // ===== ARRAY HELPERS =====
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
      <div className="about-us-layout">
        <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
          <Sidebar />
        </div>
        <div className="about-us-main">
          <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <div className="about-us-content">
            <div className="ab-loading">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="about-us-layout">
      <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
        <Sidebar />
      </div>

      <div className="about-us-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="about-us-content">
          {/* Header */}
          <div className="ab-page-header">
            <div>
              <h1 className="ab-page-title">About Us Management</h1>
              <div className="ab-page-breadcrumb">
                <span>Dashboard</span>
                <span className="ab-breadcrumb-sep">›</span>
                <span className="ab-breadcrumb-current">About Us</span>
              </div>
            </div>
          </div>

          {/* ==================== 1. HERO SECTION ==================== */}
          {header && (
            <Section title="Hero Section" icon={Info} defaultOpen>
              <div className="ab-form-group">
                <label>Heading (Tag)</label>
                <input
                  type="text"
                  value={header.heading || ""}
                  onChange={(e) => updateField(setHeader, "heading", e.target.value)}
                  placeholder="e.g. ABOUT US"
                />
              </div>

              <div className="ab-form-group">
                <label>Sub Heading</label>
                <input
                  type="text"
                  value={header.subheading || ""}
                  onChange={(e) => updateField(setHeader, "subheading", e.target.value)}
                  placeholder="e.g. BUILT FOR CHEFS. DRIVEN BY PASSION."
                />
              </div>

              <div className="ab-form-group">
                <label>Description</label>
                <textarea
                  rows={4}
                  value={header.description || ""}
                  onChange={(e) => updateField(setHeader, "description", e.target.value)}
                  placeholder="Hero section description..."
                />
              </div>

              <ImageUploadField
                label="Background Image"
                value={header.image}
                onChange={(val) => updateField(setHeader, "image", val)}
              />

              <div className="ab-save-row">
                <button
                  className="ab-save-btn"
                  onClick={() => saveSection("header", "about-header", header)}
                  disabled={saving.header}
                >
                  <Save size={16} /> {saving.header ? "Saving..." : "Save Hero Section"}
                </button>
              </div>
            </Section>
          )}

          {/* ==================== 2. STORY SECTION ==================== */}
          {story && (
            <Section title="Our Story & Mission" icon={BookOpen}>
              <h4 className="ab-subheading">Story Part</h4>
              <div className="ab-form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={story.title || ""}
                  onChange={(e) => updateField(setStory, "title", e.target.value)}
                />
              </div>
              <div className="ab-form-group">
                <label>Subtitle</label>
                <input
                  type="text"
                  value={story.subtitle || ""}
                  onChange={(e) => updateField(setStory, "subtitle", e.target.value)}
                />
              </div>
              <div className="ab-form-group">
                <label>Description</label>
                <textarea
                  rows={4}
                  value={story.description || ""}
                  onChange={(e) => updateField(setStory, "description", e.target.value)}
                  placeholder="Use blank line for paragraph break"
                />
              </div>
              <ImageUploadField
                label="Story Image"
                value={story.image}
                onChange={(val) => updateField(setStory, "image", val)}
              />

              <h4 className="ab-subheading">Mission Part</h4>
              <div className="ab-form-group">
                <label>Mission Title</label>
                <input
                  type="text"
                  value={story.missionTitle || ""}
                  onChange={(e) => updateField(setStory, "missionTitle", e.target.value)}
                />
              </div>
              <div className="ab-form-group">
                <label>Mission Subtitle</label>
                <input
                  type="text"
                  value={story.missionSubtitle || ""}
                  onChange={(e) => updateField(setStory, "missionSubtitle", e.target.value)}
                />
              </div>
              <div className="ab-form-group">
                <label>Mission Description</label>
                <textarea
                  rows={3}
                  value={story.missionDescription || ""}
                  onChange={(e) => updateField(setStory, "missionDescription", e.target.value)}
                />
              </div>

              <h4 className="ab-subheading">Mission Points</h4>
              <div className="ab-array-list">
                {(story.missionPoints || []).map((point, idx) => (
                  <div className="ab-array-item" key={idx}>
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => {
                        const arr = [...story.missionPoints];
                        arr[idx] = e.target.value;
                        updateField(setStory, "missionPoints", arr);
                      }}
                      placeholder="e.g. Premium Quality - Uncompromising standards"
                    />
                    <button
                      className="ab-remove-item-btn"
                      onClick={() => {
                        const arr = story.missionPoints.filter((_, i) => i !== idx);
                        updateField(setStory, "missionPoints", arr);
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  className="ab-add-item-btn"
                  onClick={() =>
                    updateField(setStory, "missionPoints", [
                      ...(story.missionPoints || []),
                      "",
                    ])
                  }
                >
                  <Plus size={14} /> Add Point
                </button>
              </div>

              <div className="ab-save-row">
                <button
                  className="ab-save-btn"
                  onClick={() => saveSection("story", "about-story", story)}
                  disabled={saving.story}
                >
                  <Save size={16} /> {saving.story ? "Saving..." : "Save Story Section"}
                </button>
              </div>
            </Section>
          )}

          {/* ==================== 3. VALUES SECTION ==================== */}
          {values && (
            <Section title="Our Values" icon={Gem}>
              <div className="ab-form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={values.title || ""}
                  onChange={(e) => updateField(setValues, "title", e.target.value)}
                />
              </div>
              <div className="ab-form-group">
                <label>Subtitle</label>
                <input
                  type="text"
                  value={values.subtitle || ""}
                  onChange={(e) => updateField(setValues, "subtitle", e.target.value)}
                />
              </div>

              <h4 className="ab-subheading">Values</h4>
              <div className="ab-array-list">
                {(values.values || []).map((val, idx) => (
                  <div className="ab-card-item" key={idx}>
                    <div className="ab-card-header">
                      <span className="ab-card-num">#{idx + 1}</span>
                      <button
                        className="ab-remove-item-btn"
                        onClick={() =>
                          updateField(
                            setValues,
                            "values",
                            values.values.filter((_, i) => i !== idx)
                          )
                        }
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="ab-form-group">
                      <label>Value Name</label>
                      <input
                        type="text"
                        value={val.name || ""}
                        onChange={(e) =>
                          updateArrayItem(setValues, "values", idx, "name", e.target.value)
                        }
                        placeholder="e.g. QUALITY"
                      />
                    </div>
                    <div className="ab-form-group">
                      <label>Description</label>
                      <textarea
                        rows={2}
                        value={val.description || ""}
                        onChange={(e) =>
                          updateArrayItem(setValues, "values", idx, "description", e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}
                <button
                  className="ab-add-item-btn"
                  onClick={() =>
                    addArrayItem(setValues, "values", { name: "", description: "" })
                  }
                >
                  <Plus size={14} /> Add Value
                </button>
              </div>

              <div className="ab-save-row">
                <button
                  className="ab-save-btn"
                  onClick={() => saveSection("values", "about-values", values)}
                  disabled={saving.values}
                >
                  <Save size={16} /> {saving.values ? "Saving..." : "Save Values"}
                </button>
              </div>
            </Section>
          )}

          {/* ==================== 4. WHY CHOOSE US ==================== */}
          {whyChooseUs && (
            <Section title="Why Choose Us" icon={Star}>
              <div className="ab-form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={whyChooseUs.title || ""}
                  onChange={(e) => updateField(setWhyChooseUs, "title", e.target.value)}
                />
              </div>
              <div className="ab-form-group">
                <label>Subtitle</label>
                <input
                  type="text"
                  value={whyChooseUs.subtitle || ""}
                  onChange={(e) => updateField(setWhyChooseUs, "subtitle", e.target.value)}
                />
              </div>

              <h4 className="ab-subheading">Points</h4>
              <div className="ab-array-list">
                {(whyChooseUs.points || []).map((point, idx) => (
                  <div className="ab-array-item" key={idx}>
                    <input
                      type="text"
                      value={point}
                      onChange={(e) => {
                        const arr = [...whyChooseUs.points];
                        arr[idx] = e.target.value;
                        updateField(setWhyChooseUs, "points", arr);
                      }}
                    />
                    <button
                      className="ab-remove-item-btn"
                      onClick={() =>
                        updateField(
                          setWhyChooseUs,
                          "points",
                          whyChooseUs.points.filter((_, i) => i !== idx)
                        )
                      }
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  className="ab-add-item-btn"
                  onClick={() =>
                    updateField(setWhyChooseUs, "points", [
                      ...(whyChooseUs.points || []),
                      "",
                    ])
                  }
                >
                  <Plus size={14} /> Add Point
                </button>
              </div>

              <ImageUploadField
                label="Why Choose Us Image"
                value={whyChooseUs.image}
                onChange={(val) => updateField(setWhyChooseUs, "image", val)}
              />

              <div className="ab-save-row">
                <button
                  className="ab-save-btn"
                  onClick={() =>
                    saveSection("whyChooseUs", "about-why-choose-us", whyChooseUs)
                  }
                  disabled={saving.whyChooseUs}
                >
                  <Save size={16} /> {saving.whyChooseUs ? "Saving..." : "Save Section"}
                </button>
              </div>
            </Section>
          )}

          {/* ==================== 5. ACHIEVEMENTS ==================== */}
          {achievement && (
            <Section title="Achievements / Stats" icon={Trophy}>
              <div className="ab-array-list">
                {(achievement.achievements || []).map((ach, idx) => (
                  <div className="ab-card-item" key={idx}>
                    <div className="ab-card-header">
                      <span className="ab-card-num">#{idx + 1}</span>
                      <button
                        className="ab-remove-item-btn"
                        onClick={() =>
                          updateField(
                            setAchievement,
                            "achievements",
                            achievement.achievements.filter((_, i) => i !== idx)
                          )
                        }
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="ab-form-row">
                      <div className="ab-form-group">
                        <label>Number</label>
                        <input
                          type="text"
                          value={ach.number || ""}
                          onChange={(e) =>
                            updateArrayItem(
                              setAchievement,
                              "achievements",
                              idx,
                              "number",
                              e.target.value
                            )
                          }
                          placeholder="e.g. 25+"
                        />
                      </div>
                      <div className="ab-form-group">
                        <label>Label</label>
                        <input
                          type="text"
                          value={ach.label || ""}
                          onChange={(e) =>
                            updateArrayItem(
                              setAchievement,
                              "achievements",
                              idx,
                              "label",
                              e.target.value
                            )
                          }
                          placeholder="e.g. Years of Experience"
                        />
                      </div>
                    </div>
                    <div className="ab-form-group">
                      <label>Icon (Emoji)</label>
                      <input
                        type="text"
                        value={ach.icon || ""}
                        onChange={(e) =>
                          updateArrayItem(
                            setAchievement,
                            "achievements",
                            idx,
                            "icon",
                            e.target.value
                          )
                        }
                        placeholder="e.g. 🏆"
                      />
                    </div>
                  </div>
                ))}
                <button
                  className="ab-add-item-btn"
                  onClick={() =>
                    addArrayItem(setAchievement, "achievements", {
                      number: "",
                      label: "",
                      icon: "",
                    })
                  }
                >
                  <Plus size={14} /> Add Achievement
                </button>
              </div>

              <div className="ab-save-row">
                <button
                  className="ab-save-btn"
                  onClick={() =>
                    saveSection("achievement", "about-achievement", achievement)
                  }
                  disabled={saving.achievement}
                >
                  <Save size={16} /> {saving.achievement ? "Saving..." : "Save Achievements"}
                </button>
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;