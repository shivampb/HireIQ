'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

const compressImage = (file: File, maxWidth = 400, maxHeight = 400, quality = 0.7): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profile, setProfile] = useState({
    name: '',
    industry: '',
    logo: '',
    description: '',
    website: '',
    location: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/company/profile')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setProfile({
            name: data.name || '',
            industry: data.industry || '',
            logo: data.logo || '',
            description: data.description || '',
            website: data.website || '',
            location: data.location || '',
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }

    try {
      const compressed = await compressImage(file);
      setProfile({ ...profile, logo: compressed });
    } catch (err) {
      setError('Failed to process image.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/company/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setSuccess('Profile updated successfully!');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <p className="loading-text">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">Company Profile</h1>
        <p className="page-subtitle">Manage your company branding and information.</p>
      </div>

      <div className="card glass-card overflow-hidden">
        <div className="profile-hero-bg" style={{ height: '100px', background: 'linear-gradient(135deg, var(--primary-600), var(--violet-600))' }}></div>
        <div className="px-8 pb-8">
          <div className="relative" style={{ marginTop: '-40px', marginBottom: '24px' }}>
            <div className="profile-logo-wrapper">
              {profile.logo ? (
                <img src={profile.logo} alt="Company Logo" className="profile-logo-img" />
              ) : (
                <div className="profile-logo-placeholder">
                  {profile.name[0]?.toUpperCase() || 'H'}
                </div>
              )}
              <button 
                className="profile-logo-edit"
                onClick={() => fileInputRef.current?.click()}
              >
                📷
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleLogoChange} 
                className="hidden" 
                accept="image/*"
              />
            </div>
          </div>

          {error && <div className="alert alert-error mb-6">⚠️ {error}</div>}
          {success && <div className="alert alert-success mb-6">✅ {success}</div>}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-grid">
              <div className="form-group col-span-2 sm:col-span-1">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group col-span-2 sm:col-span-1">
                <label className="form-label">Industry</label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.industry}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                  required
                />
              </div>

              <div className="form-group col-span-2 sm:col-span-1">
                <label className="form-label">Website</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://company.com"
                  value={profile.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                />
              </div>

              <div className="form-group col-span-2 sm:col-span-1">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="San Francisco, CA"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                />
              </div>

              <div className="form-group col-span-2">
                <label className="form-label">Company Description</label>
                <textarea
                  className="form-input min-h-[120px]"
                  placeholder="Tell candidates about your company culture and mission..."
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="btn btn-primary btn-lg px-8"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <style jsx>{`
        .profile-logo-wrapper {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          background: white;
          border: 4px solid white;
          box-shadow: var(--shadow-lg);
          position: relative;
          overflow: visible;
        }
        .profile-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
        }
        .profile-logo-placeholder {
          width: 100%;
          height: 100%;
          background: var(--primary-100);
          color: var(--primary-600);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          font-weight: 700;
          border-radius: 12px;
        }
        .profile-logo-edit {
          position: absolute;
          bottom: -8px;
          right: -8px;
          width: 28px;
          height: 28px;
          background: white;
          border: 1px solid var(--gray-200);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: all 0.2s;
        }
        .profile-logo-edit:hover {
          transform: scale(1.1);
          border-color: var(--primary-400);
        }
        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .col-span-2 {
          grid-column: span 2;
        }
        @media (max-width: 640px) {
          .sm\\:col-span-1 {
            grid-column: span 2;
          }
        }
        .hidden { display: none; }
      `}</style>
    </div>
  );
}
