// src/admin/pages/AboutUs.jsx
import React, { useState } from "react";
import {
  Save,
  Eye,
  Upload,
  Trash2,
  X,
  Plus,
  Award,
  ShieldCheck,
  ChefHat,
  Headphones,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./About_us.css";

const iconOptions = {
  Award: Award,
  ShieldCheck: ShieldCheck,
  ChefHat: ChefHat,
  Headphones: Headphones,
};

const initialFeatures = [
  {
    id: 1,
    icon: "Award",
    title: "Premium Quality",
    description: "We use the finest materials to ensure top-notch quality.",
  },
  {
    id: 2,
    icon: "ShieldCheck",
    title: "Built to Last",
    description: "Durable and reliable tools designed to last for years.",
  },
  {
    id: 3,
    icon: "ChefHat",
    title: "Trusted by Experts",
    description: "Used and recommended by professional chefs worldwide.",
  },
  {
    id: 4,
    icon: "Headphones",
    title: "Customer Support",
    description: "Our support team is always here to help you.",
  },
];

const AboutUs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [heading, setHeading] = useState("A LEGACY OF QUALITY");
  const [paragraph1, setParagraph1] = useState(
    "Chefset was founded by professional chefs who understood the importance of quality tools in the kitchen. From the very first product, our mission has remained the same."
  );
  const [paragraph2, setParagraph2] = useState(
    "We set out to create high-quality kitchen equipment that meets the demands of professionals and home cooks alike, without compromise on durability or design."
  );
  const [paragraph3, setParagraph3] = useState(
    "Today, Chefset is proud to be a trusted name in kitchen tools — delivering excellence in every kitchen we're a part of."
  );
  const [image, setImage] = useState(
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
  );
  const [features, setFeatures] = useState(initialFeatures);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => setImage(null);

  const updateFeature = (id, field, value) => {
    setFeatures((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const removeFeature = (id) => {
    setFeatures((prev) => prev.filter((f) => f.id !== id));
  };

  const addFeature = () => {
    const newFeature = {
      id: Date.now(),
      icon: "Award",
      title: "",
      description: "",
    };
    setFeatures((prev) => [...prev, newFeature]);
  };

  return (
    <div className="about-layout">
      <div className={`sidebar-wrapper ${sidebarOpen ? "" : "collapsed"}`}>
        <Sidebar />
      </div>

      <div className="about-main">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <div className="about-content">
          {/* Header */}
          <div className="about-header">
            <div>
              <h1 className="about-title">About Us / Our Story</h1>
              <div className="about-breadcrumb">
                <span>Dashboard</span>
                <span className="breadcrumb-sep">›</span>
                <span className="breadcrumb-active">About Us</span>
              </div>
            </div>
            <button className="btn-primary">
              <Save size={16} />
              Save Changes
            </button>
          </div>

          {/* Top grid: Content + Image */}
          <div className="top-grid">
            {/* About Content */}
            <div className="card">
              <h3 className="card-title">About Content</h3>

              <label className="field-label">Heading</label>
              <input
                type="text"
                className="text-input"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
              />

              <label className="field-label">Paragraph 1</label>
              <textarea
                className="textarea-input"
                rows={3}
                value={paragraph1}
                onChange={(e) => setParagraph1(e.target.value)}
              />

              <label className="field-label">Paragraph 2</label>
              <textarea
                className="textarea-input"
                rows={3}
                value={paragraph2}
                onChange={(e) => setParagraph2(e.target.value)}
              />

              <label className="field-label">Paragraph 3</label>
              <textarea
                className="textarea-input"
                rows={3}
                value={paragraph3}
                onChange={(e) => setParagraph3(e.target.value)}
              />

              <button className="btn-outline preview-btn">
                <Eye size={15} />
                Preview Changes
              </button>
            </div>

            {/* About Image */}
            <div className="card">
              <h3 className="card-title">About Image</h3>

              {image ? (
                <div className="image-preview">
                  <img src={image} alt="About" />
                  <button className="image-close-btn" onClick={removeImage}>
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="image-placeholder">No image selected</div>
              )}

              <div className="image-actions">
                <label className="btn-outline change-image-btn">
                  <Upload size={15} />
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </label>
                <button className="btn-danger" onClick={removeImage}>
                  <Trash2 size={15} />
                  Remove Image
                </button>
              </div>

              <p className="image-hint">
                Recommended size: 1200x800px (JPG, PNG or WebP)
              </p>
              <p className="image-hint">Max file size: 2MB</p>
            </div>
          </div>

          {/* About Features */}
          <div className="card features-card">
            <div className="features-header">
              <h3 className="card-title">About Features (Optional)</h3>
              <button className="btn-outline" onClick={addFeature}>
                <Plus size={15} />
                Add New Feature
              </button>
            </div>

            <div className="features-grid">
              {features.map((f) => {
                const IconComp = iconOptions[f.icon] || Award;
                return (
                  <div className="feature-card" key={f.id}>
                    <button
                      className="feature-remove-btn"
                      onClick={() => removeFeature(f.id)}
                    >
                      <X size={14} />
                    </button>

                    <div className="feature-icon">
                      <IconComp size={20} />
                    </div>

                    <label className="field-label">Title</label>
                    <input
                      type="text"
                      className="text-input"
                      value={f.title}
                      onChange={(e) =>
                        updateFeature(f.id, "title", e.target.value)
                      }
                    />

                    <label className="field-label">Description</label>
                    <textarea
                      className="textarea-input small"
                      rows={2}
                      value={f.description}
                      onChange={(e) =>
                        updateFeature(f.id, "description", e.target.value)
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;